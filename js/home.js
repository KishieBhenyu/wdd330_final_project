// APIs 
const SCRIPTURE_API_URL = "https://bible-api.com/john%203:16";

// NEW working quote API
const QUOTE_API_URL = "https://api.quotable.io/random";

// Storage 
const STORAGE_KEYS = {
  STREAK: "sstreak",
  CHAPTERS: "schapters",
};

// Helpers 
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Progress UI 
function updateProgressUI() {
  const streak = loadJSON(STORAGE_KEYS.STREAK, 0);
  const chapters = loadJSON(STORAGE_KEYS.CHAPTERS, 0);

  const streakText = document.getElementById("streak-text");
  const chaptersText = document.getElementById("chapters-text");
  const fill = document.getElementById("progress-fill");
  const percentEl = document.getElementById("progress-percent");

  if (!streakText || !chaptersText || !fill || !percentEl) return;

  streakText.textContent = `Streak: ${streak} day${streak === 1 ? "" : "s"}`;
  chaptersText.textContent = `Chapters read: ${chapters}`;

  const percent = Math.min((chapters / 50) * 100, 100);
  fill.style.width = `${percent}%`;
  percentEl.textContent = `${percent.toFixed(0)}%`;
}

function incrementProgress() {
  const streak = loadJSON(STORAGE_KEYS.STREAK, 0) + 1;
  const chapters = loadJSON(STORAGE_KEYS.CHAPTERS, 0) + 1;

  saveJSON(STORAGE_KEYS.STREAK, streak);
  saveJSON(STORAGE_KEYS.CHAPTERS, chapters);
  updateProgressUI();
}

// Verse API 
async function loadVerse() {
  const verseTextEl = document.getElementById("verse-text");
  const verseRefEl = document.getElementById("verse-ref");

  if (!verseTextEl || !verseRefEl) return;

  try {
    const res = await fetch(SCRIPTURE_API_URL);
    if (!res.ok) throw new Error("Verse fetch failed");

    const data = await res.json();
    verseTextEl.textContent = `“${data.text.trim()}”`;
    verseRefEl.textContent = data.reference;
  } catch {
    verseTextEl.textContent = "“Unable to load verse.”";
    verseRefEl.textContent = "";
  }
}

//  Quote API 
async function loadQuote() {
  const quoteTextEl = document.getElementById("quote-text");
  const quoteAuthorEl = document.getElementById("quote-author");

  if (!quoteTextEl || !quoteAuthorEl) return;

  try {
    const res = await fetch(QUOTE_API_URL);
    if (!res.ok) throw new Error("Quote fetch failed");

    const data = await res.json();
    quoteTextEl.textContent = `“${data.content}”`;
    quoteAuthorEl.textContent = `– ${data.author || "Unknown"}`;
  } catch {
    quoteTextEl.textContent = "“Unable to load quote.”";
    quoteAuthorEl.textContent = "";
  }
}

// Hamburger Menu 
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

// Init 
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("btn-start-reading");
  const heroStartBtn = document.getElementById("hero-start-btn");

  if (startBtn) startBtn.addEventListener("click", incrementProgress);
  if (heroStartBtn) heroStartBtn.addEventListener("click", incrementProgress);

  updateProgressUI();
  loadVerse();
  loadQuote();
  setupHamburger();
});

startBtn.addEventListener("click", () => {
  incrementProgress();

  addHistoryEntry({
    ref: "John 3:16",
    note: "Completed daily reading",
  });
});