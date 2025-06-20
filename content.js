(() => {
    let isExecuting = false;
    let currentChain = [];
    let currentPromptIndex = 0;
    let delaySeconds = 0;

    // --- DOM-Helfer ---
    const getSubmitButton = () => document.querySelector('button#composer-submit-button');
    const getInputArea = () => document.querySelector('div#prompt-textarea');
    // Der datenbasierte Selektor für den Stop-Button
    const getStopButton = () => document.querySelector('button[data-testid="stop-button"]');

    /**
     * Finale, korrekte Kernlogik: Wartet auf das Erscheinen und Verschwinden des Stop-Buttons.
     * @param {function} onFinishCallback - Die Funktion, die nach Erfolg aufgerufen wird.
     */
    const waitForCompletion = (onFinishCallback) => {
        let hasGenerationStarted = false; // Merker, ob der Stop-Button schon einmal gesehen wurde.
        
        const intervalId = setInterval(() => {
            const stopButton = getStopButton();

            // Phase 1: Warten, bis der Stop-Button erscheint. Das bestätigt den Start der Generierung.
            if (!hasGenerationStarted && stopButton) {
                hasGenerationStarted = true;
            }

            // Phase 2: Warten, bis der erschienene Stop-Button wieder verschwindet. Das bestätigt das Ende.
            if (hasGenerationStarted && !stopButton) {
                clearInterval(intervalId); // Polling beenden
                onFinishCallback();      // Erfolgs-Callback ausführen
            }
        }, 200); // Prüfintervall: 200 Millisekunden
    };
    
    const submitPrompt = (text, onFinishCallback) => {
        const inputArea = getInputArea();
        if (!inputArea) {
            alert('Fehler: Eingabebereich nicht gefunden.');
            isExecuting = false;
            updateStatusOverlay(undefined, undefined, undefined, 'Fehler: Eingabebereich nicht gefunden.');
            hideStatusOverlay(2000);
            if(onFinishCallback) onFinishCallback();
            return;
        }
        
        inputArea.innerText = text;
        inputArea.dispatchEvent(new Event('input', { bubbles: true }));

        setTimeout(() => {
            const submitButton = getSubmitButton();
            if (submitButton && !submitButton.disabled) {
                submitButton.click();
                waitForCompletion(onFinishCallback);
            } else {
                alert('Fehler: Senden-Button konnte nach Texteingabe nicht gefunden werden.');
                isExecuting = false;
                updateStatusOverlay(undefined, undefined, undefined, 'Fehler beim Senden. Ausführung abgebrochen.');
                hideStatusOverlay(2000);
                if(onFinishCallback) onFinishCallback();
            }
        }, 500);
    };

    // --- Logik für einzelne Prompts ---
    const executeSinglePrompt = (text) => {
        submitPrompt(text, () => { isExecuting = false; });
    };

    // --- Logik für Ketten ---
    const updateStatusOverlay = (step, total, waitSec, message) => {
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
            document.body.appendChild(o);
        }
        let text = '';
        if (message) {
            text = message;
        } else {
            if (typeof step === 'number' && typeof total === 'number') {
                text = `Prompt ${step} von ${total} wird ausgeführt.`;
            }
            if (typeof waitSec === 'number' && waitSec > 0) {
                text += ` Warte ${waitSec}s...`;
            }
            if (!text) text = 'Chain abgeschlossen.';
        }
        o.textContent = text;
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

    const waitBeforeNext = (cb) => {
        if (delaySeconds <= 0) { cb(); return; }
        let remain = delaySeconds;
        updateStatusOverlay(currentPromptIndex + 1, currentChain.length, remain);
        const i = setInterval(() => {
            remain--;
            if (remain > 0) {
                updateStatusOverlay(currentPromptIndex + 1, currentChain.length, remain);
            } else {
                clearInterval(i);
                cb();
            }
        }, 1000);
    };

    const runNextChainStep = () => {
        if (currentPromptIndex >= currentChain.length) {
            isExecuting = false;
            currentChain = [];
            currentPromptIndex = 0;
            updateStatusOverlay();
            hideStatusOverlay(2000);
            return;
        }
        updateStatusOverlay(currentPromptIndex + 1, currentChain.length);
        const promptText = currentChain[currentPromptIndex].text;

        submitPrompt(promptText, () => {
            currentPromptIndex++;
            if (currentPromptIndex >= currentChain.length) {
                isExecuting = false;
                currentChain = [];
                currentPromptIndex = 0;
                updateStatusOverlay();
                hideStatusOverlay(2000);
            } else {
                waitBeforeNext(runNextChainStep);
            }
        });
    };

    // --- Zentraler Event-Listener ---
    document.addEventListener('run-from-popup', (e) => {
        if (isExecuting) {
            alert('Es wird bereits ein Prompt oder eine Chain ausgeführt.');
            return;
        }
        
        isExecuting = true;
        const { type, text, chain, delay } = e.detail;
        delaySeconds = typeof delay === 'number' && delay >= 0 ? delay : 0;

        if (type === 'execute-prompt') {
            executeSinglePrompt(text);
        } else if (type === 'execute-chain' && chain.prompts.length > 0) {
            currentChain = chain.prompts;
            currentPromptIndex = 0;
            runNextChainStep();
        } else {
            isExecuting = false;
        }
    });

})();
