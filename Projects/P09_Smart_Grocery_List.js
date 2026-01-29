const itemInput = document.getElementById("itemInput");
const categorySelect = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const groceryList = document.getElementById("groceryList");
const themeToggle = document.getElementById("themeToggle");

let items = JSON.parse(localStorage.getItem("items")) || [];
let theme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (theme === "dark") document.body.classList.add("dark");

function save() {
  localStorage.setItem("items", JSON.stringify(items));
}

function render() {
  groceryList.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = item.bought ? "bought" : "";
    li.innerHTML = `<span>${item.name} [${item.category}]</span>`;

    const actions = document.createElement("div");
    actions.className = "actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = item.bought ? "Unbuy" : "Bought";
    toggleBtn.onclick = () => toggleBought(index);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editItem(index);

    const delBtn = document.createElement("button");
    delBtn.textContent = "X";
    delBtn.onclick = () => removeItem(index);

    actions.append(toggleBtn, editBtn, delBtn);
    li.appendChild(actions);
    groceryList.appendChild(li);
  });
}

function addItem() {
  const name = itemInput.value.trim();
  const category = categorySelect.value;
  if (!name) return;

  items.push({ name, category, bought: false });
  itemInput.value = "";
  save();
  render();
}

function toggleBought(index) {
  items[index].bought = !items[index].bought;
  save();
  render();
}

function editItem(index) {
  const newName = prompt("Edit item:", items[index].name);
  const newCategory = prompt("Edit category:", items[index].category);
  if (newName && newCategory) {
    items[index] = { name: newName, category: newCategory, bought: items[index].bought };
    save();
    render();
  }
}

function removeItem(index) {
  items.splice(index, 1);
  save();
  render();
}

addBtn.onclick = addItem;
itemInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addItem();
});

// Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};

render();
