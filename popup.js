// --- ICONS ---
const ICON_STAR_FILLED = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>`;
const ICON_STAR_OUTLINE = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>`;
const ICON_MOON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3c-.11.73-.21 1.47-.21 2.21a9 9 0 009 9c.74 0 1.48-.1 2.21-.21z"/></svg>`;
const ICON_SUN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5V2m0 20v-2.5M4.5 12H2m20 0h-2.5M5.636 5.636L4.222 4.222m15.556 15.556l-1.414-1.414M5.636 18.364l-1.414 1.414m15.556-15.556l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// --- STATE & CONFIG ---
let state = {
    currentView: 'prompts',
    prompts: [],
    chains: [],
    pendingExecution: null,
    chainBeingEdited: null,
    theme: 'dark'
};
let draggedItemIndex = null;
let searchTerm = '';

// --- DOM ELEMENT QUERY ---
let mainView, promptEditorView, chainEditorView, variableInputView, contentList,
    settingsContainer, addNewBtn, showPromptsBtn, showChainsBtn, showSettingsBtn,
    searchBox, promptForm, promptEditorTitle, promptIdInput, promptTitleInput, promptTextInput,
    promptDescriptionInput, savePromptBtn, cancelPromptBtn, chainForm, chainEditorTitle,
    chainIdInput, chainNameInput, chainPromptsContainer, addPromptToChainBtn,
    saveChainBtn, cancelChainBtn, variableFieldsContainer, executeVariablePromptBtn,
    cancelVariableInputBtn, exportBtn, importBtn, importFileInput, toggleThemeBtn,
    quickThemeToggleBtn;

const queryElements = () => {
    mainView = document.getElementById('main-view');
    promptEditorView = document.getElementById('prompt-editor-view');
    chainEditorView = document.getElementById('chain-editor-view');
    variableInputView = document.getElementById('variable-input-view');
    contentList = document.getElementById('content-list');
    searchBox = document.getElementById('search-box');
    settingsContainer = document.getElementById('settings-container');
    addNewBtn = document.getElementById('add-new-btn');
    showPromptsBtn = document.getElementById('show-prompts-btn');
    showChainsBtn = document.getElementById('show-chains-btn');
    showSettingsBtn = document.getElementById('show-settings-btn');
    promptForm = document.getElementById('prompt-form');
    promptEditorTitle = document.getElementById('prompt-editor-title');
    promptIdInput = document.getElementById('prompt-id');
    promptTitleInput = document.getElementById('prompt-title');
    promptTextInput = document.getElementById('prompt-text');
    promptDescriptionInput = document.getElementById('prompt-description');
    savePromptBtn = document.getElementById('save-prompt-btn');
    cancelPromptBtn = document.getElementById('cancel-prompt-btn');
    chainForm = document.getElementById('chain-form');
    chainEditorTitle = document.getElementById('chain-editor-title');
    chainIdInput = document.getElementById('chain-id');
    chainNameInput = document.getElementById('chain-name');
    chainPromptsContainer = document.getElementById('chain-prompts-container');
    addPromptToChainBtn = document.getElementById('add-prompt-to-chain-btn');
    saveChainBtn = document.getElementById('save-chain-btn');
    cancelChainBtn = document.getElementById('cancel-chain-btn');
    variableFieldsContainer = document.getElementById('variable-fields-container');
    executeVariablePromptBtn = document.getElementById('execute-variable-prompt-btn');
    cancelVariableInputBtn = document.getElementById('cancel-variable-input-btn');
    exportBtn = document.getElementById('export-btn');
    importBtn = document.getElementById('import-btn');
    importFileInput = document.getElementById('import-file');
    toggleThemeBtn = document.getElementById('toggle-theme-btn');
    quickThemeToggleBtn = document.getElementById('quick-theme-toggle');
};

// --- DATA HELPERS & RENDERERS ---
const storage = { get: (k) => new Promise(r => chrome.storage.local.get(k, r)), set: (i) => new Promise(r => chrome.storage.local.set(i, r)) };
const loadData = async () => {
    const d = await storage.get(['prompts', 'chains', 'theme']);
    state.prompts = d.prompts || [];
    state.chains = d.chains || [];
    state.theme = d.theme || 'dark';
};

