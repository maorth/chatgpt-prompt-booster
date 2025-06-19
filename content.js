(() => {
    let isExecuting = false;
    let currentChain = [];
    let currentPromptIndex = 0;

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
                if(onFinishCallback) onFinishCallback();
            }
        }, 500);
    };

    // --- Logik für einzelne Prompts ---
    const executeSinglePrompt = (text) => {
        submitPrompt(text, () => { isExecuting = false; });
    };

    // --- Logik für Ketten ---
    const runNextChainStep = () => {
        if (currentPromptIndex >= currentChain.length) {
            isExecuting = false;
            currentChain = [];
            currentPromptIndex = 0;
            return;
        }
        const promptText = currentChain[currentPromptIndex].text;
        
        submitPrompt(promptText, () => {
            currentPromptIndex++;
            setTimeout(runNextChainStep, 250); // Kurze Atempause vor dem nächsten Prompt
        });
    };

    // --- Zentraler Event-Listener ---
    document.addEventListener('run-from-popup', (e) => {
        if (isExecuting) {
            alert('Es wird bereits ein Prompt oder eine Chain ausgeführt.');
            return;
        }
        
        isExecuting = true;
        const { type, text, chain } = e.detail;

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