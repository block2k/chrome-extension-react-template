(() => {
  let intervalId = null;
  let current = "A";
  let config = {
    selectorA: null,
    selectorB: null,
    delay: 1000,
  };
  let counter = 0;

  const clickButton = () => {
    console.log(`Clicking button ${current} - ${counter ? `(${counter})` : ""}`);
    counter++;
    const selector = current === "A" ? config.selectorA : config.selectorB;
    const element = document.querySelector(selector);
    if (element) {
      element.click();
    } else {
      console.warn(`Element not found for selector: ${selector}`);
    }
    // Toggle for next click
    current = current === "A" ? "B" : "A";
  };

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "START") {
      // Clear any existing interval before starting a new one
      if (intervalId) clearInterval(intervalId);

      config.selectorA = message.selectorA;
      config.selectorB = message.selectorB;
      config.delay = message.delay;
      current = "A"; // reset cycle

      // Immediately click on button A
      clickButton();

      // Set interval to alternate clicks
      intervalId = setInterval(clickButton, config.delay);
    } else if (message.type === "STOP") {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  });
})();
