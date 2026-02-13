const STORAGE_KEY = 'wartek.savings-jar';

let savedAmount = 0;
let goalAmount = 100;
let hasCelebrated = false;

const savedAmountEl = document.getElementById('savedAmount');
const goalAmountEl = document.getElementById('goalAmount');
const percentageEl = document.getElementById('percentage');
const coinsEl = document.getElementById('coins');
const addAmountInput = document.getElementById('addAmount');
const addBtn = document.getElementById('addBtn');
const setGoalBtn = document.getElementById('setGoalBtn');
const goalInputContainer = document.getElementById('goalInputContainer');
const goalInput = document.getElementById('goalInput');
const saveGoalBtn = document.getElementById('saveGoalBtn');
const cancelGoalBtn = document.getElementById('cancelGoalBtn');
const resetBtn = document.getElementById('resetBtn');
const confettiContainer = document.getElementById('confettiContainer');

function loadData() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { saved: 0, goal: 100 };
  savedAmount = data.saved;
  goalAmount = data.goal;
  hasCelebrated = data.celebrated || false;
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    saved: savedAmount,
    goal: goalAmount,
    celebrated: hasCelebrated
  }));
}

function updateDisplay() {
  savedAmountEl.textContent = `$${savedAmount.toLocaleString()}`;
  goalAmountEl.textContent = `$${goalAmount.toLocaleString()}`;
  
  const percentage = Math.min(100, Math.round((savedAmount / goalAmount) * 100));
  percentageEl.textContent = `${percentage}%`;
  
  coinsEl.style.height = `${Math.min(100, percentage)}%`;
  
  if (percentage >= 100 && !hasCelebrated) {
    celebrate();
    hasCelebrated = true;
    saveData();
  }
}

function addSavings() {
  const amount = parseFloat(addAmountInput.value);
  if (amount > 0) {
    savedAmount += amount;
    addAmountInput.value = '';
    saveData();
    updateDisplay();
  }
}

function showGoalInput() {
  goalInput.value = goalAmount;
  goalInputContainer.classList.add('show');
}

function hideGoalInput() {
  goalInputContainer.classList.remove('show');
}

function saveGoal() {
  const newGoal = parseFloat(goalInput.value);
  if (newGoal > 0) {
    goalAmount = newGoal;
    hasCelebrated = false;
    saveData();
    updateDisplay();
    hideGoalInput();
  }
}

function reset() {
  if (confirm('Reset your savings jar? This will delete all progress.')) {
    savedAmount = 0;
    hasCelebrated = false;
    goalAmount = 100;
    saveData();
    updateDisplay();
  }
}

function celebrate() {
  createConfetti();
  showCelebrationText();
  playCelebrationSound();
}

function createConfetti() {
  const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff9ff3', '#feca57'];
  const shapes = ['circle', 'square', 'triangle'];
  
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 10 + 5;
      const left = Math.random() * 100;
      const tx = (Math.random() - 0.5) * 300;
      const ty = Math.random() * 500 + 200;
      const duration = Math.random() * 2 + 1;
      
      confetti.style.cssText = `
        left: ${left}%;
        top: 20%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        --tx: ${tx}px;
        --ty: ${ty}px;
        animation: confetti-burst ${duration}s ease-out forwards;
        ${shape === 'circle' ? 'border-radius: 50%' : ''}
        ${shape === 'triangle' ? 'width: 0; height: 0; background: transparent; border-left: ${size/2}px solid transparent; border-right: ${size/2}px solid transparent; border-bottom: ${size}px solid ' + color + '' : ''}
      `;
      
      confettiContainer.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), duration * 1000);
    }, i * 20);
  }
}

function showCelebrationText() {
  const text = document.createElement('div');
  text.className = 'celebration-text';
  text.textContent = '🎉 Goal Reached! 🎉';
  document.body.appendChild(text);
  setTimeout(() => text.remove(), 1500);
}

function playCelebrationSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const notes = [523.25, 659.25, 783.99, 1046.50];
  
  notes.forEach((freq, i) => {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }, i * 150);
  });
}

addBtn.addEventListener('click', addSavings);
addAmountInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addSavings();
});

setGoalBtn.addEventListener('click', showGoalInput);
saveGoalBtn.addEventListener('click', saveGoal);
cancelGoalBtn.addEventListener('click', hideGoalInput);
resetBtn.addEventListener('click', reset);

loadData();
updateDisplay();
