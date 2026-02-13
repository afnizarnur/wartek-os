const quotes = [
  { text: "Hidup bukan tentang menunggu badai berlalu, tapi belajar menari di tengah hujan.", author: "Vivian Greene" },
  { text: "Kesalahan terbesar bukanlah gagal, tetapi never mencoba.", author: "Anonim" },
  { text: "Mulai sekarang, jangan tunggu sempurna. Mulai saja, perfection akan mengikuti.", author: "Anonim" },
  { text: "Kamu tidak harus lebih baik dari orang lain, kamu hanya harus lebih baik dari dirimu kemarin.", author: "Anonim" },
  { text: "Sukses adalah jumlah dari usaha kecil yang diulang hari demi hari.", author: "Robert Collier" },
  { text: "Jangan takut gagal. Takutlah tidak mencoba.", author: "Anonim" },
  { text: "Hidup itu seperti bersepeda. Untuk保持平衡, kamu harus terus bergerak.", author: "Albert Einstein" },
  { text: "Orang bijak tidak pernah menyesali masa lalu, mereka belajar darinya.", author: "Anonim" },
  { text: "Jika kamu ingin sesuatu yang belum pernah kamu miliki, kamu harus melakukan sesuatu yang belum pernah kamu lakukan.", author: "Anonim" },
  { text: "Tidak ada jalan pintas ke tempat yang worth it.", author: "Anonim" },
  { text: "Kerja keras mengalahkan bakat ketika talento bekerja keras.", author: "Anonim" },
  { text: "Jadilah perubahan yang kamu ingin lihat di dunia.", author: "Mahatma Gandhi" },
  { text: "Hari ini adalah kesempatan baru untuk memulai lagi.", author: "Anonim" },
  { text: "Keyakinan adalah kekuatan yang membuat kita percaya pada kemungkinan.", author: "Anonim" },
  { text: "Setiap langkah kecil membawa kita lebih dekat ke tujuan.", author: "Anonim" },
  { text: "Jangan mimpi terlalu kecil. Hidup sekali, hidupi dengan berani.", author: "Anonim" },
  { text: "Kesabaran adalah kekuatan, bukan kelemahan.", author: "Anonim" },
  { text: "Apa yang kamu pikirkan, itu yang kamu menjadi.", author: "Anonim" },
  { text: "Bersyukurlah untuk hari ini, karena yesterday adalah kenangan dan tomorrow adalah mimpi.", author: "Anonim" },
  { text: "Terus bergerak maju, tidak perlu sempurna.", author: "Anonim" }
];

const STORAGE_KEY = 'wartek.kata-kata-hari-ini.quote';
const DATE_KEY = 'wartek.kata-kata-hari-ini.date';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getStoredQuote() {
  const storedDate = localStorage.getItem(DATE_KEY);
  const today = getToday();
  
  if (storedDate === today) {
    const storedQuote = localStorage.getItem(STORAGE_KEY);
    if (storedQuote) {
      return JSON.parse(storedQuote);
    }
  }
  return null;
}

function saveQuote(quote) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
  localStorage.setItem(DATE_KEY, getToday());
}

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

function displayQuote(quote) {
  document.getElementById('quoteText').textContent = `"${quote.text}"`;
  document.getElementById('quoteAuthor').textContent = `— ${quote.author}`;
}

function init() {
  let quote = getStoredQuote();
  
  if (!quote) {
    quote = getRandomQuote();
    saveQuote(quote);
  }
  
  displayQuote(quote);
  
  document.getElementById('refreshBtn').addEventListener('click', () => {
    quote = getRandomQuote();
    saveQuote(quote);
    displayQuote(quote);
  });
}

document.addEventListener('DOMContentLoaded', init);
