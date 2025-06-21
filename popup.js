// --- ICONS ---
const ICON_STAR_FILLED = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/></svg>`;
const ICON_STAR_OUTLINE = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/></svg>`;
const ICON_MOON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3c-.11.73-.21 1.47-.21 2.21a9 9 0 009 9c.74 0 1.48-.1 2.21-.21z"/></svg>`;
const ICON_SUN = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5V2m0 20v-2.5M4.5 12H2m20 0h-2.5M5.636 5.636L4.222 4.222m15.556 15.556l-1.414-1.414M5.636 18.364l-1.414 1.414m15.556-15.556l-1.414 1.414M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_DOWNLOAD = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"/><path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 15V3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_UPLOAD = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 8v2a2 2 0 002 2h12a2 2 0 002-2V8"/><path d="M17 14l-5-5-5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 9v12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const ICON_PLAY = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 3v10l9-5-9-5z"/></svg>`;
const ICON_EDIT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/><path d="M20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0L15.13 4.95l3.75 3.75 1.83-1.66z"/></svg>`;
const ICON_TRASH = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 7v12a2 2 0 002 2h8a2 2 0 002-2V7"/><path d="M4 7h16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 7V4h6v3"/></svg>`;
const ICON_PLUS = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const ACCENT_PRESETS = {
    purple: { color: '#6750A4', hover: '#56318d' },
    blue: { color: '#1E88E5', hover: '#1565C0' },
    green: { color: '#43A047', hover: '#2E7D32' },
    orange: { color: '#FB8C00', hover: '#EF6C00' },
    red: { color: '#E53935', hover: '#C62828' }
};

// --- STATE & CONFIG ---
let state = {
    currentView: 'prompts',
    prompts: [],
    chains: [],
    pendingExecution: null,
    chainBeingEdited: null,
    theme: 'dark',
    accentColor: 'purple',
    customAccentColor: '',
    chainDelay: 0,
    showTagsFilter: true
};
let draggedItemIndex = null;
let draggedCardId = null;
let draggedCardOriginalIndex = null;
let searchTerm = '';
let showOnlyFavorites = false;
let activeTags = [];

// --- DOM ELEMENT QUERY ---
let mainView, promptEditorView, chainEditorView, variableInputView, contentList,
    settingsContainer, addNewBtn, showPromptsBtn, showChainsBtn, showSettingsBtn,
    searchBox, promptForm, promptEditorTitle, promptIdInput, promptTitleInput, promptTextInput,
    promptDescriptionInput, promptTagsInput, savePromptBtn, cancelPromptBtn, chainForm, chainEditorTitle,
    chainIdInput, chainNameInput, chainTagsInput, chainPromptsContainer, addPromptToChainBtn,
    saveChainBtn, cancelChainBtn, variableFieldsContainer, executeVariablePromptBtn,
    cancelVariableInputBtn, exportBtn, importBtn, importFileInput,
    quickThemeToggleBtn, chainDelayInput, chainDelayDisplay, searchAddContainer,
    showTagsFilterInput, accentColorSelect, customAccentColorInput;
let favoritesToggleBtn, tagsFilterContainer;

const queryElements = () => {
    mainView = document.getElementById('main-view');
    promptEditorView = document.getElementById('prompt-editor-view');
    chainEditorView = document.getElementById('chain-editor-view');
    variableInputView = document.getElementById('variable-input-view');
    contentList = document.getElementById('content-list');
    searchAddContainer = document.getElementById('search-add-container');
    searchBox = document.getElementById('search-box');
    favoritesToggleBtn = document.getElementById('favorites-filter-btn');
    tagsFilterContainer = document.getElementById('tags-filter-container');
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
    promptTagsInput = document.getElementById('prompt-tags');
    savePromptBtn = document.getElementById('save-prompt-btn');
    cancelPromptBtn = document.getElementById('cancel-prompt-btn');
    chainForm = document.getElementById('chain-form');
    chainEditorTitle = document.getElementById('chain-editor-title');
    chainIdInput = document.getElementById('chain-id');
    chainNameInput = document.getElementById('chain-name');
    chainTagsInput = document.getElementById('chain-tags');
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
    quickThemeToggleBtn = document.getElementById('quick-theme-toggle');
    chainDelayInput = document.getElementById('chain-delay');
    chainDelayDisplay = document.getElementById('chain-delay-display');
    showTagsFilterInput = document.getElementById('show-tags-filter');
    accentColorSelect = document.getElementById('accent-color-select');
    customAccentColorInput = document.getElementById('custom-accent-color-input');
};

