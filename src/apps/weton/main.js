// Pasaran cycle (5-day Javanese market cycle)
// Reference: 1 January 1970 (Kamis) = Legi
var PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

// Indonesian day names (Sunday = index 0 from getDay())
var HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// 35 weton meanings (7 days x 5 pasaran)
var WETON_MEANINGS = {
  'Minggu Legi': 'Berjiwa pemimpin, murah hati, dan senang menolong orang lain.',
  'Minggu Pahing': 'Teguh pendirian, pekerja keras, namun perlu belajar lebih sabar.',
  'Minggu Pon': 'Kreatif dan penuh ide, namun kadang sulit mengambil keputusan.',
  'Minggu Wage': 'Tenang dan bijaksana, suka kedamaian dan keharmonisan.',
  'Minggu Kliwon': 'Memiliki intuisi kuat dan daya tarik yang memikat.',
  'Senin Legi': 'Ramah dan mudah bergaul, disukai banyak orang.',
  'Senin Pahing': 'Ambisius dan tekun, selalu mengejar kesempurnaan.',
  'Senin Pon': 'Setia dan dapat dipercaya, menjadi teman yang baik.',
  'Senin Wage': 'Cerdas dan berwawasan luas, suka belajar hal baru.',
  'Senin Kliwon': 'Peka terhadap perasaan orang lain, penuh empati.',
  'Selasa Legi': 'Berani dan tegas, tidak takut menghadapi tantangan.',
  'Selasa Pahing': 'Mandiri dan percaya diri, mampu mengatasi masalah sendiri.',
  'Selasa Pon': 'Energik dan antusias, membawa semangat ke sekitarnya.',
  'Selasa Wage': 'Sabar dan teliti, cocok untuk pekerjaan yang membutuhkan ketelitian.',
  'Selasa Kliwon': 'Karismatik dan berpengaruh, sering menjadi panutan.',
  'Rabu Legi': 'Pandai berkomunikasi dan menyampaikan gagasan.',
  'Rabu Pahing': 'Disiplin dan terorganisir, suka keteraturan.',
  'Rabu Pon': 'Fleksibel dan adaptif, mudah menyesuaikan diri.',
  'Rabu Wage': 'Rendah hati dan sederhana, tidak suka pamer.',
  'Rabu Kliwon': 'Visioner dan penuh imajinasi, melihat peluang di mana-mana.',
  'Kamis Legi': 'Dermawan dan suka berbagi, rezeki selalu mengalir.',
  'Kamis Pahing': 'Bertanggung jawab dan dapat diandalkan dalam segala situasi.',
  'Kamis Pon': 'Optimis dan bersemangat, selalu melihat sisi positif.',
  'Kamis Wage': 'Analitis dan logis, mampu berpikir jernih di saat sulit.',
  'Kamis Kliwon': 'Punya daya tarik alami dan sering mendapat keberuntungan.',
  'Jumat Legi': 'Penuh kasih sayang dan perhatian terhadap sesama.',
  'Jumat Pahing': 'Gigih dan pantang menyerah, selalu berusaha maksimal.',
  'Jumat Pon': 'Diplomatis dan bijak dalam menyelesaikan konflik.',
  'Jumat Wage': 'Sebaiknya hindari keputusan tergesa-gesa tanpa perencanaan matang.',
  'Jumat Kliwon': 'Spiritual dan reflektif, memiliki kebijaksanaan mendalam.',
  'Sabtu Legi': 'Tekun dan ulet, tidak mudah menyerah meski menghadapi rintangan.',
  'Sabtu Pahing': 'Hemat dan cermat, pandai mengelola sumber daya.',
  'Sabtu Pon': 'Loyal dan setia kawan, selalu ada untuk orang terdekat.',
  'Sabtu Wage': 'Pemikir mendalam, suka merenung dan mencari makna.',
  'Sabtu Kliwon': 'Misterius dan menarik, memiliki aura yang kuat.'
};

function getPasaran(date) {
  var target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  var epoch = new Date(1970, 0, 1);
  var diffMs = target.getTime() - epoch.getTime();
  var diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return PASARAN[((diffDays % 5) + 5) % 5];
}

function getWeton(date) {
  var hari = HARI[date.getDay()];
  var pasaran = getPasaran(date);
  var key = hari + ' ' + pasaran;
  return {
    hari: hari,
    pasaran: pasaran,
    tanggal: date.getDate(),
    meaning: WETON_MEANINGS[key] || 'Makna weton tidak ditemukan.'
  };
}

function updateDisplay() {
  var today = new Date();
  var weton = getWeton(today);

  document.getElementById('wetonDay').textContent = weton.hari;
  document.getElementById('wetonDate').textContent = weton.tanggal;
  document.getElementById('wetonPasaran').textContent = weton.pasaran;
  document.getElementById('wetonDescription').textContent = weton.meaning;
}

function scheduleMidnightUpdate() {
  var now = new Date();
  var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  var msUntilMidnight = tomorrow.getTime() - now.getTime();

  setTimeout(function () {
    updateDisplay();
    scheduleMidnightUpdate();
  }, msUntilMidnight);
}

function init() {
  updateDisplay();
  scheduleMidnightUpdate();
}

init();
