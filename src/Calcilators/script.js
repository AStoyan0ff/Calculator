const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');
const powerBtn = document.querySelector('.power');

let currentInput = '';
let isOn = false;

function setButtonsState(on) {

    buttons.forEach(b => { 
        if (!b.classList.contains('power')) b.disabled = !on; });
}

function getBtnValue(btn) {
    return (btn.dataset.value ?? btn.textContent).trim();
}

function normalize(expr) {
    return expr
        .replace(/×|x/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/√/g, 'Math.sqrt')
        .replace(/%/g, '/100');
}

function safeEval(expr) {

    const sanitized = normalize(expr).replace(/\s+/g, '');
    const cleaned = sanitized.replace(/[+\-*/.]$/, '');
    if (!cleaned) return '';
  
    return Function(`"use strict"; return (${cleaned});`)();
}
setButtonsState(false);

buttons.forEach(btn => {
    btn.addEventListener('click', () => {

        const value = getBtnValue(btn);
        if (!value) return;

   
        if (value === 'power') {
        
        isOn = !isOn;
        powerBtn.textContent = isOn 
        ? 'OFF' 
        : 'ON';

        currentInput = '';
        display.value = isOn 
        ? '0' 
        : '';

        setButtonsState(isOn);
        return;
        }

    if (!isOn) return;

    switch (value) {

        case 'AC':

            currentInput = '';
            display.value = '0';
            return;

        case '=': {

            try {
            const result = safeEval(currentInput);

            if (result === '' || !Number.isFinite(result)) {
                display.value = 'Error';
                currentInput = '';
            } 
            else {

                display.value = String(result);
                currentInput = String(result); 
            }
        } 
        catch {

            display.value = 'Error';
            currentInput = '';
        }
        return;
    }
        case '+/-':

            if (currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1);
            } 

            else {

                currentInput = currentInput 
                ? '-' + currentInput 
                : '-';
            }

            display.value = currentInput || '0';
            return;

        case '.': {
            
            const parts = currentInput.split(/[+\-×x*/÷]/);

            if (!parts[parts.length - 1].includes('.')) {

            currentInput += '.';
            display.value = currentInput;
            }

            return;
        }

        default: {
        
            const isOperator = /[+\-×x*/÷]/.test(value);
            const operatorAtEnd = /[+\-×x*/÷]$/.test(currentInput);

            if (isOperator) {
                if (currentInput === '' && (value === '+' || value === '-')) {
                currentInput = value; 
                } 
                else if (operatorAtEnd) {
                    currentInput = currentInput.replace(/[+\-×x*/÷]$/, value);
                } 
                else {
                    currentInput += value;
            }
        } 
        else {
            currentInput += value;
        }
        display.value = currentInput;
      }
    }
  });
});
