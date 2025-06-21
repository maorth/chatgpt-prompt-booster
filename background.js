// Dieser Service Worker kann für Hintergrundaufgaben verwendet werden,
// z.B. das Empfangen von Nachrichten oder das Verwalten des Extension-Zustands.
console.log("Background Service Worker loaded.");

chrome.runtime.onInstalled.addListener(() => {
    if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
        chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    }
});
