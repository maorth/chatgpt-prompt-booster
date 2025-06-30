(() => {
    let isExecuting = false;
    let currentChain = [];
    let currentPromptIndex = 0;
    let delaySeconds = 0;

    // Registriere diesen Tab beim Hintergrundskript
    try {
        chrome.runtime.sendMessage({ type: 'register-chatgpt-tab' });
    } catch (e) {
        console.error('Failed to register ChatGPT tab', e);
    }

    // --- DOM-Helfer ---
    const getCurrentPlatform = () => {
        if (window.location.hostname.includes('chat.openai.com') || window.location.hostname.includes('chatgpt.com')) {
            return 'chatgpt';
        }
        if (window.location.hostname.includes('gemini.google.com') || window.location.hostname.includes('bard.google.com')) {
            return 'gemini';
        }
        return null;
    };

    const SUBMIT_BUTTON_SELECTORS = [
        'button[data-testid="send-button"]',
        'button[aria-label="Send message"]'
        // Removed outdated selectors
    ];

    const getSubmitButton = () => {
        const platform = getCurrentPlatform();
        if (platform === 'chatgpt') {
            for (const sel of SUBMIT_BUTTON_SELECTORS) {
                const btn = document.querySelector(sel);
                if (btn) return btn;
            }
        } else if (platform === 'gemini') {
            // Prioritize the specific aria-label to avoid matching the "Stop" button
            const sendBtn = document.querySelector('button[aria-label="Nachricht senden"]');
            if (sendBtn) return sendBtn;
            // Generic fallback removed to prevent accidental Stop button clicks
        }
        return null;
    };
    // Selector for the ChatGPT input field (now a contenteditable div) or Gemini's field
    const getInputArea = () => {
        const platform = getCurrentPlatform();
        if (platform === 'chatgpt') {
            return document.querySelector('#prompt-textarea');
        } else if (platform === 'gemini') {
            return document.querySelector('div.ql-editor[contenteditable="true"][aria-label="Prompt hier eingeben"]');
        }
        return null;
    };
    // Einheitliche Ermittlung eines Lade-/Stop-Indikators
    const getStopIndicator = () => {
        const platform = getCurrentPlatform();
        if (platform === 'chatgpt') {
            return document.querySelector('button[data-testid="stop-button"]');
        } else if (platform === 'gemini') {
            return document.querySelector('button[aria-label="Stop generating"]') ||
                   document.querySelector('mat-icon[fonticon="magic_button_loading"]') ||
                   document.querySelector('div[data-response-status="generating"]');
        }
        return null;
    };

    /**
     * Finale, korrekte Kernlogik: Wartet auf das Erscheinen und Verschwinden des Stop-Buttons.
     * @param {function} onFinishCallback - Die Funktion, die nach Erfolg aufgerufen wird.
     */
    const waitForCompletion = (onFinishCallback) => {
        let hasGenerationStarted = false;
        const startTime = Date.now();
        const timeoutMs = 60 * 1000; // 60 seconds timeout
        let platformChecked = false; // To log platform only once

        const intervalId = setInterval(() => {
            if (!platformChecked) {
                console.log("DEBUG content.js: waitForCompletion started for platform:", getCurrentPlatform());
                platformChecked = true;
            }

            const stopIndicator = getStopIndicator();
            console.log(`DEBUG content.js: waitForCompletion loop. hasGenerationStarted: ${hasGenerationStarted}, StopIndicator present: ${!!stopIndicator}. Time elapsed: ${((Date.now() - startTime) / 1000).toFixed(1)}s`);

            if (!hasGenerationStarted && stopIndicator) {
                hasGenerationStarted = true;
                console.log("DEBUG content.js: AI generation (Gemini) started (stop indicator appeared).");
            }

            if (hasGenerationStarted && !stopIndicator) {
                console.log("DEBUG content.js: AI generation (Gemini) completed (stop indicator disappeared).");
                clearInterval(intervalId);
                onFinishCallback();
                return;
            }

            if (Date.now() - startTime > timeoutMs) {
                console.error("DEBUG content.js: AI generation (Gemini) timed out after 60 seconds. Aborting completion wait.");
                clearInterval(intervalId);
                try { chrome.runtime.sendMessage({ type: 'execution-error', message: 'AI generation timed out on content.js side (Gemini).' }); } catch(e) {}
                isExecuting = false;
                onFinishCallback();
                return;
            }
        }, 200);
    };
    
    const submitPrompt = (text, onFinishCallback) => {
        const inputArea = getInputArea();
        if (!inputArea) {
            console.error("DEBUG content.js: ChatGPT input field not found!");
            alert('Fehler: Eingabebereich nicht gefunden.');
            isExecuting = false;
            try { chrome.runtime.sendMessage({ type: 'execution-error', message: 'input-area-missing' }); } catch(e) {}
            if (onFinishCallback) onFinishCallback();
            return;
        }
        
        console.log("DEBUG content.js: Original promptText:", text);
        console.log("DEBUG content.js: Chat input found:", inputArea);

        inputArea.focus();

        inputArea.innerText = text; // CRITICAL CHANGE: Use innerText for contenteditable div
        console.log("DEBUG content.js: Input field text set. Current value:", inputArea.innerText);

        // Simulate paste event to trigger React state update
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('text/plain', text);
        const pasteEvent = new ClipboardEvent('paste', {
            clipboardData: dataTransfer,
            bubbles: true,
            cancelable: true
        });
        inputArea.dispatchEvent(pasteEvent);
        console.log("DEBUG content.js: Prompt inserted via simulated paste event.");

        const findAndClickSendButton = (attempts = 0) => {
            const MAX_ATTEMPTS = 20;
            const RETRY_DELAY_MS = 100;

            const submitButton = getSubmitButton();
            if (submitButton && !submitButton.disabled) {
                console.log("DEBUG content.js: Send button FOUND and enabled. Clicking now!", submitButton);
                submitButton.click();
                waitForCompletion(() => {
                    console.log("DEBUG content.js: !!! ONFINISH CALLBACK TRIGGERED !!!");
                    if (onFinishCallback) onFinishCallback();
                });
            } else if (attempts < MAX_ATTEMPTS) {
                console.log(`DEBUG content.js: Send button not yet found or disabled. Retrying... (Attempt ${attempts + 1}/${MAX_ATTEMPTS})`);
                setTimeout(() => findAndClickSendButton(attempts + 1), RETRY_DELAY_MS);
            } else {
                console.error("DEBUG content.js: Send button NOT found or enabled after multiple attempts.");
                alert('Fehler: Senden-Button konnte nach Texteingabe nicht gefunden werden.');
                if (onFinishCallback) onFinishCallback();
                isExecuting = false;
                try { chrome.runtime.sendMessage({ type: 'execution-error', message: 'send-button-missing' }); } catch(e) {}
            }
        };
        findAndClickSendButton();
    };

    // --- Logik für einzelne Prompts ---
    const executeSinglePrompt = (text, refs) => {
        const processed = resolveReferences(text, refs);
        submitPrompt(processed, () => {
            isExecuting = false;
            try { chrome.runtime.sendMessage({ type: 'execution-complete' }); } catch(e) {}
        });
    };

    // --- Logik für Ketten ---
    const updateStatusOverlay = (step, total) => {
        let o = document.getElementById('chain-status-overlay');
        if (!o) {
            o = document.createElement('div');
            o.id = 'chain-status-overlay';
            o.style.position = 'fixed';
            o.style.bottom = '1rem';
            o.style.right = '1rem';
            o.style.background = 'rgba(0,0,0,0.8)';
            o.style.color = '#fff';
            o.style.padding = '0.5rem 1rem';
            o.style.borderRadius = '0.5rem';
            o.style.zIndex = '9999';
            o.style.fontSize = '14px';
            o.style.transition = 'background 0.3s ease, transform 0.2s ease';
            const textDiv = document.createElement('div');
            textDiv.className = 'chain-status-text';
            o.appendChild(textDiv);
            document.body.appendChild(o);
        }
        const textDiv = o.querySelector('.chain-status-text');

        let text = '';
        if (typeof step === 'number' && typeof total === 'number') {
            text = `Prompt ${step} von ${total} wird ausgeführt.`;
        }
        if (!text) text = 'Chain abgeschlossen.';

        if (textDiv) textDiv.textContent = text;
    };

    const hideStatusOverlay = (delay = 0) => {
        const o = document.getElementById('chain-status-overlay');
        if (!o) return;
        if (delay > 0) {
            setTimeout(() => o.remove(), delay);
        } else {
            o.remove();
        }
    };

    const showSuccessOverlay = () => {
        const o = document.getElementById('chain-status-overlay');
        if (!o) return;
        o.style.background = '#4CAF50';
        o.textContent = '✅ Chain completed successfully!';
        o.style.transform = 'scale(1.05)';
        setTimeout(() => { o.style.transform = 'scale(1)'; }, 200);
    };

    // --- Countdown Timer for wait durations ---
    let countdownTotal = 0;
    const showCountdownTimer = (duration) => {
        countdownTotal = duration;
        let c = document.getElementById('chain-countdown-timer');
        if (!c) {
            c = document.createElement('div');
            c.id = 'chain-countdown-timer';
            c.style.position = 'fixed';
            c.style.bottom = '4.5rem';
            c.style.right = '1rem';
            c.style.width = '48px';
            c.style.height = '48px';
            c.style.zIndex = '9999';
            c.style.display = 'flex';
            c.style.alignItems = 'center';
            c.style.justifyContent = 'center';
            c.style.color = '#fff';
            c.style.transition = 'opacity 0.3s ease';
            c.style.opacity = '0';

            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('width', '48');
            svg.setAttribute('height', '48');
            svg.style.transform = 'rotate(-90deg) scale(-1,1)';

            const radius = 22;
            const circumference = 2 * Math.PI * radius;

            const track = document.createElementNS(svgNS, 'circle');
            track.setAttribute('cx', '24');
            track.setAttribute('cy', '24');
            track.setAttribute('r', radius.toString());
            track.setAttribute('stroke', '#444');
            track.setAttribute('stroke-width', '4');
            track.setAttribute('fill', 'transparent');

            const progress = document.createElementNS(svgNS, 'circle');
            progress.classList.add('countdown-progress');
            progress.setAttribute('cx', '24');
            progress.setAttribute('cy', '24');
            progress.setAttribute('r', radius.toString());
            progress.setAttribute('stroke', '#32CD32');
            progress.setAttribute('stroke-width', '4');
            progress.setAttribute('fill', 'transparent');
            progress.style.strokeDasharray = circumference;
            progress.style.strokeDashoffset = circumference;

            svg.appendChild(track);
            svg.appendChild(progress);

            c.appendChild(svg);
            document.body.appendChild(c);
            // store circumference
            c.dataset.circumference = circumference.toString();
        }
        c.style.opacity = '1';
        updateCountdownTimer(duration);
        const circle = c.querySelector('.countdown-progress');
        if (circle) {
            circle.style.transition = `stroke-dashoffset ${duration}s linear`;
            // Trigger layout so transition applies when offset changes
            circle.getBoundingClientRect();
            circle.style.strokeDashoffset = '0';
        }
    };

    const updateCountdownTimer = (remain) => {
        const c = document.getElementById('chain-countdown-timer');
        if (!c) return;
        const circle = c.querySelector('.countdown-progress');
        const circumference = parseFloat(c.dataset.circumference || '0');
        if (circle) {
            const offset = circumference * (remain / countdownTotal);
            circle.style.strokeDashoffset = offset.toString();
        }
    };

    const hideCountdownTimer = () => {
        const c = document.getElementById('chain-countdown-timer');
        if (!c) return;
        c.style.opacity = '0';
        setTimeout(() => { if (c.parentNode) c.remove(); }, 300);
    };

    const getLastAssistantMessage = () => {
        const platform = getCurrentPlatform();
        let msgs = null;
        if (platform === 'chatgpt') {
            msgs = document.querySelectorAll('div[data-message-author-role="assistant"]');
        } else if (platform === 'gemini') {
            msgs = document.querySelectorAll('[aria-label="Assistant response"]');
        }
        if (msgs && msgs.length > 0) {
            const last = msgs[msgs.length - 1];
            return last ? (last.innerText || last.textContent || '') : '';
        }
        console.warn("DEBUG content.js: No assistant messages found for platform", platform);
        return '';
    };

    const getChatMessageContent = (referenceType) => {
        if (referenceType === 'LAST_GPT_MSG') {
            return getLastAssistantMessage();
        }
        return '';
    };

    const resolveReferences = (text, refs) => {
        let processed = text;
        if (refs && refs.includes('LAST_GPT_MSG')) {
            const last = getLastAssistantMessage();
            processed = processed.replace(/<LAST_GPT_MSG>/g, last);
            console.log('DEBUG content.js: <LAST_GPT_MSG> resolved. Processed text:', processed);
        }
        return processed;
    };

    const waitBeforeNext = (cb) => {
        if (delaySeconds <= 0) { cb(); return; }
        updateStatusOverlay(currentPromptIndex, currentChain.length);
        showCountdownTimer(delaySeconds);
        setTimeout(() => {
            hideCountdownTimer();
            cb();
        }, delaySeconds * 1000);
    };

    const runNextChainStep = () => {
        if (currentPromptIndex >= currentChain.length) {
            isExecuting = false;
            currentChain = [];
            currentPromptIndex = 0;
            updateStatusOverlay();
            showSuccessOverlay();
            hideStatusOverlay(4000);
            try { chrome.runtime.sendMessage({ type: 'execution-complete' }); } catch(e) {}
            return;
        }
        updateStatusOverlay(currentPromptIndex + 1, currentChain.length);
        const stepObj = currentChain[currentPromptIndex];
        const promptText = resolveReferences(stepObj.text, stepObj.resolvedReferences);

        try {
            submitPrompt(promptText, () => {
                currentPromptIndex++;
                if (currentPromptIndex >= currentChain.length) {
                    isExecuting = false;
                    currentChain = [];
                    currentPromptIndex = 0;
                    updateStatusOverlay();
                    showSuccessOverlay();
                    hideStatusOverlay(4000);
                    try { chrome.runtime.sendMessage({ type: 'execution-complete' }); } catch(e) {}
                } else {
                    waitBeforeNext(runNextChainStep);
                }
            });
        } catch (error) {
            console.error("DEBUG content.js: Uncaught error during chain step:", error);
            isExecuting = false;
            currentChain = [];
            currentPromptIndex = 0;
            updateStatusOverlay();
            hideStatusOverlay(4000);
            try { chrome.runtime.sendMessage({ type: 'execution-error', message: error.message || 'Chain step execution failed.' }); } catch(e) {}
        }
    };


    const executeFlowStep = ({ text, step, total, delay, resolvedReferences }) => {
        delaySeconds = typeof delay === 'number' && delay >= 0 ? delay : 0;
        updateStatusOverlay(step, total);
        const processed = resolveReferences(text, resolvedReferences);
        try {
            submitPrompt(processed, () => {
                const output = getLastAssistantMessage();
                const finish = () => {
                    isExecuting = false;
                    if (step === total) {
                        showSuccessOverlay();
                        hideStatusOverlay(4000);
                        try { chrome.runtime.sendMessage({ type: 'execution-complete' }); } catch(e) {}
                    }
                    chrome.runtime.sendMessage({ type: 'flow-step-result', step, output });
                };
                if (step < total && delaySeconds > 0) {
                    showCountdownTimer(delaySeconds);
                    setTimeout(() => { hideCountdownTimer(); finish(); }, delaySeconds * 1000);
                } else {
                    finish();
                }
            });
        } catch (error) {
            console.error("DEBUG content.js: Uncaught error during flow step:", error);
            isExecuting = false;
            try { chrome.runtime.sendMessage({ type: 'execution-error', message: error.message || 'Flow step execution failed.' }); } catch(e) {}
            chrome.runtime.sendMessage({ type: 'flow-step-result', step, output: '' });
        }
    };

    // --- Zentraler Event-Listener ---
    const handleRunRequest = (d) => {
        if (isExecuting) {
            alert('Es wird bereits ein Prompt oder eine Chain ausgeführt (intern).');
            return;
        }

        isExecuting = true;
        const { type, text, chain, delay, step, total, resolvedReferences } = d;
        delaySeconds = typeof delay === 'number' && delay >= 0 ? delay : 0;

        if (type === 'execute-prompt') {
            executeSinglePrompt(text, resolvedReferences);
        } else if (type === 'execute-chain' && chain.prompts.length > 0) {
            currentChain = chain.prompts;
            currentPromptIndex = 0;
            runNextChainStep();
        } else if (type === 'execute-flow-step') {
            executeFlowStep({ text, step, total, delay, resolvedReferences });
        } else {
            isExecuting = false;
            try { chrome.runtime.sendMessage({ type: 'execution-error', message: 'unknown-execution-type' }); } catch(e) {}
        }
    };

    document.addEventListener('run-from-popup', (e) => {
        handleRunRequest(e.detail);
    });

    chrome.runtime.onMessage.addListener((msg) => {
        if (msg && msg.type === 'run-from-popup') {
            handleRunRequest(msg.detail);
        }
    });

})();