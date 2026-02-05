const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const CIRCUMFERENCE = 2 * Math.PI * 54;

let timeLeft = WORK_TIME;
let isRunning = false;
let isWorkSession = true;
let timerInterval = null;

const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const sessionTypeEl = document.getElementById('sessionType');
const progressFill = document.querySelector('.progress-fill');
const completedTodayEl = document.getElementById('completedToday');
const totalSessionsEl = document.getElementById('totalSessions');

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  const time = formatTime(timeLeft);
  minutesEl.textContent = time.split(':')[0];
  secondsEl.textContent = time.split(':')[1];

  const totalTime = isWorkSession ? WORK_TIME : BREAK_TIME;
  const progress = (totalTime - timeLeft) / totalTime;
  progressFill.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  sessionTypeEl.textContent = isWorkSession ? 'Focus Time' : 'Break Time';
  progressFill.classList.toggle('break', !isWorkSession);
}

function loadStats() {
  const todayKey = 'pomodoro.' + new Date().toDateString();
  let todayCount = parseInt(localStorage.getItem(todayKey)) || 0;
  let totalCount = parseInt(localStorage.getItem('wartek.pomodoro.total')) || 0;

  completedTodayEl.textContent = todayCount;
  totalSessionsEl.textContent = totalCount;

  return { todayKey, todayCount, totalCount };
}

function saveStats(todayKey, todayCount, totalCount) {
  localStorage.setItem(todayKey, todayCount);
  localStorage.setItem('wartek.pomodoro.total', totalCount);
  completedTodayEl.textContent = todayCount;
  totalSessionsEl.textContent = totalCount;
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
      playNotification();

      if (isWorkSession) {
        const stats = loadStats();
        saveStats(stats.todayKey, stats.todayCount + 1, stats.totalCount + 1);
      }

      isWorkSession = !isWorkSession;
      timeLeft = isWorkSession ? WORK_TIME : BREAK_TIME;
      isRunning = false;
      updateDisplay();
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
  isWorkSession = true;
  timeLeft = WORK_TIME;
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function playNotification() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 880;
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

function init() {
  loadStats();
  updateDisplay();

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
}

init();