// --- DATA HELPERS & RENDERERS ---
const storage = { get: (k) => new Promise(r => chrome.storage.local.get(k, r)), set: (i) => new Promise(r => chrome.storage.local.set(i, r)) };
const sessionStore = {
    get: (k) => new Promise(r => {
        if (chrome.storage.session) chrome.storage.session.get(k, r); else r({});
    }),
    set: (i) => new Promise(r => {
        if (chrome.storage.session) chrome.storage.session.set(i, r); else r();
    })
};

const loadUIState = async () => {
    const d = await sessionStore.get(['currentView', 'searchTerm', 'showOnlyFavorites', 'activeTags']);
    if (d.currentView) state.currentView = d.currentView;
    searchTerm = d.searchTerm || '';
    showOnlyFavorites = !!d.showOnlyFavorites;
    activeTags = Array.isArray(d.activeTags) ? d.activeTags : [];
};

const saveUIState = () => sessionStore.set({
    currentView: state.currentView,
    searchTerm,
    showOnlyFavorites,
    activeTags
});
const loadData = async () => {
    const d = await storage.get(['prompts', 'chains', 'theme', 'accentColor', 'customAccentColor', 'chainDelay', 'showTagsFilter']);
    state.prompts = (d.prompts || []).map(p => ({ ...p, tags: Array.isArray(p.tags) ? p.tags : [] }));
    state.chains = (d.chains || []).map(c => ({ ...c, tags: Array.isArray(c.tags) ? c.tags : [] }));
    state.theme = d.theme || 'dark';
    state.accentColor = d.accentColor || 'purple';
    state.customAccentColor = d.customAccentColor || '';
    const storedDelay = typeof d.chainDelay === 'number' && d.chainDelay >= 0 ? d.chainDelay : 0;
    state.chainDelay = storedDelay > 10 ? 10 : storedDelay;
    state.showTagsFilter = d.showTagsFilter !== false;
};

const render = () => {
    const isMainView = !['promptEditor', 'chainEditor', 'variableInput'].includes(state.currentView);
    mainView.classList.toggle('hidden', !isMainView);
    promptEditorView.classList.toggle('hidden', state.currentView !== 'promptEditor');
    chainEditorView.classList.toggle('hidden', state.currentView !== 'chainEditor');
    variableInputView.classList.toggle('hidden', state.currentView !== 'variableInput');
    searchAddContainer.classList.toggle('hidden', !isMainView || state.currentView === 'settings');
    if (tagsFilterContainer) {
        const hide = !isMainView || state.currentView === 'settings' || !state.showTagsFilter;
        tagsFilterContainer.classList.toggle('hidden', hide);
    }
    if (favoritesToggleBtn) {
        favoritesToggleBtn.innerHTML = showOnlyFavorites ? ICON_STAR_FILLED : ICON_STAR_OUTLINE;
        favoritesToggleBtn.classList.toggle('active', showOnlyFavorites);
    }
    if (isMainView && tagsFilterContainer && state.currentView !== 'settings') {
        renderTagFilter();
    }
    if (isMainView) {
        showPromptsBtn.classList.toggle('active', state.currentView === 'prompts');
        showChainsBtn.classList.toggle('active', state.currentView === 'chains');
        showSettingsBtn.classList.toggle('active', state.currentView === 'settings');
        if (state.currentView === 'prompts') {
            renderPrompts();
            renderTagFilter();
            addNewBtn.innerHTML = ICON_PLUS;
            addNewBtn.title = 'Neuen Prompt erstellen';
            addNewBtn.setAttribute('aria-label', 'Neuen Prompt erstellen');
            addNewBtn.classList.remove('hidden');
            contentList.classList.remove('hidden');
            settingsContainer.classList.add('hidden');
        } else if (state.currentView === 'chains') {
            renderChains();
            renderTagFilter();
            addNewBtn.innerHTML = ICON_PLUS;
            addNewBtn.title = 'Neue Chain erstellen';
            addNewBtn.setAttribute('aria-label', 'Neue Chain erstellen');
            addNewBtn.classList.remove('hidden');
            contentList.classList.remove('hidden');
            settingsContainer.classList.add('hidden');
        } else if (state.currentView === 'settings') {
            addNewBtn.classList.add('hidden');
            contentList.classList.add('hidden');
            settingsContainer.classList.remove('hidden');
            if (chainDelayInput) {
                chainDelayInput.value = state.chainDelay;
                updateDelayUI();
            }
        }
    }
};
const renderPrompts = () => {
    contentList.innerHTML = '';
    const term = searchTerm.trim().toLowerCase();
    let list = [...state.prompts];
    if (showOnlyFavorites) list = list.filter(p => p.isFavorite);
    if (activeTags.length) list = list.filter(p => (p.tags || []).some(tag => activeTags.includes(tag)));
    if (term) {
        list = list.filter(p => {
            const haystack = `${p.title} ${(p.description || '')} ${(p.tags || []).join(' ')}`.toLowerCase();
            return haystack.includes(term);
        });
    }
    if (list.length === 0) {
        contentList.innerHTML = '<p class="text-secondary">Noch keine Prompts erstellt.</p>';
        return;
    }
    const sorted = list.sort((a, b) => (b.isFavorite || 0) - (a.isFavorite || 0));
    sorted.forEach(p => {
        const d = document.createElement('div');
        d.dataset.id = p.id;
        d.setAttribute('draggable', 'true');
        const matchTitle = p.title.toLowerCase().includes(term);
        const matchDesc = (p.description || '').toLowerCase().includes(term);
        const matchTag = (p.tags || []).some(t => t.toLowerCase().includes(term));
        const shouldExpand = term && !matchTitle && (matchDesc || matchTag);
        d.className = `item-card ${shouldExpand ? 'expanded' : 'collapsed'}`;
        const i = p.isFavorite ? ICON_STAR_FILLED : ICON_STAR_OUTLINE;
        const tags = (p.tags || [])
            .map(t => `<span class="tag-chip">${t}</span>`)
            .join('');
        d.innerHTML = `<div class="item-header"><h3 title="${p.title}">${p.title}</h3><div class="item-actions"><button title="Ausführen" class="play" data-action="run-prompt" data-id="${p.id}">${ICON_PLAY}</button><button title="Bearbeiten" data-action="edit-prompt" data-id="${p.id}">${ICON_EDIT}</button><button title="Löschen" class="delete" data-action="delete-prompt" data-id="${p.id}">${ICON_TRASH}</button><button title="Favorit umschalten" class="favorite ${p.isFavorite ? 'favorited' : ''}" data-action="toggle-favorite-prompt" data-id="${p.id}">${i}</button></div><span class="expand-arrow">▾</span></div><div class="item-details"><p class="description">${p.description||'Keine Beschreibung'}</p><div class="tags">${tags}</div></div>`;
        contentList.appendChild(d);
    });
};

