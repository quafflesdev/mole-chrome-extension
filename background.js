console.log("background script started");
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  myURL = tab.url;
  console.log("Tab updated:", myURL);
});
