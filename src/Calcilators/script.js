const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');

let currInput = '';
let isOn = false;

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.textContent;

        if (value === 'ON') {

            isOn = true;
            currInput = '';
            display.value = '0';
            return;
        }

        if (!isOn) return;

        if (value === 'OFF') {

            isOn = false;
            currInput = '';
            display.value = '';
            return;
        }

        if (value === 'AC') {

            currInput = '';
            display.value = '0';
            return;
        }

        if (value === '=') {
            if (currInput.trim() === '') return;

            try {
                let expression = currInput
                    .replace(/x/g, '*')
                    .replace(/%/g, '/100')
                    .replace(/√/g, 'Math.sqrt');

                let result = eval(expression);

                if (Number.isFinite(result)) {
                    display.value = result;
                    currInput = result.toString();
                }
                else {
                    display.value = 'Error';
                    currInput = '';
                }
            }
            catch {
                display.value = 'Error';
                currInput = '';
            }
        }

        if (value === '+/-') {

            if (currInput.startsWith('-')) {
                currInput = '-' + currInput;
            }

            display.value = currInput;
            return;
        }

        currInput += value;
        display.value = currInput;
    });
});

