import { useState } from "react";

function App() {
  const [selectorA, setSelectorA] = useState(
    "#AppFrameNav > div > nav > div.Polaris-Navigation__PrimaryNavigation.Polaris-Scrollable.Polaris-Scrollable--vertical.Polaris-Scrollable--horizontal.Polaris-Scrollable--scrollbarWidthThin > ul > li:nth-child(2) > ul > li:nth-child(3) > ul > li > div.Polaris-Navigation__ItemWrapper > div > a"
  );
  const [selectorB, setSelectorB] = useState(
    "#AppFrameNav > div > nav > div.Polaris-Navigation__PrimaryNavigation.Polaris-Scrollable.Polaris-Scrollable--vertical.Polaris-Scrollable--horizontal.Polaris-Scrollable--scrollbarWidthThin > div:nth-child(1) > ul > li:nth-child(8) > div > div > a"
  );
  const [delay, setDelay] = useState(5); // seconds
  const [running, setRunning] = useState(false);

  const sendMessageToContentScript = (message) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      }
    });
  };

  const handleStart = () => {
    const delayMs = parseFloat(delay) * 1000;
    if (!selectorA || !selectorB || isNaN(delayMs)) {
      alert("Please provide valid selectors and delay.");
      return;
    }
    sendMessageToContentScript({
      type: "START",
      selectorA,
      selectorB,
      delay: delayMs,
    });
    setRunning(true);
  };

  const handleStop = () => {
    sendMessageToContentScript({ type: "STOP" });
    setRunning(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Auto Button Clicker</h1>
      <div>
        <label>
          Selector App:
          <input type="text" value={selectorA} onChange={(e) => setSelectorA(e.target.value)} placeholder="#buttonA" />
        </label>
      </div>
      <div>
        <label>
          Selector DiscountTab:
          <input type="text" value={selectorB} onChange={(e) => setSelectorB(e.target.value)} placeholder=".buttonB" />
        </label>
      </div>
      <div>
        <label>
          Delay (seconds):
          <input type="number" value={delay} onChange={(e) => setDelay(e.target.value)} placeholder="5" />
        </label>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleStart} disabled={running}>
          Start
        </button>
        <button onClick={handleStop} disabled={!running}>
          Stop
        </button>
      </div>
    </div>
  );
}

export default App;
