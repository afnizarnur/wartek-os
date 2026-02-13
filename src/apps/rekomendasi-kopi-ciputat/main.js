const coffeeShops = [
  { name: "Kopi Janji Jiwa", emoji: "🧋", category: "milk", address: "Jl. Raya Ciputat No. 45", description: "Minuman signature dengan harga terjangkau, wajib coba latte-nya!" },
  { name: "Kopi Kenangan", emoji: "☕", category: "milk", address: "Jl. Cisalak No. 12", description: "Kopi kekinian dengan promo menarik setiap hari." },
  { name: "Chatime", emoji: "🧋", category: "milk", address: "Jl. Ir. Sukarno, Ciputat", description: "Milk tea originals dengan boba chewy favorit semua orang." },
  { name: "Starbucks Reserve", emoji: "☕", category: "coffee", address: "Jl. Transyogi, Ciputat", description: "Varietas kopi premium dengan suasana modern." },
  { name: "D'Cost Coffee", emoji: "☕", category: "coffee", address: "Jl. Perigi Baru No. 8", description: "Kopi lokal favorit mahasiswa dengan harga mahasiswa." },
  { name: "Kopi Oey", emoji: "🏠", category: "cozy", address: "Jl. Pal Merah Selatan", description: "Suasana cozy sempurna untuk nugas atau nongkrong." },
  { name: "Tuku Kopi", emoji: "☕", category: "coffee", address: "Jl. Cempaka Putih No. 33", description: "Kopi single origin Indonesia dengan brewing manual." },
  { name: "Warkop Kopi Viral", emoji: "🧋", category: "milk", address: "Jl. Benda Baru No. 5", description: "Trending drinks yang lagi viral di TikTok!" },
  { name: "Kopi Toko Djawa", emoji: "☕", category: "coffee", address: "Jl. Ciputat Raya", description: "Kopi traditional dengan sentuhan modern." },
  { name: "Teh Viral", emoji: "🧋", category: "milk", address: "Jl. Ciater Raya", description: "Minuman kekinian dengan topping丰富 (beragam)." },
  { name: "Goela Klapa", emoji: "🏠", category: "cozy", address: "Jl. Ciater Selatan", description: "Cozy cafe dengan coconut themed drinks." },
  { name: "Walden Coffee Lab", emoji: "☕", category: "coffee", address: "Jl. Pamulang Raya", description: "Specialty coffee dengan metod brew V60." },
  { name: "Kopi Seduh", emoji: "☕", category: "coffee", address: "Jl. Cempaka Putih", description: "Manual brew coffee dengan beans import." },
  { name: "Bubble Drink", emoji: "🧋", category: "milk", address: "Jl. Pintu Air", description: "Affordable milk tea dengan many flavors." },
  { name: "Kopi Campus", emoji: "☕", category: "cozy", address: "Jl. UIN Jakarta", description: "Tempat nugas favorit mahasiswa UIN dengan wifi cepat." },
];

let currentCategory = "all";

function getFilteredShops() {
  if (currentCategory === "all") return coffeeShops;
  return coffeeShops.filter(shop => shop.category === currentCategory);
}

function getRandomShop() {
  const filtered = getFilteredShops();
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function updateDisplay(shop) {
  document.getElementById("shopEmoji").textContent = shop.emoji;
  document.getElementById("shopName").textContent = shop.name;
  document.getElementById("shopCategory").textContent = shop.category.charAt(0).toUpperCase() + shop.category.slice(1);
  document.getElementById("shopAddress").textContent = shop.address;
  document.getElementById("shopDescription").textContent = shop.description;
  addToHistory(shop);
}

function addToHistory(shop) {
  let history = JSON.parse(localStorage.getItem("wartek.coffeeHistory") || "[]");
  const exists = history.some(h => h.name === shop.name);
  if (!exists) {
    history.unshift(shop);
    if (history.length > 5) history.pop();
    localStorage.setItem("wartek.coffeeHistory", JSON.stringify(history));
  }
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("wartek.coffeeHistory") || "[]");
  const list = document.getElementById("historyList");
  list.innerHTML = history.map(shop => `<li>${shop.emoji} ${shop.name}</li>`).join("");
}

function init() {
  const randomBtn = document.getElementById("randomBtn");
  randomBtn.addEventListener("click", () => {
    const shop = getRandomShop();
    updateDisplay(shop);
  });

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
    });
  });

  const initialShop = getRandomShop();
  updateDisplay(initialShop);
  renderHistory();
}

init();
