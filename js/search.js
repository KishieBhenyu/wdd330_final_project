
const SAMPLE_VERSES = [
  {
    ref: "Alma 32:21",
    text: "And now as I said concerning faith—faith is not to have a perfect knowledge...",
    source: "Book of Mormon",
    group: "bom",
  },
  {
    ref: "Mosiah 2:17",
    text: "When ye are in the service of your fellow beings ye are only in the service of your God.",
    source: "Book of Mormon",
    group: "bom",
  },
  {
    ref: "John 3:16",
    text: "For God so loved the world, that he gave his only begotten Son...",
    source: "Bible",
    group: "bible",
  },
  {
    ref: "James 1:5",
    text: "If any of you lack wisdom, let him ask of God...",
    source: "Bible",
    group: "bible",
  },
];

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

function setupFilters() {
  const chips = document.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");
      performSearch(); // re-run search with new filter
    });
  });
}

function getActiveFilter() {
  const active = document.querySelector(".chip.chip--active");
  return active ? active.dataset.filter : "all";
}

function performSearch() {
  const input = document.getElementById("search-input");
  const list = document.getElementById("results-list");
  const query = input.value.trim().toLowerCase();
  const filter = getActiveFilter();

  list.innerHTML = "";

  if (!query) {
    const li = document.createElement("li");
    li.className = "results-list__empty";
    li.innerHTML =
      'Start by typing a word like <strong>faith</strong>, <strong>service</strong>, or a reference such as <strong>John 3:16</strong>.';
    list.appendChild(li);
    return;
  }

  const matches = SAMPLE_VERSES.filter((v) => {
    if (filter !== "all" && v.group !== filter) return false;
    return (
      v.ref.toLowerCase().includes(query) ||
      v.text.toLowerCase().includes(query)
    );
  });

  if (!matches.length) {
    const li = document.createElement("li");
    li.className = "results-list__empty";
    li.textContent = "No results found in the sample data.";
    list.appendChild(li);
    return;
  }

  matches.forEach((v) => {
    const li = document.createElement("li");
    li.className = "result-item";

    const refSpan = document.createElement("span");
    refSpan.className = "result-ref";
    refSpan.textContent = v.ref;

    const textP = document.createElement("p");
    textP.className = "result-text";
    textP.textContent = v.text;

    const srcP = document.createElement("p");
    srcP.className = "result-source";
    srcP.textContent = v.source;

    li.appendChild(refSpan);
    li.appendChild(textP);
    li.appendChild(srcP);
    list.appendChild(li);
  });
}

function setupSearch() {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-btn");

  button.addEventListener("click", performSearch);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") performSearch();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupHamburger();
  setupFilters();
  setupSearch();
});


