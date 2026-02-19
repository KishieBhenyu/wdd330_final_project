

const THEME_KEY = "sstheme";
const FONT_KEY = "ssfont";

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

function applyTheme(theme) {
  document.body.classList.remove("theme-light");
  if (theme === "light") {
    document.body.classList.add("theme-light");
  }
}

function setupThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  // Load stored theme or default to dark
  const storedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(storedTheme);
  toggle.checked = storedTheme === "dark"; // checked = dark

  toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "dark" : "light";
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  });
}


function applyFontSize(size) {
  // Remove large font class first
  document.body.classList.remove("font-large");

  // Add class only if "large" selected
  if (size === "large") {
    document.body.classList.add("font-large");
  }
}

function setupFontButtons() {
  const buttons = document.querySelectorAll(".btn-chip");
  if (!buttons.length) return;

  // Load stored font size or default to normal
  const storedSize = localStorage.getItem(FONT_KEY) || "normal";
  applyFontSize(storedSize);

  // Highlight the active button
  buttons.forEach((btn) => {
    if (btn.dataset.fontSize === storedSize) {
      btn.classList.add("btn-chip--active");
    }

    btn.addEventListener("click", () => {
      // Remove active from all buttons
      buttons.forEach((b) => b.classList.remove("btn-chip--active"));
      // Highlight clicked button
      btn.classList.add("btn-chip--active");

      // Apply font size and store
      const size = btn.dataset.fontSize;
      localStorage.setItem(FONT_KEY, size);
      applyFontSize(size);
    });
  });
}

// ---------------------------
// Init
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupHamburger();
  setupThemeToggle();
  setupFontButtons();
});
