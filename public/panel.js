document.addEventListener("DOMContentLoaded", () => {
  // Initial fetch of the active tab URL
  chrome.runtime.sendMessage({ action: "getTabUrl" }, (response) => {
    const urlElement = document.getElementById("url");
    console.log({ response });
    if (response.url) {
      urlElement.textContent = response.url;
    } else {
      urlElement.textContent = "No URL found.";
    }
  });

  // Listen for messages from the background script to update the URL dynamically
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateTabUrl") {
      const urlElement = document.getElementById("url");
      urlElement.textContent = message.url || "No URL found.";
      console.log("Updated URL:", message.url);
    }
  });
});
