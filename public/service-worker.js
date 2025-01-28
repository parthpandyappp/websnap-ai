chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTabUrl") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log({ tabs, len: tabs.length });
      if (tabs && tabs.length > 0) {
        console.log("yeh chalaa");
        sendResponse({ url: tabs[0].url });
      } else {
        sendResponse({ url: null });
      }
    });
    return true; // Keep the message channel open until the response is sent
  }
});

// Listen for changes to the active tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  notifyPanelWithActiveTabUrl();
});

// Listen for updates to any tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {
    notifyPanelWithActiveTabUrl();
  }
});

// Notify the panel with the active tab's URL
function notifyPanelWithActiveTabUrl() {
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

// Optional: For setting side panel behavior
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
