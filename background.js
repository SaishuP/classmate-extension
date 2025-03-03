// Listen for extension installation or update
chrome.runtime.onInstalled.addListener(() => {
    console.log('Class Tracker Extension installed/updated');
  });
  
  // Open the side panel when the extension icon is clicked
  chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ tabId: tab.id });
  });
  
  // Listen for messages from the content script or popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openSidePanel') {
      chrome.sidePanel.open({ tabId: sender.tab.id });
      sendResponse({ success: true });
    }
    
    // Return true to indicate we'll respond asynchronously
    return true;
  });