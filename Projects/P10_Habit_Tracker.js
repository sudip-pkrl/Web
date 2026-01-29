// Local Storage key
const STORAGE_KEY = "pastel.habits.v2";

// Today's date
const today = new Date();
const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

// Generate unique id
const uid = () => Math.random().toString(36).slice(2, 9);

// Load and Save habits
const load = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const save = (habits) => localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));

// Escape HTML to prevent XSS
const escapeHtml = s =>
  s.replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
  );

// Number of days in a given month
const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// Calculate streak for a habit (consecutive days ending today)
const calculateStreak = (days) => {
  let count = 0;
  let d = new Date(today);
  while (true) {
    const dateStr = d.toISOString().split("T")[0];
    if (!days[dateStr]) break;
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
};

// Render all habits
const render = () => {
  const list = document.getElementById("list");
  const empty = document.getElementById("empty");
  const habits = load();

  list.innerHTML = "";
  if (!habits.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  const year = today.getFullYear();
  const month = today.getMonth();
  const monthDays = daysInMonth(year, month);

  habits.forEach(h => {
    const el = document.createElement("div");
    el.className = "habit";

    // Calculate streak
    const streak = calculateStreak(h.days);

    // Count done days in this month
    let doneCount = 0;
    for (let i = 1; i <= monthDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      if (h.days[dateStr]) doneCount++;
    }

    el.innerHTML = `
      <div class="top">
        <h3>${escapeHtml(h.name)}</h3>
        <div class="icon" data-id="${h.id}" data-action="del">✕</div>
      </div>
      <div class="days" data-id="${h.id}"></div>
      <div class="progress-wrap">
        <div class="progress">
          <span style="width:${(doneCount/monthDays)*100}%"></span>
        </div>
        <div class="small">Streak: ${streak} | ${doneCount}/${monthDays}</div>
      </div>
    `;

    const daysWrap = el.querySelector(".days");

    // Add all days for current month
    for (let i = 1; i <= monthDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const d = document.createElement("div");
      d.className = "day" + (h.days[dateStr] ? " done" : "");
      if (dateStr === todayStr) d.classList.add("today");
      if (streak >= 3 && h.days[dateStr]) d.classList.add("streak"); // highlight long streaks
      d.textContent = i;
      d.dataset.date = dateStr;
      daysWrap.appendChild(d);
    }

    list.appendChild(el);
  });
};

// Add habit
document.getElementById("addForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("habitInput");
  const name = input.value.trim();
  if (!name) return;
  const habits = load();
  habits.unshift({ id: uid(), name, days: {} });
  save(habits);
  input.value = "";
  render();
});

// Toggle day done or delete habit
document.getElementById("list").addEventListener("click", e => {
  const dayEl = e.target.closest(".day");
  if (dayEl) {
    const date = dayEl.dataset.date;
    const id = e.target.closest(".days").dataset.id;
    const habits = load();
    const h = habits.find(x => x.id === id);
    if (!h) return;
    h.days[date] = !h.days[date];
    save(habits);
    render();
    return;
  }

  const del = e.target.dataset.action === "del";
  if (del) {
    const id = e.target.dataset.id;
    let habits = load().filter(h => h.id !== id);
    save(habits);
    render();
  }
});

// Initial render
render();
