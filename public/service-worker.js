chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.windows.getLastFocused().then((window) => {
      chrome.sidePanel.open({ windowId: window.id });
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTabUrl") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        sendResponse({ url: tabs[0].url });
      } else {
        sendResponse({ url: null });
      }
    });
    return true; // Keep the message channel open for asynchronous response
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  notifyAppWithActiveTabUrl();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    notifyAppWithActiveTabUrl();
  }
});

function notifyAppWithActiveTabUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const activeTab = tabs[0];
      chrome.runtime.sendMessage({
        action: "updateTabUrl",
        url: activeTab.url,
      });
    }
  });
}
