# 💬 ChatGPT Prompt Manager  
*A Chrome extension to organize, run, and automate ChatGPT prompts and prompt chains.*

---

## 🧠 Overview

**ChatGPT Prompt Manager** is a lightweight Chrome extension that helps you save, organize, and reuse prompts for ChatGPT. You can also create **prompt chains** — sequences of prompts that run automatically. Whether you're a developer, writer, researcher, or power user, this tool streamlines your interactions with ChatGPT and boosts productivity.

---

## ✨ Features

- **Prompt storage**: Save prompts locally with titles, descriptions, tags, and favorites.
- **Prompt chains**: Create and execute sequences of prompts step-by-step.
- **Dynamic variables**: Use `{{variable}}` placeholders to insert values at runtime.
- **Search & tagging**: Filter prompts by tags, titles, or descriptions.
- **Drag and drop**: Reorder prompts in a chain with a simple drag handle.
- **Theme toggle**: Switch between dark and light mode via header icon or `Alt+L`.
- **Collapsible cards**: Expand or collapse prompt details for a cleaner interface.
- **ChatGPT integration**: Automatically sends prompts to an open ChatGPT tab and detects responses.
- **Chain progress overlay**: Visual indicator shows execution status and countdown between steps.
- **Import/export**: Backup and share prompts/chains as JSON files.
- **Global delay**: Add a delay (in seconds) between chained prompts.

---

## 🎥 Demo / Screenshots

> 📸 *Coming soon: Visuals showing prompt creation, chaining, and the popup UI.*

---

## 📦 Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select the project folder.

✅ The extension icon will appear in your Chrome toolbar.

---

## 🚀 Usage

1. Open a ChatGPT tab (`https://chat.openai.com` or `https://chatgpt.com`).
2. Click the extension icon to open the popup.
3. Create new prompts or prompt chains using the form.
4. Use `{{variable}}` tokens like `{{topic}}` in prompt text to define input fields.
5. Click the ▶️ play button to run a prompt or chain in the active ChatGPT tab.
6. Fill in variable values when prompted.
7. Use the **Settings** tab to import/export JSON backups.
8. Toggle the theme with the header icon or `Alt+L`. Your preference is saved.

---

## ⚙️ Configuration / Customization

- **Global delay**: Set a delay (in seconds) between chained prompts via the **Settings** tab.
- **Theme mode**: Your selected theme is stored in `chrome.storage.local` and restored automatically.
- **Favorites & tags**: Mark prompts as favorites and organize them using comma-separated tags.
- **Keyboard shortcut**: Use `Alt+L` to switch between dark and light mode instantly.

---

## 🗂️ File Structure

| File/Folder        | Description |
|--------------------|-------------|
| `manifest.json`    | Chrome extension manifest file. |
| `popup.html`       | Markup for the extension popup interface. |
| `popup.js`         | Logic for managing prompts, chains, and UI behavior. |
| `style.css`        | Styling for the popup. |
| `content.js`       | Injected into ChatGPT tabs to send prompts and read responses. |
| `background.js`    | Background script (minimal use). |
| `icons/`           | Icon assets for the extension. |

---

## 🧪 Examples

### 🔹 Single Prompt with Variable

```json
{
  "title": "Summarize Topic",
  "text": "Summarize the following topic in simple terms: {{topic}}",
  "description": "Generates a simple summary of any topic using ChatGPT."
}
