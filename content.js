// This file is for content scripts that interact with the web pages
// Currently, there's not much needed, but this could be expanded for:
// - Automatically detecting class assignments from Learning Management Systems (LMS)
// - Scraping class information
// - Adding buttons to the page for quickly saving assignments

console.log('Class Tracker Extension loaded');

// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    // Example: getting page info to detect if we're on a class page
    const pageInfo = {
      title: document.title,
      url: window.location.href
    };
    sendResponse(pageInfo);
  }
  
  // Return true to indicate we'll respond asynchronously
  return true;
});