async function ensureOffscreen() {
  const exists = await chrome.offscreen.hasDocument();
  if (!exists) {
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["BULK_PROCESSING"],
      justification: "Need a persistent environment for button automation",
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "START") {
    // Get the active tab id
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        message.tabId = tabs[0].id;
        await ensureOffscreen();
        chrome.runtime.sendMessage({ type: "START_OFFSCREEN", config: message });
      }
    });
  } else if (message.type === "STOP") {
    chrome.runtime.sendMessage({ type: "STOP_OFFSCREEN" });
  }
});
