let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

function updateDisplay() {
    display.textContent = currentInput;
    display.classList.remove('error');
}

function appendToDisplay(value) {
    if (shouldResetDisplay || currentInput === 'Error') {
        currentInput = '';
        shouldResetDisplay = false;
    }

    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        if (value === '.') {
            const parts = currentInput.split(/[\+\-\*\/]/);
            const lastNumber = parts[parts.length - 1];
            if (lastNumber.includes('.')) {
                return;
            }
        }

        if (['+', '-', '*', '/'].includes(value)) {
            const lastChar = currentInput.slice(-1);
            if (['+', '-', '*', '/'].includes(lastChar)) {
                currentInput = currentInput.slice(0, -1) + value;
                updateDisplay();
                return;
            }
        }

        currentInput += value;
    }

    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
}

function backspace() {
    if (currentInput === 'Error') {
        clearDisplay();
        return;
    }

    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculateResult() {
    try {
        if (!/^[0-9+\-*/.() ]+$/.test(currentInput)) {
            throw new Error('Invalid input');
        }

        let expression = currentInput.replace(/[\+\-\*\/]+$/, '');

        if (expression.includes('/0')) {
            throw new Error('Cannot divide by zero');
        }

        const result = Function('"use strict"; return (' + expression + ')')();

        if (!isFinite(result)) {
            throw new Error('Invalid result');
        }

        const formattedResult = Number(result.toPrecision(12)).toString();
        currentInput = formattedResult;
        shouldResetDisplay = true;

    } catch (error) {
        currentInput = 'Error';
        display.classList.add('error');
        shouldResetDisplay = true;
    }

    updateDisplay();
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }

    if ('0123456789'.includes(key)) {
        appendToDisplay(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === 'Enter' || key === '=') {
        calculateResult();
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (key === 'Backspace') {
        backspace();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});
