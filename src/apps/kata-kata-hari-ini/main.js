const STORAGE_KEY = 'wartek.kata-kata-hari-ini';

const quotes = {
  motivasi: [
    { text: "Tidak ada yang tidak mungkin, kata-kata itu diciptakan oleh manusia.", author: "Anonim" },
    { text: "Keberhasilan adalah hasil dari persiapan, kerja keras, dan belajar dari kegagalan.", author: "Anonim" },
    { text: "Mimpi besar butuh kerja besar.", author: "Anonim" },
    { text: "Yang penting bukan berapa kali kita jatuh, tapi berapa kali kita bangkit.", author: "Anonim" },
    { text: "Kerja keras itu suara masa depan yang paling indah.", author: "Anonim" },
    { text: "Jalan yang sulit seringkali menuju ke tujuan yang indah.", author: "Anonim" },
    { text: "Jangan menunggu kesempatan, ciptakan kesempatan.", author: "Anonim" },
    { text: "Setiap hari adalah kesempatan baru untuk menjadi versi diri yang lebih baik.", author: "Anonim" },
    { text: "Keyakinanmu pada diri sendiri adalah rahasia terbesarmu.", author: "Anonim" },
    { text: "Langkah kecil hari ini adalah lompatan besar untuk masa depan.", author: "Anonim" },
    { text: "Terus bergerak maju, karena retrace bukanlah pilihan.", author: "Anonim" },
    { text: "Gagal sekali bukan berarti gagal selamanya.", author: "Anonim" },
    { text: "Bintang paling terang muncul di malam paling gelap.", author: "Anonim" },
    { text: "Keberhasilan dimulai dari keputusan yang kita buat.", author: "Anonim" },
    { text: "Jika bisa mimpi, bisa juga terwujud.", author: "Anonim" },
    { text: "Tantangan adalah apa yang membuat hidup lebih bermakna.", author: "Anonim" },
    { text: "Semangat adalah bahan bakar untuk mencapai impian.", author: "Anonim" },
    { text: "Jangan menyerah, karena ceritamu belum selesai.", author: "Anonim" },
    { text: "Hidup ini seperti bersepeda, harus terus bergerak agar tidak jatuh.", author: "Anonim" },
    { text: "Impian tidak akan mengkhianati kita, selama kita tidak mengkhianatinya.", author: "Anonim" }
  ],
  humor: [
    { text: "Math itu penting, tapi tidur lebih penting.", author: "Anonim" },
    { text: "Produktif? Saya bahkan sulit untuk jadi efektif.", author: "Anonim" },
    { text: "Deadline itu bukan karena kita malas, tapi karena kita diberi kesempatan untuk miraculous.", author: "Anonim" },
    { text: "Saya ini orangnya santai, jangan bikin saya stres.", author: "Anonim" },
    { text: "Pagi ini saya termutasi menjadi manusia super.", author: "Anonim" },
    { text: "Motivasi? Itu cuma kata, bro.", author: "Anonim" },
    { text: "Sebentar lagi ngopi dulu, baru berpikir.", author: "Anonim" },
    { text: "Otakku butuh coffee sebelum bisa mikir.", author: "Anonim" },
    { text: "Stress adalah kata lain dari saya care tapi males.", author: "Anonim" },
    { text: "Saya tidak malas, saya sedang menghemat energi.", author: "Anonim" },
    { text: "Bangun pagi itu mudah, yang sulit adalah keluar dari selimut.", author: "Anonim" },
    { text: "Malas bukan sifat, itu adalah talent.", author: "Anonim" },
    { text: "Hari ini saya diet. Started with nasi goreng.", author: "Anonim" },
    { text: "Saya tidak telat, saya datang di waktu saya sendiri.", author: "Anonim" },
    { text: "Dompetku tipis seperti hp si kaya.", author: "Anonim" },
    { text: "Gua lagi diet, minimal 3 kali sehari.", author: "Anonim" },
    { text: "Makan itu penting, gym bisa nanti.", author: "Anonim" },
    { text: "Aku ini orangnya simpel, cuma mau duit dan tidur.", author: "Anonim" },
    { text: "Sistem kuota saya: 20% kuota, 80% ngaret.", author: "Anonim" },
    { text: "Tidur itu murah, makan mie masih terjangkau.", author: "Anonim" }
  ],
  religi: [
    { text: "Sabarlah, karena setiap ujian adalah tangga menuju derajat yang lebih tinggi.", author: "Islamic Quote" },
    { text: "Allah tidak memberi beban yang lebih berat dari kemampuan kita.", author: "Quran" },
    { text: "Sholat adalah sumber ketenangan hati.", author: "Islamic Quote" },
    { text: "Sedekah tidak akan membuat kita miskin.", author: "Islamic Quote" },
    { text: "Berdoalah sebelum kamu putus asa.", author: "Islamic Quote" },
    { text: "Janji Allah pasti, percayalah.", author: "Islamic Quote" },
    { text: "Hati yang baik tempatnya Tuhan.", author: "Islamic Quote" },
    { text: "Bersyukur adalah kunci kebahagiaan.", author: "Islamic Quote" },
    { text: "Ampunan Tuhan luas seperti lautan.", author: "Islamic Quote" },
    { text: "Kebenaran adalah cahaya yang menerangi jalan.", author: "Islamic Quote" },
    { text: "Tetap semangat, Tuhan mengerti segalanya.", author: "Islamic Quote" },
    { text: "Kebaikan selalu kembali kepada pelakunya.", author: "Islamic Quote" },
    { text: "Tuhan pertobatkan hati yang Dia kehendaki.", author: "Islamic Quote" },
    { text: "Lakukan yang terbaik, serahkan hasilnya kepada Tuhan.", author: "Islamic Quote" },
    { text: "Menanti adalah bagian dari iman.", author: "Islamic Quote" },
    { text: "Kasih saying Tuhan tidak terbatas.", author: "Islamic Quote" },
    { text: "Tawakal adalah senjata orang beriman.", author: "Islamic Quote" },
    { text: "Taubat adalah awal dari pertobatan.", author: "Islamic Quote" },
    { text: "Janji Tuhan tidak akan pernah meleset.", author: "Islamic Quote" },
    { text: "Rahasia orang sholeh adalah istighfar.", author: "Islamic Quote" }
  ]
};

