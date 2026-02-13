const makianData = [
  { jawa: "ꦲꦶꦪꦤ꧀", indo: "Ih!" },
  { jawa: "ꦲꦺꦴꦏ꧀ꦲꦺꦴꦏ꧀", indo: "Ogah!" },
  { jawa: "ꦭꦤ꧀ꦲꦤ꧀", indo: "Lelah!" },
  { jawa: "ꦧꦧꦃ", indo: "Bacot!" },
  { jawa: "ꦧꦱꦃ", indo: "Bangsat!" },
  { jawa: "ꦕꦗꦫꦤ꧀", indo: "Cejot!" },
  { jawa: "ꦠꦸꦮꦃ", indo: "Tuwek (tua)!" },
  { jawa: "ꦱꦼꦠꦤ꧀", indo: "Setan!" },
  { jawa: "ꦒꦺꦴꦝꦺꦴꦭ꧀", indo: "Gedol!" },
  { jawa: "ꦭꦶꦪꦤ꧀", indo: "Liyon!" },
  { jawa: "ꦧꦸꦭꦸꦏ꧀", indo: "Buluk!" },
  { jawa: "ꦤꦶꦪꦱ꧀ꦱꦃ", indo: "Nyi-ssah!" },
  { jawa: "ꦤꦁꦏꦾ", indo: "Nankye!" },
  { jawa: "ꦥꦝꦤ꧀", indo: "Padhang (terang)!" },
  { jawa: "ꦠꦶꦪꦤ꧀", indo: "Tiyon!" },
  { jawa: "ꦲꦺꦴꦩ꧀ꦧꦏ꧀", indo: "Ombak!" },
  { jawa: "ꦱꦶꦁꦒꦶꦠ꧀", indo: "Singit!" },
  { jawa: "ꦧꦶꦗꦃ", indo: "Bijah!" },
  { jawa: "ꦭꦸꦗꦫꦤ꧀", indo: "Lujane!" },
  { jawa: "ꦏꦺꦴꦤ꧀ꦏꦺꦴꦤ꧀", indo: "Kone-kone!" }
];

function renderList() {
  const listContainer = document.getElementById('makianList');
  listContainer.innerHTML = '';
  
  makianData.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <span class="list-jawa">${item.jawa}</span>
      <span class="list-indo">${item.indo}</span>
    `;
    div.addEventListener('click', () => showMakian(index));
    listContainer.appendChild(div);
  });
}

function showMakian(index) {
  const item = makianData[index] || makianData[Math.floor(Math.random() * makianData.length)];
  document.getElementById('jawaText').textContent = item.jawa;
  document.getElementById('indoText').textContent = item.indo;
}

function randomMakian() {
  const randomIndex = Math.floor(Math.random() * makianData.length);
  showMakian(randomIndex);
}

document.getElementById('randomBtn').addEventListener('click', randomMakian);

renderList();
randomMakian();
