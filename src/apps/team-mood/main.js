const STORAGE_KEY = 'wartek.team-mood.votes';
const MOODS = ['happy', 'okay', 'tired', 'stressed'];

function getVotes() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { happy: 0, okay: 0, tired: 0, stressed: 0 };
  }
  return JSON.parse(stored);
}

function saveVotes(votes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
}

function getMyVote() {
  return localStorage.getItem('wartek.team-mood.myVote') || null;
}

function setMyVote(mood) {
  localStorage.setItem('wartek.team-mood.myVote', mood);
}

function updateDisplay() {
  const votes = getVotes();

  MOODS.forEach(mood => {
    const countEl = document.getElementById(`count-${mood}`);
    if (countEl) {
      countEl.textContent = votes[mood];
    }
  });

  const myVote = getMyVote();
  const voteDisplay = document.getElementById('myVote');
  if (voteDisplay) {
    voteDisplay.textContent = myVote
      ? `Your vote: ${moodToEmoji(myVote)}`
      : 'Your vote: None';
  }

  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.classList.remove('voted');
    if (btn.dataset.mood === myVote) {
      btn.classList.add('voted');
    }
  });
}

function moodToEmoji(mood) {
  const map = { happy: '😄', okay: '😐', tired: '😴', stressed: '😰' };
  return map[mood] || '';
}

function init() {
  updateDisplay();

  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      const votes = getVotes();

      const oldVote = getMyVote();
      if (oldVote === mood) {
        votes[mood]--;
        setMyVote(null);
      } else {
        if (oldVote) {
          votes[oldVote]--;
        }
        votes[mood]++;
        setMyVote(mood);
      }

      saveVotes(votes);
      updateDisplay();
    });
  });
}

init();
