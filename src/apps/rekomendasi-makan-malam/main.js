const foods = [
  { name: "Nasi Goreng", emoji: "🍳", category: "indonesian", description: "Nasi goreng dengan telur, ayam, dan kerupuk favorit!" },
  { name: "Sate Ayam", emoji: "🍡", category: "indonesian", description: "Sate ayam manis dengan lontong dan kacang gurih." },
  { name: "Rendang", emoji: "🥘", category: "indonesian", description: "Daging sapi empuk dengan santan dan rempah khas Minang." },
  { name: "Ayam Goreng", emoji: "🍗", category: "indonesian", description: "Ayam goreng renyah dengan sambal dan lalapan." },
  { name: "Mie Goreng", emoji: "🍝", category: "indonesian", description: "Mie kuning goreng dengan topping lengkap." },
  { name: "Gado-gado", emoji: "🥗", category: "indonesian", description: "Sayuran segar dengan sirsan kacang lezat." },
  { name: "Pizza", emoji: "🍕", category: "western", description: "Klasik italiano dengan keju meleleh dan topping favoritmu!" },
  { name: "Burger", emoji: "🍔", category: "western", description: "Daging juicy dengan keju, lettuce, dan saus special." },
  { name: "Pasta Carbonara", emoji: "🍝", category: "western", description: "Pasta creamy dengan bacon dan parmesan Italia." },
  { name: "Steak", emoji: "🥩", category: "western", description: "Daging sapi panggang dengan mashed potato dan sayuran." },
  { name: "Lasagna", emoji: "🍰", category: "western", description: "Lapisan pasta dengan daging cincang dan saus bechamel." },
  { name: "Tacos", emoji: "🌮", category: "western", description: "Tortilla dengan daging, salsa, dan keju Mexico." },
  { name: "Ramen", emoji: "🍜", category: "asian", description: "Mie Jepang dengan kuah kaya dan topping spesial." },
  { name: "Sushi", emoji: "🍣", category: "asian", description: "Nasi lembut dengan ikan segar dan nori." },
  { name: "Pad Thai", emoji: "🍜", category: "asian", description: "Mie Thailand gurih dengan udang dan kacang tanah." },
  { name: "Kimchi", emoji: "🥬", category: "asian", description: "Sayuran fermentasi Korea yang pedas dan menyegarkan." },
  { name: "Fried Rice", emoji: "🍳", category: "asian", description: "Nasi goreng China dengan egg fried rice style." },
  { name: "Pho", emoji: "🍲", category: "asian", description: "Sup mie Vietnam dengan daging dan herbs segar." },
];

let currentCategory = "all";

function getFilteredFoods() {
  if (currentCategory === "all") return foods;
  return foods.filter(food => food.category === currentCategory);
}

function getRandomFood() {
  const filtered = getFilteredFoods();
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function updateDisplay(food) {
  document.getElementById("foodEmoji").textContent = food.emoji;
  document.getElementById("foodName").textContent = food.name;
  document.getElementById("foodCategory").textContent = food.category.charAt(0).toUpperCase() + food.category.slice(1);
  document.getElementById("foodDescription").textContent = food.description;
  addToHistory(food);
}

function addToHistory(food) {
  let history = JSON.parse(localStorage.getItem("wartek.foodHistory") || "[]");
  const exists = history.some(h => h.name === food.name);
  if (!exists) {
    history.unshift(food);
    if (history.length > 5) history.pop();
    localStorage.setItem("wartek.foodHistory", JSON.stringify(history));
  }
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("wartek.foodHistory") || "[]");
  const list = document.getElementById("historyList");
  list.innerHTML = history.map(food => `<li>${food.emoji} ${food.name}</li>`).join("");
}

function init() {
  const randomBtn = document.getElementById("randomBtn");
  randomBtn.addEventListener("click", () => {
    const food = getRandomFood();
    updateDisplay(food);
  });

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
    });
  });

  const initialFood = getRandomFood();
  updateDisplay(initialFood);
  renderHistory();
}

init();
