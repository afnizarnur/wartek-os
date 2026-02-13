const PRESET_TIME = 420;
const CIRCUMFERENCE = 2 * Math.PI * 54;

let timeLeft = PRESET_TIME;
let totalTime = PRESET_TIME;
let isRunning = false;
let timerInterval = null;

const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const presetLabel = document.getElementById('presetLabel');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const meterFill = document.getElementById('meterFill');
const egg = document.querySelector('.egg');
const presetBtns = document.querySelectorAll('.preset-btn');

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  const time = formatTime(timeLeft);
  minutesEl.textContent = time.split(':')[0];
  secondsEl.textContent = time.split(':')[1];

  const progress = (totalTime - timeLeft) / totalTime;
  meterFill.style.width = `${progress * 100}%`;

  if (progress < 0.33) {
    egg.className = 'egg soft';
  } else if (progress < 0.66) {
    egg.className = 'egg medium';
  } else {
    egg.className = 'egg hard';
  }
}

function setPreset(time, label) {
  if (isRunning) return;
  
  totalTime = time;
  timeLeft = time;
  presetLabel.textContent = label;
  
  presetBtns.forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.time) === time);
  });
  
  updateDisplay();
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      playNotification();
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timeLeft = totalTime;
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function playNotification() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  for (let i = 0; i < 3; i++) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.3 + 0.2);
    
    oscillator.start(audioContext.currentTime + i * 0.3);
    oscillator.stop(audioContext.currentTime + i * 0.3 + 0.2);
  }
}

presetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    setPreset(parseInt(btn.dataset.time), btn.dataset.label);
  });
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();
