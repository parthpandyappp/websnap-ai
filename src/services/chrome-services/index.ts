import type { Message } from "../../types/chrome";

export const fetchActiveTabUrl = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getTabUrl" }, (response) => {
      resolve(response?.url || null);
    });
  });
};

export const listenForUrlUpdates = (
  callback: (url: string | null) => void
): (() => void) => {
  const handleMessage = (message: Message) => {
    if (message.action === "updateTabUrl") {
      callback(message.url || null);
    }
  };

  chrome.runtime.onMessage.addListener(handleMessage);

  return () => {
    chrome.runtime.onMessage.removeListener(handleMessage);
  };
};
