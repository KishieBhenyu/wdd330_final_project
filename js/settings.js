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

// THEME

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

// FONT SIZE

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
    if (btn.dataset.fontSize === storedSize) {
      btn.classList.add("btn-chip--active");
    }

    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("btn-chip--active"));
      btn.classList.add("btn-chip--active");

      const size = btn.dataset.fontSize;
      localStorage.setItem(FONT_KEY, size);
      applyFontSize(size);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupHamburger();
  setupThemeToggle();
  setupFontButtons();
});

<button
  class="settings-btn"
  aria-label="Settings"
  onclick="window.location.href='settings.html'"
>
  ⚙
</button>