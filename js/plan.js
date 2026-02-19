const STORAGE_KEY_PLAN = "scripturePlan";

//  Storage 
function savePlan(plan) {
  localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(plan));
}

function loadPlan() {
  const raw = localStorage.getItem(STORAGE_KEY_PLAN);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

//Hamburger 
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

// Plan Summary 
function renderPlanSummary(plan) {
  const nameEl = document.getElementById("plan-name-display");
  const summaryEl = document.getElementById("plan-summary");
  const fillEl = document.getElementById("plan-progress-fill");
  const pctEl = document.getElementById("plan-progress-percent");

  if (!nameEl || !summaryEl || !fillEl || !pctEl) return;

  if (!plan || !Array.isArray(plan.readings)) {
    nameEl.textContent = "No plan created yet";
    summaryEl.textContent = "Create a plan below to get a daily schedule.";
    fillEl.style.width = "0%";
    pctEl.textContent = "0%";
    return;
  }

  nameEl.textContent = plan.name;
  summaryEl.textContent = `${plan.totalDays} days • ${plan.versesPerDay} verses per day`;

  const completedDays = plan.readings.filter(r => r.completed).length;
  const pct = Math.min((completedDays / plan.totalDays) * 100, 100);

  fillEl.style.width = `${pct}%`;
  pctEl.textContent = `${pct.toFixed(0)}%`;
}

// Readings List 
function renderReadings(plan) {
  const list = document.getElementById("readings-list");
  if (!list) return;

  list.innerHTML = "";

  if (!plan || !Array.isArray(plan.readings) || plan.readings.length === 0) {
    const li = document.createElement("li");
    li.className = "readings-list__empty";
    li.textContent =
      "No readings yet. Create a plan above to generate a schedule.";
    list.appendChild(li);
    return;
  }

  plan.readings.forEach((reading, index) => {
    const li = document.createElement("li");
    li.className = "reading-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(reading.completed);

    checkbox.addEventListener("change", () => {
      reading.completed = checkbox.checked;
      savePlan(plan);
      renderPlanSummary(plan);
    });

    const main = document.createElement("div");
    main.className = "reading-main";

    const title = document.createElement("strong");
    title.textContent = `Day ${index + 1}`;

    const desc = document.createElement("span");
    desc.textContent = reading.description;

    main.append(title, desc);
    li.append(checkbox, main);
    list.appendChild(li);
  });
}

//  Plan Creation 
function generateReadings(totalDays, versesPerDay) {
  const readings = [];
  for (let i = 1; i <= totalDays; i++) {
    readings.push({
      description: `${versesPerDay} verses (placeholder for actual references)`,
      completed: false,
    });
  }
  return readings;
}

function setupForm() {
  const form = document.getElementById("plan-form");
  const nameInput = document.getElementById("plan-name-input");
  const daysInput = document.getElementById("plan-days-input");
  const versesInput = document.getElementById("plan-verses-input");

  if (!form || !nameInput || !daysInput || !versesInput) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const totalDays = Number(daysInput.value);
    const versesPerDay = Number(versesInput.value);

    if (!name || totalDays < 1 || versesPerDay < 1) return;

    const plan = {
      name,
      totalDays,
      versesPerDay,
      readings: generateReadings(totalDays, versesPerDay),
    };

    savePlan(plan);
    renderPlanSummary(plan);
    renderReadings(plan);
  });
}

//  Init 
document.addEventListener("DOMContentLoaded", () => {
  setupHamburger();
  setupForm();

  const existing = loadPlan();
  renderPlanSummary(existing);
  renderReadings(existing);
});

checkbox.addEventListener("change", () => {
  reading.completed = checkbox.checked;
  savePlan(plan);
  renderPlanSummary(plan);

  if (checkbox.checked) {
    addHistoryEntry({
      ref: `Day ${index + 1}`,
      note: reading.description,
    });
  }
});