let currentCategory = 'all';
let currentMode = 'daily';

function getDailyQuote() {
  const today = new Date().toDateString();
  const storage = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  
  if (storage.date === today && storage.quote) {
    return storage.quote;
  }
  
  const allQuotes = getAllQuotes();
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  const quote = allQuotes[randomIndex];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, quote }));
  return quote;
}

function getRandomQuote() {
  const allQuotes = getAllQuotes();
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  return allQuotes[randomIndex];
}

function getAllQuotes() {
  if (currentCategory === 'all') {
    return [
      ...quotes.motivasi.slice(0, 10),
      ...quotes.humor.slice(0, 6),
      ...quotes.religi.slice(0, 4)
    ];
  }
  return quotes[currentCategory] || [];
}

function displayQuote(quote) {
  document.getElementById('quoteText').textContent = quote.text;
  document.getElementById('quoteAuthor').textContent = '- ' + quote.author;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function copyQuote() {
  const quoteText = document.getElementById('quoteText').textContent;
  const quoteAuthor = document.getElementById('quoteAuthor').textContent;
  const fullText = `${quoteText} ${quoteAuthor}`;
  
  navigator.clipboard.writeText(fullText).then(() => {
    showToast('Quote disalin!');
  }).catch(() => {
    showToast('Gagal menyalin');
  });
}

function init() {
  const quote = currentMode === 'daily' ? getDailyQuote() : getRandomQuote();
  displayQuote(quote);
  
  document.getElementById('refreshBtn').addEventListener('click', () => {
    const quote = currentMode === 'daily' ? getDailyQuote() : getRandomQuote();
    displayQuote(quote);
  });
  
  document.getElementById('copyBtn').addEventListener('click', copyQuote);
  
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      
      const quote = currentMode === 'daily' ? getDailyQuote() : getRandomQuote();
      displayQuote(quote);
    });
  });
  
  document.getElementById('dailyMode').addEventListener('click', (e) => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentMode = 'daily';
    const quote = getDailyQuote();
    displayQuote(quote);
  });
  
  document.getElementById('randomMode').addEventListener('click', (e) => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentMode = 'random';
    const quote = getRandomQuote();
    displayQuote(quote);
  });
}

init();
