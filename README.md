# ChatGPT Prompt Manager

A Chrome extension for managing and executing ChatGPT prompts and prompt chains.

## Features

- **Store prompts locally** in `chrome.storage` with title, text, description, and favorite flag.
- **Create prompt chains** consisting of multiple prompts executed sequentially.
- **Variable placeholders**: prompts can contain `{{variable}}` tokens that are filled in when executed.
- **Popup interface**: edit, delete, favorite, and run prompts or chains.
- **Content script integration**: automatically sends prompts to an open ChatGPT tab and waits for the response.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode".
4. Click "Load unpacked" and select this project directory.

The extension icon will appear in your toolbar.

## Usage

1. Open a ChatGPT tab (`https://chat.openai.com` or `https://chatgpt.com`).
2. Click the extension icon to open the popup.
3. Create new prompts or chains using the provided forms.
4. Click the play button to execute a prompt or chain in the active ChatGPT tab.
5. If variables are detected, you will be prompted to enter values before execution.

## File Overview

- `manifest.json` – Chrome extension manifest.
- `popup.html`, `popup.js`, `style.css` – popup UI and logic for managing prompts and chains.
- `content.js` – injected into ChatGPT pages to automate prompt submission and detect completion.
- `background.js` – background service worker (currently minimal).
- `icons/` – extension icons.

## License

No explicit license is provided.
