// Dieser Service Worker kann für Hintergrundaufgaben verwendet werden,
// z.B. das Empfangen von Nachrichten oder das Verwalten des Extension-Zustands.
console.log("Background Service Worker loaded.");

chrome.runtime.onInstalled.addListener(() => {
    if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
        chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    }
});

chrome.action.onClicked.addListener(async (tab) => {
    try {
        await chrome.sidePanel.setOptions({
            tabId: tab.id,
            enabled: true
        });
        await chrome.sidePanel.open({ tabId: tab.id });
    } catch (e) {
        console.error('Failed to open side panel', e);
    }
});

let chatgptTabId = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.type === 'register-chatgpt-tab' && sender.tab) {
        chatgptTabId = sender.tab.id;
    } else if (msg && msg.type === 'get-chatgpt-tab') {
        sendResponse({ tabId: chatgptTabId });
    }
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId === chatgptTabId) {
        chatgptTabId = null;
    }
});