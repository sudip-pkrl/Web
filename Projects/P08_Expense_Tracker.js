const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const categorySelect = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const transactions = document.getElementById("transactions");
const balanceDisplay = document.getElementById("balance");
const themeToggle = document.getElementById("themeToggle");
const chartCanvas = document.getElementById("chart");

let data = JSON.parse(localStorage.getItem("data")) || [];
let theme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (theme === "dark") document.body.classList.add("dark");

let myChart;

function save() {
  localStorage.setItem("data", JSON.stringify(data));
}

function render() {
  transactions.innerHTML = "";
  let balance = 0;
  let incomeSum = 0, expenseSum = 0;

  data.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = item.type;
    li.innerHTML = `<span>${item.desc} ($${item.amount}) [${item.category}]</span>`;

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => edit(index);

    const delBtn = document.createElement("button");
    delBtn.textContent = "X";
    delBtn.onclick = () => remove(index);

    actions.append(editBtn, delBtn);
    li.appendChild(actions);
    transactions.appendChild(li);

    balance += item.type === "income" ? item.amount : -item.amount;
    if (item.type === "income") incomeSum += item.amount;
    else expenseSum += item.amount;
  });

  balanceDisplay.textContent = balance.toFixed(2);
  renderChart(incomeSum, expenseSum);
}

function addTransaction() {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;
  const category = categorySelect.value;

  if (!desc || isNaN(amount)) return;

  data.push({ desc, amount, type, category });
  descInput.value = "";
  amountInput.value = "";
  save();
  render();
}

function remove(index) {
  data.splice(index, 1);
  save();
  render();
}

function edit(index) {
  const item = data[index];
  const newDesc = prompt("Description:", item.desc);
  const newAmount = parseFloat(prompt("Amount:", item.amount));
  const newType = prompt("Type (income/expense):", item.type);
  const newCategory = prompt("Category:", item.category);

  if (newDesc && !isNaN(newAmount) && (newType==="income"||newType==="expense") && newCategory) {
    data[index] = { desc: newDesc, amount: newAmount, type: newType, category: newCategory };
    save();
    render();
  }
}

// Chart.js
function renderChart(income, expense) {
  if (myChart) myChart.destroy();
  myChart = new Chart(chartCanvas, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#2ecc71', '#e74c3c']
      }]
    },
    options: {
      plugins: { legend: { position: 'bottom' } },
      responsive: true
    }
  });
}

addBtn.onclick = addTransaction;

// Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};

render();