const renderChains = () => {
    contentList.innerHTML = '';
    const term = searchTerm.trim().toLowerCase();
    let list = [...state.chains];
    if (showOnlyFavorites) list = list.filter(c => c.isFavorite);
    if (activeTags.length) list = list.filter(c => (c.tags || []).some(tag => activeTags.includes(tag)));
    if (term) {
        list = list.filter(c => {
            const haystack = `${c.name} ${(c.tags || []).join(' ')}`.toLowerCase();
            return haystack.includes(term);
        });
    }
    if (list.length === 0) {
        contentList.innerHTML = '<p class="text-secondary">Noch keine Chains erstellt.</p>';
        return;
    }
    const sorted = list.sort((a, b) => (b.isFavorite || 0) - (a.isFavorite || 0));
    sorted.forEach(c => {
        const d = document.createElement('div');
        d.dataset.id = c.id;
        d.setAttribute('draggable', 'true');
        const matchTitle = c.name.toLowerCase().includes(term);
        const matchTag = (c.tags || []).some(t => t.toLowerCase().includes(term));
        const shouldExpand = term && !matchTitle && matchTag;
        d.className = `item-card ${shouldExpand ? 'expanded' : 'collapsed'}`;
        const i = c.isFavorite ? ICON_STAR_FILLED : ICON_STAR_OUTLINE;
        const countText = `${c.prompts.length} ${c.prompts.length === 1 ? 'Prompt' : 'Prompts'}`;
        const tags = (c.tags || [])
            .map(t => `<span class="tag-chip">${t}</span>`)
            .join('');
        d.innerHTML = `<div class="item-header"><h3 title="${c.name}">${c.name}</h3><div class="item-actions"><button title="Ausführen" class="play" data-action="run-chain" data-id="${c.id}">${ICON_PLAY}</button><button title="Bearbeiten" data-action="edit-chain" data-id="${c.id}">${ICON_EDIT}</button><button title="Löschen" class="delete" data-action="delete-chain" data-id="${c.id}">${ICON_TRASH}</button><button title="Favorit umschalten" class="favorite ${c.isFavorite ? 'favorited' : ''}" data-action="toggle-favorite-chain" data-id="${c.id}">${i}</button></div><span class="expand-arrow">▾</span></div><div class="item-details"><p class="chain-stats">${countText}</p><div class="tags">${tags}</div></div>`;
        contentList.appendChild(d);
    });
};

