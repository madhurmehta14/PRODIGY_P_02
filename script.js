let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let running = false;
let laps = [];
let lastLapTime = 0;

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStop');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const lapsList = document.getElementById('laps');

// Load laps from localStorage on startup
window.onload = () => {
  const savedLaps = JSON.parse(localStorage.getItem('laps')) || [];
  laps = savedLaps;
  renderLaps();
};

function formatTime(ms) {
  const date = new Date(ms);
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
}

function updateDisplay() {
  display.textContent = formatTime(elapsedTime);
}

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }, 10);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function renderLaps() {
  lapsList.innerHTML = '';
  laps.forEach((lap, index) => {
    const li = document.createElement('li');
    li.textContent = `Lap ${index + 1}: ${lap.time} (+${lap.diff})`;
    lapsList.appendChild(li);
  });
}

startStopBtn.addEventListener('click', () => {
  if (!running) {
    startTimer();
    startStopBtn.textContent = 'Pause';
    running = true;
  } else {
    stopTimer();
    startStopBtn.textContent = 'Start';
    running = false;
  }
});

resetBtn.addEventListener('click', () => {
  stopTimer();
  elapsedTime = 0;
  lastLapTime = 0;
  laps = [];
  localStorage.removeItem('laps');
  updateDisplay();
  startStopBtn.textContent = 'Start';
  running = false;
  renderLaps();
});

lapBtn.addEventListener('click', () => {
  if (running) {
    const currentLapTime = elapsedTime;
    const diff = currentLapTime - lastLapTime;
    const lap = {
      time: formatTime(currentLapTime),
      diff: formatTime(diff),
    };
    laps.push(lap);
    lastLapTime = currentLapTime;
    localStorage.setItem('laps', JSON.stringify(laps));
    renderLaps();
  }
});
