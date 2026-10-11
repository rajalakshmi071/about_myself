const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navMenu.classList.toggle("is-open", !isOpen);
});

navMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navMenu.classList.remove("is-open");
  }
});

const defaultEntries = [
  "Learning C programming fundamentals",
  "Practising Python",
  "Exploring HTML, CSS, and JavaScript",
  "Learning GitHub and GitHub Codespaces",
  "Exploring cybersecurity",
  "Building beginner-friendly projects"
];
const storageKey = "rajalakshmi-learning-log-v1";
const list = document.querySelector("#learning-list");
const form = document.querySelector("#learning-form");
const input = document.querySelector("#learning-entry");
const submitButton = document.querySelector("#entry-submit");
const cancelButton = document.querySelector("#cancel-edit");
const entryLabel = document.querySelector("#entry-label");
let editingId = null;

function loadEntries() {
  try {
    const savedEntries = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(savedEntries) && savedEntries.every((entry) => entry && typeof entry.id === "string" && typeof entry.text === "string")) return savedEntries;
  } catch {
    // Fall back to the starter entries when browser storage is unavailable or invalid.
  }
  return defaultEntries.map((text, index) => ({ id: `starter-${index}`, text, date: "STARTER" }));
}

let entries = loadEntries();

function saveEntries() {
  try { localStorage.setItem(storageKey, JSON.stringify(entries)); }
  catch { /* Keep the current list usable when browser storage is disabled. */ }
}

function makeAction(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `text-action ${className}`;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function renderEntries() {
  list.replaceChildren();
  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "learning-entry";
    const bullet = document.createElement("span");
    bullet.className = "learning-bullet";
    bullet.setAttribute("aria-hidden", "true");
    bullet.textContent = ">";
    const text = document.createElement("p");
    text.className = "learning-text";
    text.textContent = entry.text;
    const date = document.createElement("span");
    date.className = "entry-date";
    date.textContent = entry.date;
    const actions = document.createElement("div");
    actions.className = "learning-actions";
    actions.append(makeAction("Edit", "edit", () => startEditing(entry)), makeAction("Remove", "delete", () => removeEntry(entry.id)));
    item.append(bullet, text, date, actions);
    list.append(item);
  });
}

function startEditing(entry) {
  editingId = entry.id;
  input.value = entry.text;
  entryLabel.textContent = "Edit learning entry";
  submitButton.textContent = "Update entry";
  cancelButton.hidden = false;
  input.focus();
}

function resetForm() {
  editingId = null;
  form.reset();
  entryLabel.textContent = "Add a learning entry";
  submitButton.textContent = "Add entry";
  cancelButton.hidden = true;
}

function removeEntry(id) {
  entries = entries.filter((entry) => entry.id !== id);
  if (editingId === id) resetForm();
  saveEntries();
  renderEntries();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  if (editingId) entries = entries.map((entry) => entry.id === editingId ? { ...entry, text } : entry);
  else entries.push({ id: crypto.randomUUID(), text, date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }).toUpperCase() });
  saveEntries();
  renderEntries();
  resetForm();
});

cancelButton.addEventListener("click", resetForm);
renderEntries();