const renderTagFilter = () => {
    if (!tagsFilterContainer) return;
    const items = state.currentView === 'prompts' ? state.prompts : state.chains;
    const counts = {};
    items.forEach(i => (i.tags || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    const tags = Object.keys(counts).sort();
    tagsFilterContainer.innerHTML = tags.map(t => {
        const selected = activeTags.includes(t) ? 'selected' : '';
        return `<span class="tag-chip ${selected}" data-tag="${t}" title="${t}">${t} (${counts[t]})</span>`;
    }).join('');
    const hide = tags.length === 0 || !state.showTagsFilter;
    tagsFilterContainer.classList.toggle('hidden', hide);
};
const renderChainPromptInputs = () => {
    if (!state.chainBeingEdited) return;
    chainPromptsContainer.innerHTML = '';
    state.chainBeingEdited.prompts.forEach((p, i) => {
        const d = document.createElement('div');
        d.className = 'chain-prompt-item';
        d.dataset.index = i;
        d.innerHTML = `<div class="drag-handle" draggable="true" title="Reihenfolge ändern"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 5H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2 8H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></div><textarea rows="2" placeholder="Prompt #${i + 1}" data-index="${i}">${p.text}</textarea><button type="button" class="delete" data-action="remove-prompt-from-chain" data-index="${i}" title="Prompt löschen">${ICON_TRASH}</button>`;
        chainPromptsContainer.appendChild(d);
        autoResizeTextarea(d.querySelector('textarea'));
    });
};
const renderVariableInputs = (v) => { variableFieldsContainer.innerHTML = ''; v.forEach(v => { const g = document.createElement('div'); g.className = 'form-group'; g.innerHTML = `<label for="var-${v}">${v}</label><input type="text" id="var-${v}" name="${v}" required class="variable-input">`; variableFieldsContainer.appendChild(g); }); };

// --- EVENT HANDLERS & ACTIONS ---
const autoResizeTextarea = (t) => {
    if (!t) return;
    t.style.height = 'auto';
    const max = parseInt(getComputedStyle(t).maxHeight, 10) || Number.MAX_VALUE;
    const newHeight = Math.min(t.scrollHeight, max);
    t.style.height = `${newHeight}px`;
};
const extractVariables = (t) => { const r = /{{\s*([a-zA-Z0-9_]+)\s*}}/g; const m = t.match(r) || []; return Array.from(new Set(m.map(v => v.replace(/[{}]/g, '').trim()))); };
const handleSearchInput = () => { searchTerm = searchBox.value; saveUIState(); render(); };
const handleFavoritesToggle = () => { showOnlyFavorites = !showOnlyFavorites; saveUIState(); render(); };
const handleTagFilterClick = (e) => {
    const chip = e.target.closest('.tag-chip[data-tag]');
    if (!chip) return;
    const t = chip.dataset.tag;
    if (activeTags.includes(t)) {
        activeTags = activeTags.filter(x => x !== t);
    } else {
        activeTags.push(t);
    }
    saveUIState();
    render();
};
const handleNavClick = (v) => {
    state.currentView = v;
    showPromptsBtn.classList.toggle('active', v === 'prompts');
    showChainsBtn.classList.toggle('active', v === 'chains');
    showSettingsBtn.classList.toggle('active', v === 'settings');
    render();
    saveUIState();
};
const handleAddNew = () => {
    if (state.currentView === 'prompts') {
        state.currentView = 'promptEditor';
        state.editingPromptId = null;
        promptEditorTitle.textContent = 'Prompt erstellen';
        promptForm.reset();
        if (promptTagsInput) promptTagsInput.value = '';
        render();
        autoResizeTextarea(promptTextInput);
    } else {
        state.currentView = 'chainEditor';
        state.chainBeingEdited = { id: null, name: '', tags: [], prompts: [{ text: '' }], isFavorite: false };
        chainEditorTitle.textContent = 'Chain erstellen';
        chainNameInput.value = '';
        if (chainTagsInput) chainTagsInput.value = '';
        renderChainPromptInputs();
        render();
    }
};
const handleListClick = async (e) => {
    const btn = e.target.closest('button');
    if (btn) {
        const { action, id } = btn.dataset;
        if (action === 'toggle-favorite-prompt' || action === 'toggle-favorite-chain') {
            const type = action.split('-')[2] + 's';
            const item = state[type].find(i => i.id === id);
            if (item) {
                item.isFavorite = !item.isFavorite;
                await storage.set({ [type]: state[type] });
                render();
            }
            return;
        }
        if (action === 'run-prompt') {
            const p = state.prompts.find(p => p.id === id);
            if (!p) return;
            const v = extractVariables(p.text);
            if (v.length === 0) {
                executeInContentScript({ type: 'execute-prompt', text: p.text });
            } else {
                state.pendingExecution = { type: 'prompt', data: p };
                renderVariableInputs(v);
                state.currentView = 'variableInput';
                render();
            }
        } else if (action === 'run-chain') {
            const c = state.chains.find(c => c.id === id);
            if (!c) return;
            const a = c.prompts.map(p => p.text).join(' ');
            const v = extractVariables(a);
            if (v.length === 0) {
                executeInContentScript({ type: 'execute-chain', chain: c, delay: state.chainDelay });
            } else {
                state.pendingExecution = { type: 'chain', data: c };
                renderVariableInputs(v);
                state.currentView = 'variableInput';
                render();
            }
        } else if (action === 'edit-prompt') {
            const p = state.prompts.find(p => p.id === id);
            if (!p) return;
            state.currentView = 'promptEditor';
            state.editingPromptId = id;
            promptEditorTitle.textContent = 'Prompt bearbeiten';
            promptIdInput.value = p.id;
            promptTitleInput.value = p.title;
            promptTextInput.value = p.text;
            promptDescriptionInput.value = p.description;
            if (promptTagsInput) promptTagsInput.value = (p.tags || []).join(', ');
            render();
            setTimeout(() => autoResizeTextarea(promptTextInput), 0);
        } else if (action === 'edit-chain') {
            const c = state.chains.find(c => c.id === id);
            if (!c) return;
            state.chainBeingEdited = JSON.parse(JSON.stringify(c));
            state.currentView = 'chainEditor';
            chainEditorTitle.textContent = 'Chain bearbeiten';
            chainNameInput.value = c.name;
            if (chainTagsInput) chainTagsInput.value = (c.tags || []).join(', ');
            renderChainPromptInputs();
            render();
        } else if (action === 'delete-prompt' || action === 'delete-chain') {
            const type = action.split('-')[1];
            const listName = type + 's';
            if (confirm(`Diese(n) ${type} wirklich löschen?`)) {
                state[listName] = state[listName].filter(i => i.id !== id);
                await storage.set({ [listName]: state[listName] });
                render();
            }
        }
        return;
    }
    const card = e.target.closest('.item-card');
    if (card) {
        card.classList.toggle('expanded');
        card.classList.toggle('collapsed');
    }
};
const handleSavePrompt = async (e) => { e.preventDefault(); if (!promptTitleInput.value || !promptTextInput.value) return; const p = state.editingPromptId ? state.prompts.find(p => p.id === state.editingPromptId) : null; const tags = promptTagsInput ? promptTagsInput.value.split(',').map(t => t.trim()).filter(Boolean) : []; const n = { id: state.editingPromptId || self.crypto.randomUUID(), title: promptTitleInput.value, text: promptTextInput.value, description: promptDescriptionInput.value, tags, isFavorite: p ? p.isFavorite : false }; if (state.editingPromptId) { state.prompts = state.prompts.map(p => p.id === state.editingPromptId ? n : p); } else { state.prompts.push(n); } await storage.set({ prompts: state.prompts }); state.editingPromptId = null; handleNavClick('prompts'); };
const handleSaveChain = async (e) => {
    e.preventDefault();
    const c = state.chainBeingEdited;
    if (!c) return;
    c.name = chainNameInput.value;
    if (!c.name) {
        alert('Ein Name für die Chain ist ein Pflichtfeld.');
        return;
    }
    c.tags = chainTagsInput ? chainTagsInput.value.split(',').map(t => t.trim()).filter(Boolean) : [];
    c.prompts = c.prompts.filter(p => p.text.trim() !== '');
    if (c.prompts.length === 0) {
        alert('Eine Chain muss mindestens einen nicht-leeren Prompt enthalten.');
        return;
    }
    const n = { ...c, id: c.id || self.crypto.randomUUID() };
    const i = state.chains.findIndex(c => c.id === n.id);
    if (i > -1) {
        state.chains[i] = n;
    } else {
        state.chains.push(n);
    }
    await storage.set({ chains: state.chains });
    state.chainBeingEdited = null;
    handleNavClick('chains');
};
const handleAddPromptToChain = (e) => { e.preventDefault(); if (!state.chainBeingEdited) return; state.chainBeingEdited.prompts.push({ text: '' }); renderChainPromptInputs(); };
const handleRemovePromptFromChain = (e) => { const t = e.target.closest('button[data-action="remove-prompt-from-chain"]'); if (!t || !state.chainBeingEdited) return; e.preventDefault(); const i = parseInt(t.dataset.index); state.chainBeingEdited.prompts.splice(i, 1); renderChainPromptInputs(); };
const handleVariableSubmit = (e) => {
    e.preventDefault();
    if (!state.pendingExecution) return;
    const v = {};
    variableFieldsContainer.querySelectorAll('.variable-input').forEach(i => {
        v[i.name] = i.value;
    });
    const { type, data } = state.pendingExecution;
    const sub = t => {
        let p = t;
        for (const n in v) {
            p = p.replace(new RegExp(`{{\\s*${n}\\s*}}`, 'g'), v[n]);
        }
        return p;
    };
    if (type === 'prompt') {
        executeInContentScript({ type: 'execute-prompt', text: sub(data.text) });
    } else if (type === 'chain') {
        const p = { ...data, prompts: data.prompts.map(p => ({ ...p, text: sub(p.text) })) };
        executeInContentScript({ type: 'execute-chain', chain: p, delay: state.chainDelay });
    }
    state.pendingExecution = null;
    handleNavClick(type === 'prompt' ? 'prompts' : 'chains');
};
const executeInContentScript = (d) => {
    const isChatGptUrl = (url) => /^https:\/\/(chat\.openai\.com|chatgpt\.com)\//.test(url || '');

    const injectIntoTab = (tab) => {
        if (tab && typeof tab.id === 'number') {
            console.log("DEBUG: Tab found, attempting to execute script in Tab ID:", tab.id);

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (promptDataToInject) => {
                    document.dispatchEvent(
                        new CustomEvent('run-from-popup', { detail: promptDataToInject })
                    );
                    console.log("DEBUG injected func: CustomEvent 'run-from-popup' dispatched with detail:", promptDataToInject);
                },
                args: [d]
            }, (results) => {
                if (chrome.runtime.lastError) {
                    console.error("DEBUG popup.js: Error in executeScript:", chrome.runtime.lastError.message);
                } else {
                    console.log("DEBUG popup.js: chrome.scripting.executeScript completed. Results:", results);
                }
            });
        } else {
            console.log("DEBUG: No valid ChatGPT tab found. Alerting user.");
            alert('Bitte öffne zuerst einen Tab mit ChatGPT.');
        }
    };

    chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
        const activeTab = activeTabs && activeTabs[0];
        console.log("DEBUG: Active tab from query:", activeTab);

        if (activeTab && isChatGptUrl(activeTab.url)) {
            injectIntoTab(activeTab);
        } else {
            const queryOptions = {
                url: [
                    "https://chat.openai.com/*",
                    "https://chatgpt.com/*"
                ]
            };

            console.log("DEBUG: Fallback querying tabs with options:", queryOptions);

            chrome.tabs.query(queryOptions, (tabs) => {
                console.log("DEBUG: Raw tabs array from query:", tabs);
                console.log("DEBUG: URLs of found tabs:", tabs.map(t => t && t.url).filter(Boolean));
                console.log("DEBUG: Active states of found tabs:", tabs.map(t => t && t.active).filter(a => a !== undefined));

                const chatGptTab = tabs.find(tab => tab && tab.active) || tabs[0];
                console.log("DEBUG: Selected chatGptTab from fallback:", chatGptTab);

                injectIntoTab(chatGptTab);
            });

        }
    });
};
const handleDragStart = (e) => { const h = e.target.closest('.drag-handle'); if (!h) { e.preventDefault(); return; } const t = h.closest('.chain-prompt-item'); if (!t) return; draggedItemIndex = parseInt(t.dataset.index); setTimeout(() => t.classList.add('dragging'), 0); };
const handleDragEnd = (e) => { document.querySelectorAll('.chain-prompt-item.dragging').forEach(el => el.classList.remove('dragging')); draggedItemIndex = null; };
const handleDragOver = (e) => { e.preventDefault(); const o = e.target.closest('.chain-prompt-item'); document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over')); if (o) o.classList.add('drag-over'); };
const handleDrop = (e) => { e.preventDefault(); document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over')); const d = e.target.closest('.chain-prompt-item'); if (d === null || draggedItemIndex === null || !state.chainBeingEdited) return; const i = parseInt(d.dataset.index); if (draggedItemIndex === i) return; const [r] = state.chainBeingEdited.prompts.splice(draggedItemIndex, 1); state.chainBeingEdited.prompts.splice(i, 0, r); renderChainPromptInputs(); };

const handleCardDragStart = (e) => {
    const card = e.target.closest('.item-card');
    if (!card || e.target.closest('button')) { e.preventDefault(); return; }
    draggedCardId = card.dataset.id;
    const arr = state[state.currentView === 'prompts' ? 'prompts' : 'chains'];
    draggedCardOriginalIndex = arr.findIndex(i => i.id === draggedCardId);
    setTimeout(() => card.classList.add('dragging'), 0);
    if (e.dataTransfer && e.dataTransfer.setDragImage) {
        const img = document.createElement('div');
        img.style.position = 'absolute';
        img.style.top = '-9999px';
        document.body.appendChild(img);
        e.dataTransfer.setDragImage(img, 0, 0);
        setTimeout(() => document.body.removeChild(img), 0);
    }
};
const handleCardDragEnd = () => { document.querySelectorAll('.item-card.dragging').forEach(el => el.classList.remove('dragging')); document.querySelectorAll('.item-card.drag-over').forEach(el => el.classList.remove('drag-over')); draggedCardId = null; draggedCardOriginalIndex = null; };
const handleCardDragOver = (e) => { e.preventDefault(); const c = e.target.closest('.item-card'); document.querySelectorAll('.item-card.drag-over').forEach(el => el.classList.remove('drag-over')); if (c && c.dataset.id !== draggedCardId) c.classList.add('drag-over'); };
const handleCardDragLeave = (e) => { const c = e.target.closest('.item-card'); if (c) c.classList.remove('drag-over'); };
const handleCardDrop = async (e) => {
    e.preventDefault();
    const target = e.target.closest('.item-card');
    document.querySelectorAll('.item-card.drag-over').forEach(el => el.classList.remove('drag-over'));
    if (!target || draggedCardId === null) return;
    const listName = state.currentView === 'prompts' ? 'prompts' : 'chains';
    const arr = state[listName];
    const targetIndex = arr.findIndex(i => i.id === target.dataset.id);
    if (targetIndex === -1 || draggedCardOriginalIndex === null || draggedCardOriginalIndex === targetIndex) return;
    const [moved] = arr.splice(draggedCardOriginalIndex, 1);
    arr.splice(targetIndex, 0, moved);
    await storage.set({ [listName]: arr });
    render();
};

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
        state.prompts = data.prompts.map(p => ({ ...p, tags: Array.isArray(p.tags) ? p.tags : [] }));
        state.chains = data.chains.map(c => ({ ...c, tags: Array.isArray(c.tags) ? c.tags : [] }));
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
    if (quickThemeToggleBtn) {
        quickThemeToggleBtn.innerHTML = state.theme === 'light' ? ICON_MOON : ICON_SUN;
    }
};

const isValidHex = (val) => /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(val);

const darkenHex = (hex, factor) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    let num = parseInt(c, 16);
    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;
    r = Math.round(r * (1 - factor));
    g = Math.round(g * (1 - factor));
    b = Math.round(b * (1 - factor));
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const applyAccentColor = () => {
    let color, hover;
    if (state.accentColor === 'custom' && isValidHex(state.customAccentColor)) {
        color = state.customAccentColor;
        hover = darkenHex(color, 0.15);
    } else {
        const preset = ACCENT_PRESETS[state.accentColor] || ACCENT_PRESETS.purple;
        color = preset.color;
        hover = preset.hover;
    }
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-hover', hover);
    if (accentColorSelect) accentColorSelect.value = state.accentColor;
    if (customAccentColorInput) {
        customAccentColorInput.classList.toggle('hidden', state.accentColor !== 'custom');
        if (state.accentColor === 'custom') customAccentColorInput.value = state.customAccentColor;
    }
};

const handleThemeToggle = async () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    applyAccentColor();
    await storage.set({ theme: state.theme });
};

