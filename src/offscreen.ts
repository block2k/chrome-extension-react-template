let intervalId = null;
let config = {
  selectorA: "",
  selectorB: "",
  delay: 5000, // default delay in milliseconds
  nextButton: "A",
  tabId: null,
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "START_OFFSCREEN") {
    config = {
      ...config,
      ...message.config, // includes selectorA, selectorB, delay, and tabId
      nextButton: "A",
    };
    if (intervalId) clearInterval(intervalId);
    // Optionally trigger the first click immediately
    clickButton();
    intervalId = setInterval(clickButton, config.delay);
  } else if (message.type === "STOP_OFFSCREEN") {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
});

function clickButton() {
  if (!config.tabId) {
    console.warn("No target tab specified.");
    return;
  }
  const selector = config.nextButton === "A" ? config.selectorA : config.selectorB;
  chrome.scripting.executeScript({
    target: { tabId: config.tabId },
    func: (sel) => {
      const element = document.querySelector(sel);
      if (element) {
        element.click();
      } else {
        console.warn("Element not found for selector:", sel);
      }
    },
    args: [selector],
  });
  config.nextButton = config.nextButton === "A" ? "B" : "A";
}
