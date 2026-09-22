const API_URL = 'https://dragonball-api.com/api/characters?limit=5';

const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const charactersEl = document.getElementById('characters');

function createCharacterCard(character) {
  const card = document.createElement('div');
  card.className = 'character-card';

  const maxKi = character.maxKi || 'Unknown';
  const race = character.race || 'Unknown';
  const affiliation = character.affiliation || 'Unknown';

  card.innerHTML = `
    <div class="card-image">
      <img src="${character.image}" alt="${character.name}" loading="lazy" />
    </div>
    <div class="card-info">
      <h2 class="card-name">${character.name}</h2>
      <div class="card-details">
        <span class="badge race">${race}</span>
        <span class="badge affiliation">${affiliation}</span>
      </div>
      <div class="card-ki">
        <span class="ki-label">Max Ki</span>
        <span class="ki-value">${maxKi}</span>
      </div>
    </div>
  `;

  return card;
}

async function fetchCharacters() {
  try {
    loadingEl.style.display = 'flex';
    errorEl.style.display = 'none';
    charactersEl.innerHTML = '';

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const characters = data.items || data;

    loadingEl.style.display = 'none';

    if (!characters || characters.length === 0) {
      errorEl.textContent = 'No characters found.';
      errorEl.style.display = 'block';
      return;
    }

    characters.forEach((character) => {
      const card = createCharacterCard(character);
      charactersEl.appendChild(card);
    });
  } catch (err) {
    loadingEl.style.display = 'none';
    errorEl.textContent = `Failed to load characters: ${err.message}`;
    errorEl.style.display = 'block';
  }
}

fetchCharacters();
