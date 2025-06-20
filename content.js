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
            c.style.fontWeight = 'bold';
            c.style.fontSize = '14px';
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
            progress.style.strokeDashoffset = '0';

            svg.appendChild(track);
            svg.appendChild(progress);

            const num = document.createElement('div');
            num.className = 'countdown-number';
            num.style.position = 'absolute';
            num.style.top = '50%';
            num.style.left = '50%';
            num.style.transform = 'translate(-50%, -50%)';


            c.appendChild(svg);
            c.appendChild(num);
            document.body.appendChild(c);
            // store circumference
            c.dataset.circumference = circumference.toString();
        }
        c.style.opacity = '1';
        updateCountdownTimer(duration);
    };

    const updateCountdownTimer = (remain) => {
        const c = document.getElementById('chain-countdown-timer');
        if (!c) return;
        const num = c.querySelector('.countdown-number');
        const circle = c.querySelector('.countdown-progress');
        const circumference = parseFloat(c.dataset.circumference || '0');
        if (num) num.textContent = remain.toString();
        if (circle) {
            const offset = circumference * (1 - remain / countdownTotal);
            circle.style.strokeDashoffset = offset.toString();
        }
    };

    const hideCountdownTimer = () => {
        const c = document.getElementById('chain-countdown-timer');
        if (!c) return;
        c.style.opacity = '0';
        setTimeout(() => { if (c.parentNode) c.remove(); }, 300);
    };

    const waitBeforeNext = (cb) => {
        if (delaySeconds <= 0) { cb(); return; }
        let remain = delaySeconds;
        updateStatusOverlay(currentPromptIndex, currentChain.length);
        showCountdownTimer(remain);
        const i = setInterval(() => {
            remain--;
            if (remain > 0) {
                updateCountdownTimer(remain);
            } else {
                clearInterval(i);
                hideCountdownTimer();
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
            showSuccessOverlay();
            hideStatusOverlay(4000);
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
                showSuccessOverlay();
                hideStatusOverlay(4000);
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