const render = () => {
    const isMainView = !['promptEditor', 'chainEditor', 'variableInput'].includes(state.currentView);
    mainView.classList.toggle('hidden', !isMainView);
    promptEditorView.classList.toggle('hidden', state.currentView !== 'promptEditor');
    chainEditorView.classList.toggle('hidden', state.currentView !== 'chainEditor');
    variableInputView.classList.toggle('hidden', state.currentView !== 'variableInput');
    if (isMainView) {
        showPromptsBtn.classList.toggle('active', state.currentView === 'prompts');
        showChainsBtn.classList.toggle('active', state.currentView === 'chains');
        showSettingsBtn.classList.toggle('active', state.currentView === 'settings');
        if (state.currentView === 'prompts') {
            renderPrompts();
            addNewBtn.textContent = 'Neuen Prompt erstellen';
            addNewBtn.classList.remove('hidden');
            contentList.classList.remove('hidden');
            settingsContainer.classList.add('hidden');
        } else if (state.currentView === 'chains') {
            renderChains();
            addNewBtn.textContent = 'Neue Chain erstellen';
            addNewBtn.classList.remove('hidden');
            contentList.classList.remove('hidden');
            settingsContainer.classList.add('hidden');
        } else if (state.currentView === 'settings') {
            addNewBtn.classList.add('hidden');
            contentList.classList.add('hidden');
            settingsContainer.classList.remove('hidden');
        }
    }
};
const renderPrompts = () => {
    contentList.innerHTML = '';
    const term = searchTerm.trim().toLowerCase();
    let list = [...state.prompts];
    if (term) {
        list = list.filter(p =>
            `${p.title} ${(p.description || '')}`.toLowerCase().includes(term)
        );
    }
    if (list.length === 0) {
        contentList.innerHTML = '<p class="text-secondary">Noch keine Prompts erstellt.</p>';
        return;
    }
    const sorted = list.sort((a, b) => (b.isFavorite || 0) - (a.isFavorite || 0));
    sorted.forEach(p => {
        const d = document.createElement('div');
        d.className = 'item-card';
        const i = p.isFavorite ? ICON_STAR_FILLED : ICON_STAR_OUTLINE;
        d.innerHTML = `<h3>${p.title}</h3><p>${p.description||'Keine Beschreibung'}</p><div class="item-actions"><button title="Ausführen" class="play" data-action="run-prompt" data-id="${p.id}">▶</button><button title="Bearbeiten" data-action="edit-prompt" data-id="${p.id}">✎</button><button title="Löschen" class="delete" data-action="delete-prompt" data-id="${p.id}">🗑</button><button title="Favorit umschalten" class="favorite ${p.isFavorite ? 'favorited' : ''}" data-action="toggle-favorite-prompt" data-id="${p.id}">${i}</button></div>`;
        contentList.appendChild(d);
    });
};

const renderChains = () => {
    contentList.innerHTML = '';
    const term = searchTerm.trim().toLowerCase();
    let list = [...state.chains];
    if (term) {
        list = list.filter(c => c.name.toLowerCase().includes(term));
    }
    if (list.length === 0) {
        contentList.innerHTML = '<p class="text-secondary">Noch keine Chains erstellt.</p>';
        return;
    }
    const sorted = list.sort((a, b) => (b.isFavorite || 0) - (a.isFavorite || 0));
    sorted.forEach(c => {
        const d = document.createElement('div');
        d.className = 'item-card';
        const i = c.isFavorite ? ICON_STAR_FILLED : ICON_STAR_OUTLINE;
        d.innerHTML = `<h3>${c.name}</h3><p>${c.prompts.length} Prompt(s) in dieser Kette</p><div class="item-actions"><button title="Ausführen" class="play" data-action="run-chain" data-id="${c.id}">▶</button><button title="Bearbeiten" data-action="edit-chain" data-id="${c.id}">✎</button><button title="Löschen" class="delete" data-action="delete-chain" data-id="${c.id}">🗑</button><button title="Favorit umschalten" class="favorite ${c.isFavorite ? 'favorited' : ''}" data-action="toggle-favorite-chain" data-id="${c.id}">${i}</button></div>`;
        contentList.appendChild(d);
    });
};
const renderChainPromptInputs = () => { if (!state.chainBeingEdited) return; chainPromptsContainer.innerHTML = ''; state.chainBeingEdited.prompts.forEach((p, i) => { const d = document.createElement('div'); d.className = 'chain-prompt-item'; d.dataset.index = i; d.innerHTML = `<div class="drag-handle" draggable="true" title="Reihenfolge ändern"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 5H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2 8H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div><textarea rows="2" placeholder="Prompt #${i + 1}" data-index="${i}">${p.text}</textarea><button type="button" class="delete" data-action="remove-prompt-from-chain" data-index="${i}" title="Prompt löschen">🗑</button>`; chainPromptsContainer.appendChild(d); autoResizeTextarea(d.querySelector('textarea')); }); };
const renderVariableInputs = (v) => { variableFieldsContainer.innerHTML = ''; v.forEach(v => { const g = document.createElement('div'); g.className = 'form-group'; g.innerHTML = `<label for="var-${v}">${v}</label><input type="text" id="var-${v}" name="${v}" required class="variable-input">`; variableFieldsContainer.appendChild(g); }); };