const handleAccentColorChange = async () => {
    if (!accentColorSelect) return;
    state.accentColor = accentColorSelect.value;
    if (state.accentColor !== 'custom') {
        state.customAccentColor = '';
    } else if (!state.customAccentColor) {
        state.customAccentColor = '#6750A4';
    }
    if (customAccentColorInput) {
        customAccentColorInput.value = state.customAccentColor;
        customAccentColorInput.classList.toggle('hidden', state.accentColor !== 'custom');
        if (state.accentColor === 'custom') customAccentColorInput.focus();
    }
    applyAccentColor();
    await storage.set({ accentColor: state.accentColor, customAccentColor: state.customAccentColor });
};

const handleCustomAccentInput = async () => {
    if (!customAccentColorInput) return;
    const val = customAccentColorInput.value.trim();
    if (isValidHex(val)) {
        state.customAccentColor = val;
        customAccentColorInput.classList.remove('invalid');
        await storage.set({ accentColor: 'custom', customAccentColor: val });
        applyAccentColor();
    } else {
        customAccentColorInput.classList.add('invalid');
    }
};

const updateDelayUI = () => {
    if (!chainDelayInput) return;
    const val = parseInt(chainDelayInput.value, 10) || 0;
    if (chainDelayDisplay) chainDelayDisplay.textContent = `${val} s`;
    const max = parseInt(chainDelayInput.max, 10) || 10;
    const percentage = (val / max) * 100;
    chainDelayInput.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percentage}%, var(--slider-track) ${percentage}%, var(--slider-track) 100%)`;
};

const handleDelayChange = async () => {
    if (!chainDelayInput) return;
    let val = parseInt(chainDelayInput.value, 10);
    if (isNaN(val) || val < 0) val = 0;
    if (val > 10) val = 10;
    chainDelayInput.value = val;
    state.chainDelay = val;
    updateDelayUI();
    await storage.set({ chainDelay: val });
};

const handleShowTagsFilterChange = async () => {
    if (!showTagsFilterInput) return;
    state.showTagsFilter = showTagsFilterInput.checked;
    await storage.set({ showTagsFilter: state.showTagsFilter });
    render();
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    queryElements();
    await loadData();
    await loadUIState();
    applyTheme();
    applyAccentColor();
    if (chainDelayInput) {
        chainDelayInput.value = state.chainDelay;
        updateDelayUI();
    }
    if (showTagsFilterInput) showTagsFilterInput.checked = state.showTagsFilter;
    if (exportBtn) exportBtn.querySelector('.btn-icon').innerHTML = ICON_DOWNLOAD;
    if (importBtn) importBtn.querySelector('.btn-icon').innerHTML = ICON_UPLOAD;
    if (searchBox) searchBox.value = searchTerm;
    if (favoritesToggleBtn && showOnlyFavorites) favoritesToggleBtn.classList.add('active');
    render();
    saveUIState();

    showPromptsBtn.addEventListener('click', () => handleNavClick('prompts'));
    showChainsBtn.addEventListener('click', () => handleNavClick('chains'));
    showSettingsBtn.addEventListener('click', () => handleNavClick('settings'));
    addNewBtn.addEventListener('click', handleAddNew);
    contentList.addEventListener('click', handleListClick);
    searchBox.addEventListener('input', handleSearchInput);
    if (favoritesToggleBtn) favoritesToggleBtn.addEventListener('click', handleFavoritesToggle);
    if (tagsFilterContainer) tagsFilterContainer.addEventListener('click', handleTagFilterClick);
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
    contentList.addEventListener('dragstart', handleCardDragStart);
    contentList.addEventListener('dragend', handleCardDragEnd);
    contentList.addEventListener('dragover', handleCardDragOver);
    contentList.addEventListener('dragleave', handleCardDragLeave);
    contentList.addEventListener('drop', handleCardDrop);
    exportBtn.addEventListener('click', handleExport);
    importBtn.addEventListener('click', handleImportClick);
    importFileInput.addEventListener('change', handleImportFile);
    if (chainDelayInput) {
        chainDelayInput.addEventListener('input', handleDelayChange);
        chainDelayInput.addEventListener('change', handleDelayChange);
    }
    if (showTagsFilterInput) showTagsFilterInput.addEventListener('change', handleShowTagsFilterChange);
    if (accentColorSelect) accentColorSelect.addEventListener('change', handleAccentColorChange);
    if (customAccentColorInput) customAccentColorInput.addEventListener('input', handleCustomAccentInput);
    if (quickThemeToggleBtn) quickThemeToggleBtn.addEventListener('click', handleThemeToggle);
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            handleThemeToggle();
        }
    });
});
