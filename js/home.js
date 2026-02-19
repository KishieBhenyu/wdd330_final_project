// APIs: two unique endpoints (scripture + quote)
const SCRIPTURE_API_URL = "https://bible-api.com/john%203:16";
const QUOTE_API_URL =
  "https://quote-garden.herokuapp.com/api/v3/quotes/random";

// Fallback data so the UI still works if APIs fail
const FALLBACK_VERSE = {
  text: "For God so loved the world, that he gave his only begotten Son...",
  reference: "John 3:16",
};

const FALLBACK_QUOTE = {
  text: "When ye are in the service of your fellow beings ye are only in the service of your God.",
  author: "King Benjamin",
};

// Storage keys
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

// Progress
function updateProgressUI() {
  const streak = loadJSON(STORAGE_KEYS.STREAK, 0);
  const chapters = loadJSON(STORAGE_KEYS.CHAPTERS, 0);

  const streakText = document.getElementById("streak-text");
  const chaptersText = document.getElementById("chapters-text");
  const fill = document.getElementById("progress-fill");
  const percentEl = document.getElementById("progress-percent");

  streakText.textContent = `Streak: ${streak} day${streak === 1 ? "" : "s"}`;
  chaptersText.textContent = `Chapters read: ${chapters}`;

  const percent = Math.min((chapters / 50) * 100, 100);
  fill.style.width = `${percent}%`;
  percentEl.textContent = `${percent.toFixed(0)}%`;
}

function incrementProgress() {
  let streak = loadJSON(STORAGE_KEYS.STREAK, 0);
  let chapters = loadJSON(STORAGE_KEYS.CHAPTERS, 0);

  streak += 1;
  chapters += 1;

  saveJSON(STORAGE_KEYS.STREAK, streak);
  saveJSON(STORAGE_KEYS.CHAPTERS, chapters);
  updateProgressUI();
}

// Verse API with fallback JSON
async function loadVerse() {
  const verseTextEl = document.getElementById("verse-text");
  const verseRefEl = document.getElementById("verse-ref");

  try {
    const res = await fetch(SCRIPTURE_API_URL);
    if (!res.ok) throw new Error("Bad status");
    const data = await res.json();
    verseTextEl.textContent = `“${(data.text || FALLBACK_VERSE.text).trim()}”`;
    verseRefEl.textContent = data.reference || FALLBACK_VERSE.reference;
  } catch (err) {
    verseTextEl.textContent = `“${FALLBACK_VERSE.text}”`;
    verseRefEl.textContent = FALLBACK_VERSE.reference;
  }
}

// Quote API with fallback JSON
async function loadQuote() {
  const quoteTextEl = document.getElementById("quote-text");
  const quoteAuthorEl = document.getElementById("quote-author");

  try {
    const res = await fetch(QUOTE_API_URL);
    if (!res.ok) throw new Error("Bad status");
    const data = await res.json();
    const q = data.data?.[0];
    quoteTextEl.textContent = `“${q?.quoteText || FALLBACK_QUOTE.text}”`;
    quoteAuthorEl.textContent = q?.quoteAuthor
      ? `– ${q.quoteAuthor}`
      : `– ${FALLBACK_QUOTE.author}`;
  } catch (err) {
    quoteTextEl.textContent = `“${FALLBACK_QUOTE.text}”`;
    quoteAuthorEl.textContent = `– ${FALLBACK_QUOTE.author}`;
  }
}

// Nav: mobile hamburger
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

  startBtn.addEventListener("click", incrementProgress);
  heroStartBtn.addEventListener("click", incrementProgress);

  updateProgressUI();
  loadVerse();
  loadQuote();
  setupHamburger();
});
