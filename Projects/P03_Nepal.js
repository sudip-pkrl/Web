function showFact() {
  const facts = [
    "Nepal has a non-rectangular national flag.",
    "Mount Everest is the highest mountain in the world.",
    "Nepal has never been colonized.",
    "Lord Buddha was born in Lumbini, Nepal.",
    "Nepal has over 120 languages."
  ];

  document.getElementById("fact").innerText =
    facts[Math.floor(Math.random() * facts.length)];
}

function toggleMenu() {
  const nav = document.getElementById("nav-menu");
  nav.style.display = nav.style.display === "block" ? "none" : "block";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}
