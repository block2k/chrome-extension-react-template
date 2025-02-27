import { useRef } from "react";

interface Selector {
  appTab: string;
  discountTab: string;
}

const useAutoClicker = (selector: Selector, delay: number) => {
  const intervalRef = useRef<null | number>(null);

  const clickElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.click();
    } else {
      console.warn("Element not found:", selector);
    }
  };

  const startClicking = () => {
    console.log("Start clicking");
    if (intervalRef.current) return; // Prevent multiple intervals

    intervalRef.current = setInterval(() => {
      clickElement(selector.discountTab);
      setTimeout(() => {
        clickElement(selector.appTab);
      }, delay);
    }, delay + 1000);
  };

  const stopClicking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return { startClicking, stopClicking };
};

export default useAutoClicker;
