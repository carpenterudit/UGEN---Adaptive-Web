/**
 * UPGW Extension Background Service Worker
 * Coordinates communication between the extension popup, active tab, and UPGW backend.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log("[UPGW Extension] Service worker initialized successfully.");
});

// Relay API requests to UPGW backend to avoid CORS restrictions if needed
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FETCH_BACKEND_PLAN") {
    fetch("http://127.0.0.1:8000/api/v1/extension/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request.payload)
    })
      .then(res => res.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Keep channel open
  }

  if (request.type === "RECORD_APPLIED") {
    fetch("http://127.0.0.1:8000/api/v1/extension/apply-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request.payload)
    })
      .then(res => res.json())
      .then(data => sendResponse({ success: true, data }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});
