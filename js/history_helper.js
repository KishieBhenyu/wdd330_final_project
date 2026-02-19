const HISTORY_KEY = "studyHistory";

// ---------- Utilities ----------
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

// Timestamp 
function getTimestamp() {
  const now = new Date();
  return now.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

//Add History Entry 
function addHistoryEntry({ ref, note = "" }) {
  if (!ref) return;

  const history = loadHistory();

  history.push({
    ref,
    note,
    date: getTimestamp(),
  });

  saveHistory(history);
}
