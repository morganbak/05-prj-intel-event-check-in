// === CONFIG ===
const MAX_ATTENDEES = 50;

// === DOM Elements ===
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

// Team counters
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

// Create attendee list container
let attendeeListContainer = document.createElement("div");
attendeeListContainer.classList.add("attendee-list");
document.querySelector(".team-stats").appendChild(attendeeListContainer);

// === State (from localStorage if available) ===
let state = JSON.parse(localStorage.getItem("attendanceState")) || {
  total: 0,
  teams: { water: 0, zero: 0, power: 0 },
  attendees: [],
};

// === Functions ===

// Update UI
function updateUI() {
  attendeeCount.textContent = state.total;
  waterCount.textContent = state.teams.water;
  zeroCount.textContent = state.teams.zero;
  powerCount.textContent = state.teams.power;

  // Progress bar
  let percent = (state.total / MAX_ATTENDEES) * 100;
  progressBar.style.width = percent + "%";

  // Attendee list
  attendeeListContainer.innerHTML = "";
  state.attendees.forEach((a) => {
    const div = document.createElement("div");
    div.classList.add("attendee-item");
    div.textContent = `${a.name} — ${formatTeamName(a.team)}`;
    attendeeListContainer.appendChild(div);
  });
}

// Greeting
function showGreeting(name) {
  greeting.textContent = `Welcome, ${name}! 🎉 Thanks for checking in.`;
  greeting.style.display = "block";

  setTimeout(() => {
    greeting.style.display = "none";
  }, 3000);
}

// Format team names
function formatTeamName(team) {
  switch (team) {
    case "water": return "Team Water Wise";
    case "zero": return "Team Net Zero";
    case "power": return "Team Renewables";
    default: return team;
  }
}

// Save state
function saveState() {
  localStorage.setItem("attendanceState", JSON.stringify(state));
}

// Celebrate when full
function celebrate() {
  if (state.total >= MAX_ATTENDEES) {
    let winner = Object.entries(state.teams).sort((a, b) => b[1] - a[1])[0][0];
    let winningTeam = formatTeamName(winner);
    alert(`🎉 Goal reached! ${winningTeam} has the most attendees!`);
  }
}

// === Event Listeners ===
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let name = nameInput.value.trim();
  let team = teamSelect.value;
  if (!name || !team) return;

  // Update state
  state.total++;
  state.teams[team]++;
  state.attendees.push({ name, team });

  // Update UI + save
  updateUI();
  showGreeting(name);
  saveState();
  celebrate();

  // Reset form
  form.reset();
});

// Initialize
updateUI();
