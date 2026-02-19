const HISTORY_KEY = "studyHistory";


function loadHistory() {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

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

function renderHistory() {
  const list = document.getElementById("history-list");
  if (!list) return;

  const history = loadHistory();
  list.innerHTML = "";

  if (!history.length) {
    const li = document.createElement("li");
    li.className = "timeline__empty";
    li.textContent =
      "No history yet. Complete a reading on the home or plan page to see it appear here.";
    list.appendChild(li);
    return;
  }


  history
    .slice()
    .reverse()
    .forEach((item) => {
      const li = document.createElement("li");
      li.className = "timeline-item";

      const dot = document.createElement("span");
      dot.className = "timeline-dot";

      const dateP = document.createElement("p");
      dateP.className = "timeline-date";
      dateP.textContent = item?.date || "Unknown date";

      const refP = document.createElement("p");
      refP.className = "timeline-ref";
      refP.textContent = item?.ref || "Reference";

      li.append(dot, dateP, refP);

      if (item?.note) {
        const noteP = document.createElement("p");
        noteP.className = "timeline-note";
        noteP.textContent = item.note;
        li.appendChild(noteP);
      }

      list.appendChild(li);
    });
}


function setupClearButton() {
  const btn = document.getElementById("clear-history-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (!confirm("Clear all study history?")) return;
    saveHistory([]);
    renderHistory();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupHamburger();
  setupClearButton();
  renderHistory();
});
