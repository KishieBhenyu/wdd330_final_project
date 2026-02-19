// ===========================
// app.js – Scripture Study Tracker
// Handles theme, font size, hamburger, progress, plan, history, verse & quote APIs
// ===========================

// ---------------------------
// Local Storage Keys
// ---------------------------
const THEME_KEY = "sstheme";
const FONT_KEY = "ssfont";
const HISTORY_KEY = "studyHistory";
const STORAGE_KEYS = {
  STREAK: "sstreak",
  CHAPTERS: "schapters",
};
const SCRIPTURE_API_URL = "https://bible-api.com/john%203:16";
const QUOTE_API_URL = "https://quote-garden.herokuapp.com/api/v3/quotes/random";

// ---------------------------
// Hamburger menu
// ---------------------------
function setupHamburger() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("hamburger--open");
    mobileMenu.classList.toggle("mobile-menu--open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });
}

// ---------------------------
// Theme toggle
// ---------------------------
function applyTheme(theme) {
  document.body.classList.remove("theme-light");
  if (theme === "light") {
    document.body.classList.add("theme-light");
  }
}

function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const storedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(storedTheme);
  toggle.checked = storedTheme === "dark";

  toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "dark" : "light";
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  });
}

// ---------------------------
// Font size toggle
// ---------------------------
function applyFontSize(size) {
  document.body.classList.remove("font-large");
  if (size === "large") {
    document.body.classList.add("font-large");
  }
}

function setupFontButtons() {
  const buttons = document.querySelectorAll(".btn-chip");
  if (!buttons.length) return;

  const storedSize = localStorage.getItem(FONT_KEY) || "normal";
  applyFontSize(storedSize);

  buttons.forEach((btn) => {
    if (btn.dataset.fontSize === storedSize) btn.classList.add("btn-chip--active");

    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("btn-chip--active"));
      btn.classList.add("btn-chip--active");

      const size = btn.dataset.fontSize;
      localStorage.setItem(FONT_KEY, size);
      applyFontSize(size);
    });
  });
}

// ---------------------------
// Study Progress (Home/Plan)
// ---------------------------
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } 
  catch { return fallback; }
}

function updateProgressUI() {
  const streak = loadJSON(STORAGE_KEYS.STREAK, 0);
  const chapters = loadJSON(STORAGE_KEYS.CHAPTERS, 0);

  const streakText = document.getElementById("streak-text");
  const chaptersText = document.getElementById("chapters-text");
  const fill = document.getElementById("progress-fill");
  const percentEl = document.getElementById("progress-percent");

  if (streakText) streakText.textContent = `Streak: ${streak} day${streak === 1 ? "" : "s"}`;
  if (chaptersText) chaptersText.textContent = `Chapters read: ${chapters}`;
  if (fill && percentEl) {
    const percent = Math.min((chapters / 50) * 100, 100);
    fill.style.width = `${percent}%`;
    percentEl.textContent = `${percent.toFixed(0)}%`;
  }
}

function incrementProgress() {
  let streak = loadJSON(STORAGE_KEYS.STREAK, 0);
  let chapters = loadJSON(STORAGE_KEYS.CHAPTERS, 0);
  streak += 1;
  chapters += 1;

  saveJSON(STORAGE_KEYS.STREAK, streak);
  saveJSON(STORAGE_KEYS.CHAPTERS, chapters);
  updateProgressUI();

  // Also add to history automatically
  addHistoryEntry(`Day ${chapters}`, new Date().toLocaleString(), "Completed a reading");
}

// ---------------------------
// History
// ---------------------------
function loadHistory() {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } 
  catch { return []; }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function addHistoryEntry(ref, date, note = "") {
  const history = loadHistory();
  history.push({ ref, date, note });
  saveHistory(history);
}

function renderHistory() {
  const list = document.getElementById("history-list");
  if (!list) return;

  const history = loadHistory();
  list.innerHTML = "";

  if (!history.length) {
    const li = document.createElement("li");
    li.className = "timeline__empty";
    li.textContent = "No history yet.";
    list.appendChild(li);
    return;
  }

  history.slice().reverse().forEach((item) => {
    const li = document.createElement("li");
    li.className = "timeline-item";

    const dot = document.createElement("span");
    dot.className = "timeline-dot";

    const dateP = document.createElement("p");
    dateP.className = "timeline-date";
    dateP.textContent = item.date || "Unknown date";

    const refP = document.createElement("p");
    refP.className = "timeline-ref";
    refP.textContent = item.ref || "Reference";

    const noteP = document.createElement("p");
    noteP.className = "timeline-note";
    noteP.textContent = item.note || "";

    li.appendChild(dot);
    li.appendChild(dateP);
    li.appendChild(refP);
    if (item.note) li.appendChild(noteP);

    list.appendChild(li);
  });
}

function setupClearHistoryButton() {
  const btn = document.getElementById("clear-history-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (!confirm("Clear all study history?")) return;
    saveHistory([]);
    renderHistory();
  });
}

// ---------------------------
// Verse API
// ---------------------------
async function loadVerse() {
  const verseTextEl = document.getElementById("verse-text");
  const verseRefEl = document.getElementById("verse-ref");
  if (!verseTextEl) return;

  try {
    const res = await fetch(SCRIPTURE_API_URL);
    const data = await res.json();
    verseTextEl.textContent = `“${(data.text || "").trim()}”`;
    if (verseRefEl) verseRefEl.textContent = data.reference || "";
  } catch {
    verseTextEl.textContent = "“Unable to load verse.”";
    if (verseRefEl) verseRefEl.textContent = "";
  }
}

// ---------------------------
// Quote API
// ---------------------------
async function loadQuote() {
  const quoteTextEl = document.getElementById("quote-text");
  const quoteAuthorEl = document.getElementById("quote-author");
  if (!quoteTextEl) return;

  try {
    const res = await fetch(QUOTE_API_URL);
    const data = await res.json();
    const q = data.data?.[0];
    quoteTextEl.textContent = `“${q?.quoteText || "Quote unavailable."}”`;
    if (quoteAuthorEl) quoteAuthorEl.textContent = q?.quoteAuthor ? `– ${q.quoteAuthor}` : "– Unknown";
  } catch {
    quoteTextEl.textContent = "“Unable to load quote.”";
    if (quoteAuthorEl) quoteAuthorEl.textContent = "";
  }
}

// ---------------------------
// Init
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupHamburger();
  setupThemeToggle();
  setupFontButtons();

  updateProgressUI();
  loadVerse();
  loadQuote();

  renderHistory();
  setupClearHistoryButton();

  // Optional: hook "Start Reading" buttons if present
  const startBtns = document.querySelectorAll("#btn-start-reading, #hero-start-btn");
  startBtns.forEach((btn) => btn.addEventListener("click", incrementProgress));
});
