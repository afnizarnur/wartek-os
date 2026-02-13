function loadSettings() {
  const stored = localStorage.getItem('wartek.dio-app.settings');
  return stored ? JSON.parse(stored) : {
    institutionName: 'Direktorat SD',
    userRole: 'Admin Institusi'
  };
}

function init() {
  const overlay = document.getElementById('dioOverlay');
  const closeBtn = document.getElementById('closeBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const confirmBtn = document.getElementById('confirmBtn');

  const settings = loadSettings();

  updateContent(settings);

  function close() {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    setTimeout(() => {
      window.parent.postMessage({ type: 'dio-app-close' }, '*');
    }, 200);
  }

  function updateContent(settings) {
    const descEl = document.querySelector('.dio-description');
    if (descEl) {
      descEl.innerHTML = `Saat ini Anda masuk sebagai <strong>${settings.userRole}</strong> dari institusi <strong>${settings.institutionName}</strong>. Jika perlu mengubah institusi, silakan ubah di Beranda.`;
    }
  }

  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', () => {
    console.log('Dio App: Ubah Institusi clicked');
    close();
  });
  confirmBtn.addEventListener('click', () => {
    console.log('Dio App: Selanjutnya clicked');
    close();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
    }
  });

  overlay.style.opacity = '1';
  overlay.style.pointerEvents = 'auto';
}

init();
