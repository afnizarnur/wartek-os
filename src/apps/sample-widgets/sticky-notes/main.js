const STORAGE_KEY = 'wartek.sticky-notes.notes';

function loadNotes() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function createNoteElement(noteData) {
  const note = document.createElement('div');
  note.className = 'note';
  note.style.left = noteData.x + 'px';
  note.style.top = noteData.y + 'px';

  note.innerHTML = `
    <button class="delete">✕</button>
    <textarea placeholder="Type here...">${noteData.text || ''}</textarea>
  `;

  const textarea = note.querySelector('textarea');
  const deleteBtn = note.querySelector('.delete');

  textarea.addEventListener('input', () => {
    noteData.text = textarea.value;
    saveNotes(getAllNotes());
  });

  deleteBtn.addEventListener('click', () => {
    note.remove();
    saveNotes(getAllNotes());
  });

  makeDraggable(note);

  return note;
}

function makeDraggable(element) {
  let isDragging = false;
  let startX, startY, initialX, initialY;

  element.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = element.offsetLeft;
    initialY = element.offsetTop;
    element.style.zIndex = 100;
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    element.style.left = (initialX + dx) + 'px';
    element.style.top = (initialY + dy) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      element.style.zIndex = '';
      saveNotes(getAllNotes());
    }
  });
}

function getAllNotes() {
  const notes = [];
  document.querySelectorAll('.note').forEach(noteEl => {
    notes.push({
      text: noteEl.querySelector('textarea').value,
      x: noteEl.offsetLeft,
      y: noteEl.offsetTop
    });
  });
  return notes;
}

function init() {
  const container = document.getElementById('notesContainer');
  const addBtn = document.getElementById('addNote');

  const notes = loadNotes();
  notes.forEach(noteData => {
    container.appendChild(createNoteElement(noteData));
  });

  addBtn.addEventListener('click', () => {
    const noteData = {
      text: '',
      x: Math.random() * 100,
      y: Math.random() * 100
    };
    container.appendChild(createNoteElement(noteData));
    saveNotes(getAllNotes());
  });
}

init();
