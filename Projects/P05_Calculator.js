let currentInput = '';
let operator = '';
let previousInput = '';

// Initialize theme based on device preference
window.onload = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) document.body.classList.add('dark-mode');
  updateThemeButton();
};

function appendNumber(number) {
  currentInput += number;
  updateScreen();
}

function setOperator(op) {
  if (currentInput === '') return;
  if (previousInput !== '') calculate();
  operator = op;
  previousInput = currentInput;
  currentInput = '';
}

function applyFunction(func) {
  if (currentInput === '') return;
  let num = parseFloat(currentInput);

  switch(func) {
    case 'sin': currentInput = Math.sin(num * Math.PI/180).toFixed(6); break;
    case 'cos': currentInput = Math.cos(num * Math.PI/180).toFixed(6); break;
    case 'tan': currentInput = Math.tan(num * Math.PI/180).toFixed(6); break;
    case 'log': currentInput = Math.log10(num).toFixed(6); break;
    case 'sqrt': currentInput = Math.sqrt(num).toFixed(6); break;
    case '^': currentInput = (num * num).toFixed(6); break;
  }

  updateScreen();
}

function clearScreen() {
  currentInput = '';
  previousInput = '';
  operator = '';
  updateScreen();
}

function calculate() {
  if (previousInput === '' || currentInput === '') return;

  let result;
  switch(operator) {
    case '+': result = parseFloat(previousInput) + parseFloat(currentInput); break;
    case '-': result = parseFloat(previousInput) - parseFloat(currentInput); break;
    case '*': result = parseFloat(previousInput) * parseFloat(currentInput); break;
    case '/': result = parseFloat(previousInput) / parseFloat(currentInput); break;
    default: return;
  }

  currentInput = result.toString();
  operator = '';
  previousInput = '';
  updateScreen();
}

function updateScreen() {
  document.getElementById('screen').value = currentInput;
}

// Toggle Dark/Light Mode
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  updateThemeButton();
}

function updateThemeButton() {
  const btn = document.getElementById('theme-btn');
  if (document.body.classList.contains('dark-mode')) {
    btn.textContent = '☀️'; // light mode icon
  } else {
    btn.textContent = '🌙'; // dark mode icon
  }
}