// --- EVENT HANDLERS & ACTIONS ---
const autoResizeTextarea = (t) => { if (t) { t.style.height = 'auto'; t.style.height = `${t.scrollHeight}px`; } };
const extractVariables = (t) => { const r = /{{\s*([a-zA-Z0-9_]+)\s*}}/g; const m = t.match(r) || []; return Array.from(new Set(m.map(v => v.replace(/[{}]/g, '').trim()))); };
const handleSearchInput = () => { searchTerm = searchBox.value; render(); };
const handleNavClick = (v) => {
    state.currentView = v;
    showPromptsBtn.classList.toggle('active', v === 'prompts');
    showChainsBtn.classList.toggle('active', v === 'chains');
    showSettingsBtn.classList.toggle('active', v === 'settings');
    render();
};
const handleAddNew = () => { if (state.currentView === 'prompts') { state.currentView = 'promptEditor'; state.editingPromptId = null; promptEditorTitle.textContent = 'Prompt erstellen'; promptForm.reset(); render(); autoResizeTextarea(promptTextInput); } else { state.currentView = 'chainEditor'; state.chainBeingEdited = { id: null, name: '', prompts: [{ text: '' }], isFavorite: false }; chainEditorTitle.textContent = 'Chain erstellen'; chainNameInput.value = ''; renderChainPromptInputs(); render(); } };
const handleListClick = async (e) => { const t = e.target.closest('button'); if (!t) return; const { action, id } = t.dataset;
    if (action === 'toggle-favorite-prompt' || action === 'toggle-favorite-chain') { const type = action.split('-')[2] + 's'; const item = state[type].find(i => i.id === id); if (item) { item.isFavorite = !item.isFavorite; await storage.set({ [type]: state[type] }); render(); } return; }
    if (action === 'run-prompt') { const p = state.prompts.find(p => p.id === id); if (!p) return; const v = extractVariables(p.text); if (v.length === 0) { executeInContentScript({ type: 'execute-prompt', text: p.text }); } else { state.pendingExecution = { type: 'prompt', data: p }; renderVariableInputs(v); state.currentView = 'variableInput'; render(); }
    } else if (action === 'run-chain') { const c = state.chains.find(c => c.id === id); if (!c) return; const a = c.prompts.map(p => p.text).join(' '); const v = extractVariables(a); if (v.length === 0) { executeInContentScript({ type: 'execute-chain', chain: c }); } else { state.pendingExecution = { type: 'chain', data: c }; renderVariableInputs(v); state.currentView = 'variableInput'; render(); }
    } else if (action === 'edit-prompt') { const p = state.prompts.find(p => p.id === id); if (!p) return; state.currentView = 'promptEditor'; state.editingPromptId = id; promptEditorTitle.textContent = 'Prompt bearbeiten'; promptIdInput.value = p.id; promptTitleInput.value = p.title; promptTextInput.value = p.text; promptDescriptionInput.value = p.description; render(); setTimeout(() => autoResizeTextarea(promptTextInput), 0);
    } else if (action === 'edit-chain') { const c = state.chains.find(c => c.id === id); if (!c) return; state.chainBeingEdited = JSON.parse(JSON.stringify(c)); state.currentView = 'chainEditor'; chainEditorTitle.textContent = 'Chain bearbeiten'; chainNameInput.value = c.name; renderChainPromptInputs(); render();
    } else if (action === 'delete-prompt' || action === 'delete-chain') { const type = action.split('-')[1]; const listName = type + 's'; if (confirm(`Diese(n) ${type} wirklich löschen?`)) { state[listName] = state[listName].filter(i => i.id !== id); await storage.set({ [listName]: state[listName] }); render(); } }
};
const handleSavePrompt = async (e) => { e.preventDefault(); if (!promptTitleInput.value || !promptTextInput.value) return; const p = state.editingPromptId ? state.prompts.find(p => p.id === state.editingPromptId) : null; const n = { id: state.editingPromptId || self.crypto.randomUUID(), title: promptTitleInput.value, text: promptTextInput.value, description: promptDescriptionInput.value, isFavorite: p ? p.isFavorite : false }; if (state.editingPromptId) { state.prompts = state.prompts.map(p => p.id === state.editingPromptId ? n : p); } else { state.prompts.push(n); } await storage.set({ prompts: state.prompts }); state.editingPromptId = null; handleNavClick('prompts'); };
const handleSaveChain = async (e) => { e.preventDefault(); const c = state.chainBeingEdited; if (!c) return; c.name = chainNameInput.value; if (!c.name) { alert('Ein Name für die Chain ist ein Pflichtfeld.'); return; } c.prompts = c.prompts.filter(p => p.text.trim() !== ''); if (c.prompts.length === 0) { alert('Eine Chain muss mindestens einen nicht-leeren Prompt enthalten.'); return; } const n = { ...c, id: c.id || self.crypto.randomUUID() }; const i = state.chains.findIndex(c => c.id === n.id); if (i > -1) { state.chains[i] = n; } else { state.chains.push(n); } await storage.set({ chains: state.chains }); state.chainBeingEdited = null; handleNavClick('chains'); };
const handleAddPromptToChain = (e) => { e.preventDefault(); if (!state.chainBeingEdited) return; state.chainBeingEdited.prompts.push({ text: '' }); renderChainPromptInputs(); };
const handleRemovePromptFromChain = (e) => { const t = e.target.closest('button[data-action="remove-prompt-from-chain"]'); if (!t || !state.chainBeingEdited) return; e.preventDefault(); const i = parseInt(t.dataset.index); state.chainBeingEdited.prompts.splice(i, 1); renderChainPromptInputs(); };
const handleVariableSubmit = (e) => { e.preventDefault(); if (!state.pendingExecution) return; const v = {}; variableFieldsContainer.querySelectorAll('.variable-input').forEach(i => { v[i.name] = i.value; }); const { type, data } = state.pendingExecution; const sub = t => { let p = t; for (const n in v) { p = p.replace(new RegExp(`{{\\s*${n}\\s*}}`, 'g'), v[n]); } return p; }; if (type === 'prompt') { executeInContentScript({ type: 'execute-prompt', text: sub(data.text) }); } else if (type === 'chain') { const p = { ...data, prompts: data.prompts.map(p => ({ ...p, text: sub(p.text) })) }; executeInContentScript({ type: 'execute-chain', chain: p }); } state.pendingExecution = null; handleNavClick(type === 'prompt' ? 'prompts' : 'chains'); };
const executeInContentScript = (d) => { chrome.tabs.query({ active: true, currentWindow: true }, (t) => { const c = t.find(t => t.url && (t.url.startsWith("https://chat.openai.com") || t.url.startsWith("https://chatgpt.com"))); if (c) { chrome.scripting.executeScript({ target: { tabId: c.id }, func: (d) => document.dispatchEvent(new CustomEvent('run-from-popup', { detail: d })), args: [d] }); window.close(); } else { alert('Bitte öffne zuerst einen Tab mit ChatGPT.'); } }); };
const handleDragStart = (e) => { const h = e.target.closest('.drag-handle'); if (!h) { e.preventDefault(); return; } const t = h.closest('.chain-prompt-item'); if (!t) return; draggedItemIndex = parseInt(t.dataset.index); setTimeout(() => t.classList.add('dragging'), 0); };
const handleDragEnd = (e) => { document.querySelectorAll('.chain-prompt-item.dragging').forEach(el => el.classList.remove('dragging')); draggedItemIndex = null; };
const handleDragOver = (e) => { e.preventDefault(); const o = e.target.closest('.chain-prompt-item'); document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over')); if (o) o.classList.add('drag-over'); };
const handleDrop = (e) => { e.preventDefault(); document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over')); const d = e.target.closest('.chain-prompt-item'); if (d === null || draggedItemIndex === null || !state.chainBeingEdited) return; const i = parseInt(d.dataset.index); if (draggedItemIndex === i) return; const [r] = state.chainBeingEdited.prompts.splice(draggedItemIndex, 1); state.chainBeingEdited.prompts.splice(i, 0, r); renderChainPromptInputs(); };

const handleExport = () => {
    const data = { prompts: state.prompts, chains: state.chains };
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-manager-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

const handleImportClick = () => { importFileInput.click(); };
const handleImportFile = async () => {
    const file = importFileInput.files[0];
    if (!file) return;
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!Array.isArray(data.prompts) || !Array.isArray(data.chains)) throw new Error('invalid');
        if (!confirm('Import überschreibt alle vorhandenen Daten. Fortfahren?')) { importFileInput.value = ''; return; }
        state.prompts = data.prompts;
        state.chains = data.chains;
        await storage.set({ prompts: state.prompts, chains: state.chains });
        render();
    } catch (e) {
        alert('Fehler beim Import der Datei.');
    }
    importFileInput.value = '';
};

const applyTheme = () => {
    // Apply the theme class to the root element so the CSS variables defined
    // in :root.light-theme take effect.
    document.documentElement.classList.toggle('light-theme', state.theme === 'light');
    if (toggleThemeBtn) {
        toggleThemeBtn.textContent = state.theme === 'light'
            ? 'Dunkler Modus'
            : 'Heller Modus';
    }
    if (quickThemeToggleBtn) {
        quickThemeToggleBtn.innerHTML = state.theme === 'light' ? ICON_MOON : ICON_SUN;
    }
};

const handleThemeToggle = async () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    await storage.set({ theme: state.theme });
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    queryElements();
    await loadData();
    applyTheme();
    render();

    showPromptsBtn.addEventListener('click', () => handleNavClick('prompts'));
    showChainsBtn.addEventListener('click', () => handleNavClick('chains'));
    showSettingsBtn.addEventListener('click', () => handleNavClick('settings'));
    addNewBtn.addEventListener('click', handleAddNew);
    contentList.addEventListener('click', handleListClick);
    searchBox.addEventListener('input', handleSearchInput);
    savePromptBtn.addEventListener('click', handleSavePrompt);
    cancelPromptBtn.addEventListener('click', () => { state.editingPromptId = null; handleNavClick('prompts'); });
    saveChainBtn.addEventListener('click', handleSaveChain);
    cancelChainBtn.addEventListener('click', () => { state.chainBeingEdited = null; handleNavClick('chains'); });
    addPromptToChainBtn.addEventListener('click', handleAddPromptToChain);
    executeVariablePromptBtn.addEventListener('click', handleVariableSubmit);
    cancelVariableInputBtn.addEventListener('click', () => { const v = state.pendingExecution?.type === 'chain' ? 'chains' : 'prompts'; state.pendingExecution=null; handleNavClick(v); });
    promptTextInput.addEventListener('input', () => autoResizeTextarea(promptTextInput));
    chainPromptsContainer.addEventListener('input', (e) => { if (e.target.tagName === 'TEXTAREA') { autoResizeTextarea(e.target); if (state.chainBeingEdited) { const i = parseInt(e.target.dataset.index); if(state.chainBeingEdited.prompts[i]) { state.chainBeingEdited.prompts[i].text = e.target.value; } } } });
    chainPromptsContainer.addEventListener('click', handleRemovePromptFromChain);
    chainPromptsContainer.addEventListener('dragstart', handleDragStart);
    chainPromptsContainer.addEventListener('dragend', handleDragEnd);
    chainPromptsContainer.addEventListener('dragover', handleDragOver);
    chainPromptsContainer.addEventListener('drop', handleDrop);
    exportBtn.addEventListener('click', handleExport);
    importBtn.addEventListener('click', handleImportClick);
    importFileInput.addEventListener('change', handleImportFile);
    toggleThemeBtn.addEventListener('click', handleThemeToggle);
    if (quickThemeToggleBtn) quickThemeToggleBtn.addEventListener('click', handleThemeToggle);
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            handleThemeToggle();
        }
    });
});
