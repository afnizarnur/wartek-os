const MOCK_DATA = {
  players: {
    apac: [
      { id: 1, name: "SicK", tag: "APAC", rr: 987, winRate: 68.5, kd: 1.42, acs: 285, rank: "Radiant" },
      { id: 2, name: "Aspas", tag: "JPN", rr: 945, winRate: 65.2, kd: 1.38, acs: 272, rank: "Radiant" },
      { id: 3, name: "Chronicle", tag: "KR", rr: 912, winRate: 62.8, kd: 1.35, acs: 268, rank: "Radiant" },
      { id: 4, name: "TenZ", tag: "SEA", rr: 887, winRate: 61.5, kd: 1.31, acs: 258, rank: "Radiant" },
      { id: 5, name: "Yay", tag: "OCE", rr: 856, winRate: 59.8, kd: 1.28, acs: 252, rank: "Ascendant 3" },
      { id: 6, name: "Derke", tag: "SG", rr: 834, winRate: 58.2, kd: 1.25, acs: 248, rank: "Ascendant 3" },
      { id: 7, name: "F0rest", tag: "KR", rr: 812, winRate: 57.1, kd: 1.22, acs: 241, rank: "Ascendant 3" },
      { id: 8, name: "Xeta", tag: "PH", rr: 798, winRate: 55.9, kd: 1.19, acs: 235, rank: "Ascendant 2" },
      { id: 9, name: "Strax", tag: "TH", rr: 776, winRate: 54.5, kd: 1.16, acs: 228, rank: "Ascendant 2" },
      { id: 10, name: "Keznit", tag: "ID", rr: 754, winRate: 53.2, kd: 1.13, acs: 222, rank: "Ascendant 2" },
      { id: 999, name: "nizar", tag: "asoy", rr: 756, winRate: 58.2, kd: 1.28, acs: 248, rank: "Ascendant 3" }
    ],
    na: [
      { id: 11, name: "TenZ", tag: "NA1", rr: 978, winRate: 67.2, kd: 1.45, acs: 292, rank: "Radiant" },
      { id: 12, name: "Demon1", tag: "NA2", rr: 956, winRate: 65.8, kd: 1.41, acs: 280, rank: "Radiant" },
      { id: 13, name: "Crashies", tag: "NA3", rr: 934, winRate: 64.1, kd: 1.38, acs: 275, rank: "Radiant" },
      { id: 14, name: "SicK", tag: "NA4", rr: 901, winRate: 62.5, kd: 1.34, acs: 266, rank: "Radiant" },
      { id: 15, name: "Zekken", tag: "NA5", rr: 878, winRate: 60.8, kd: 1.30, acs: 259, rank: "Radiant" },
      { id: 16, name: "Derke", tag: "NA6", rr: 852, winRate: 59.2, kd: 1.27, acs: 251, rank: "Ascendant 3" },
      { id: 17, name: "Asuna", tag: "NA7", rr: 829, winRate: 57.8, kd: 1.24, acs: 245, rank: "Ascendant 3" },
      { id: 18, name: "Nivera", tag: "NA8", rr: 805, winRate: 56.5, kd: 1.21, acs: 238, rank: "Ascendant 3" },
      { id: 19, name: "MummAy", tag: "NA9", rr: 782, winRate: 55.1, kd: 1.18, acs: 231, rank: "Ascendant 2" },
      { id: 20, name: "Huke", tag: "NA10", rr: 758, winRate: 53.8, kd: 1.15, acs: 225, rank: "Ascendant 2" }
    ],
    eu: [
      { id: 21, name: "Derke", tag: "EU1", rr: 992, winRate: 69.5, kd: 1.48, acs: 298, rank: "Radiant" },
      { id: 22, name: "F0rest", tag: "EU2", rr: 967, winRate: 67.1, kd: 1.43, acs: 285, rank: "Radiant" },
      { id: 23, name: "Aspas", tag: "EU3", rr: 941, winRate: 65.4, kd: 1.39, acs: 276, rank: "Radiant" },
      { id: 24, name: "Chronicle", tag: "EU4", rr: 918, winRate: 63.8, kd: 1.36, acs: 270, rank: "Radiant" },
      { id: 25, name: "SicK", tag: "EU5", rr: 895, winRate: 62.1, kd: 1.32, acs: 262, rank: "Radiant" },
      { id: 26, name: "Nivera", tag: "EU6", rr: 867, winRate: 60.5, kd: 1.29, acs: 254, rank: "Ascendant 3" },
      { id: 27, name: "MummAy", tag: "EU7", rr: 844, winRate: 58.9, kd: 1.26, acs: 248, rank: "Ascendant 3" },
      { id: 28, name: "Huke", tag: "EU8", rr: 821, winRate: 57.2, kd: 1.23, acs: 241, rank: "Ascendant 3" },
      { id: 29, name: "ScreaM", tag: "EU9", rr: 798, winRate: 55.8, kd: 1.20, acs: 235, rank: "Ascendant 2" },
      { id: 30, name: "J1n", tag: "EU10", rr: 775, winRate: 54.2, kd: 1.17, acs: 228, rank: "Ascendant 2" }
    ],
    kr: [
      { id: 31, name: "F0rest", tag: "KR1", rr: 985, winRate: 68.8, kd: 1.46, acs: 295, rank: "Radiant" },
      { id: 32, name: "Chronicle", tag: "KR2", rr: 958, winRate: 66.5, kd: 1.42, acs: 282, rank: "Radiant" },
      { id: 33, name: "Xeta", tag: "KR3", rr: 931, winRate: 64.2, kd: 1.38, acs: 273, rank: "Radiant" },
      { id: 34, name: "Beaulo", tag: "KR4", rr: 904, winRate: 62.1, kd: 1.34, acs: 264, rank: "Radiant" },
      { id: 35, name: "Yay", tag: "KR5", rr: 877, winRate: 60.2, kd: 1.30, acs: 256, rank: "Radiant" },
      { id: 36, name: "Asuna", tag: "KR6", rr: 850, winRate: 58.5, kd: 1.27, acs: 249, rank: "Ascendant 3" },
      { id: 37, name: "Zekken", tag: "KR7", rr: 823, winRate: 56.8, kd: 1.24, acs: 242, rank: "Ascendant 3" },
      { id: 38, name: "Strax", tag: "KR8", rr: 796, winRate: 55.2, kd: 1.21, acs: 235, rank: "Ascendant 2" },
      { id: 39, name: "Keznit", tag: "KR9", rr: 769, winRate: 53.8, kd: 1.18, acs: 228, rank: "Ascendant 2" },
      { id: 40, name: "Rieks", tag: "KR10", rr: 742, winRate: 52.1, kd: 1.15, acs: 221, rank: "Ascendant 2" }
    ],
    latam: [
      { id: 41, name: "KSCER", tag: "LATAM1", rr: 945, winRate: 66.5, kd: 1.40, acs: 282, rank: "Radiant" },
      { id: 42, name: "Cned", tag: "LATAM2", rr: 918, winRate: 64.2, kd: 1.36, acs: 270, rank: "Radiant" },
      { id: 43, name: "mxd", tag: "LATAM3", rr: 891, winRate: 62.1, kd: 1.33, acs: 262, rank: "Radiant" },
      { id: 44, name: "Juli", tag: "LATAM4", rr: 864, winRate: 60.0, kd: 1.29, acs: 254, rank: "Radiant" },
      { id: 45, name: "Dedicado", tag: "LATAM5", rr: 837, winRate: 58.2, kd: 1.26, acs: 246, rank: "Ascendant 3" },
      { id: 46, name: "PnZ", tag: "LATAM6", rr: 810, winRate: 56.5, kd: 1.23, acs: 239, rank: "Ascendant 3" },
      { id: 47, name: "F4Q", tag: "LATAM7", rr: 783, winRate: 54.8, kd: 1.20, acs: 232, rank: "Ascendant 2" },
      { id: 48, name: "Sadd", tag: "LATAM8", rr: 756, winRate: 53.2, kd: 1.17, acs: 225, rank: "Ascendant 2" },
      { id: 49, name: "MNd", tag: "LATAM9", rr: 729, winRate: 51.5, kd: 1.14, acs: 218, rank: "Ascendant 2" },
      { id: 50, name: "Sert", tag: "LATAM10", rr: 702, winRate: 49.8, kd: 1.11, acs: 211, rank: "Ascendant 1" }
    ]
  },
  agents: ["Jett", "Raze", "Sova", "Omen", "Killjoy", "Viper", "Sage", "Phoenix", "Brimstone", "Cypher", "Reyna", "Breach", " Skye", "Yoru", "Astra", "KAY/O", "Chamber", "Neon", "Fade", "Harbor", "Iso", "Clove", "Vyse", "Tejo"],
  maps: ["Ascent", "Bind", "Haven", "Split", "Icebox", "Breeze", "Fracture", "Pearl", "Lotus"]
};

function generateMockPlayer(name, tag, region) {
  const baseRR = 600 + Math.floor(Math.random() * 300);
  const winRate = 40 + Math.random() * 30;
  const kd = 0.8 + Math.random() * 0.8;
  const acs = 150 + Math.random() * 100;
  
  const ranks = ["Radiant", "Ascendant 3", "Ascendant 2", "Ascendant 1", "Diamond 3", "Diamond 2"];
  const rank = ranks[Math.floor(Math.random() * ranks.length)];
  
  return {
    id: Math.floor(Math.random() * 10000),
    name,
    tag,
    region,
    rr: Math.floor(baseRR),
    winRate: Math.floor(winRate * 10) / 10,
    kd: Math.floor(kd * 100) / 100,
    acs: Math.floor(acs),
    rank,
    kast: 65 + Math.random() * 20,
    headshot: 20 + Math.random() * 25,
    matches: generateMatchHistory()
  };
}

function generateMatchHistory() {
  const maps = MOCK_DATA.maps;
  const agents = MOCK_DATA.agents;
  const matches = [];
  
  for (let i = 0; i < 10; i++) {
    const isWin = Math.random() > 0.45;
    const scoreWins = 10 + Math.floor(Math.random() * 5);
    const scoreLosses = 10 + Math.floor(Math.random() * 5);
    
    matches.push({
      id: i,
      result: isWin ? "win" : "loss",
      score: isWin ? `${scoreWins}-${scoreLosses}` : `${scoreLosses}-${scoreWins}`,
      kills: Math.floor(Math.random() * 25) + 5,
      deaths: Math.floor(Math.random() * 15) + 3,
      assists: Math.floor(Math.random() * 10),
      acs: 150 + Math.floor(Math.random() * 100),
      agent: agents[Math.floor(Math.random() * agents.length)],
      map: maps[Math.floor(Math.random() * maps.length)],
      date: new Date(Date.now() - i * 86400000 * Math.random() * 3).toLocaleDateString()
    });
  }
  
  return matches;
}

function generatePerformanceTrend(matches) {
  return matches.slice(0, 8).reverse().map((m, i) => ({
    match: `M${i + 1}`,
    acs: m.acs,
    kd: (m.kills / m.deaths).toFixed(2)
  }));
}

function calculateAgentDistribution(matches) {
  const agentCounts = {};
  matches.forEach(m => {
    agentCounts[m.agent] = (agentCounts[m.agent] || 0) + 1;
  });
  
  const total = matches.length;
  return Object.entries(agentCounts)
    .map(([agent, count]) => ({
      agent,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function formatKD(kills, deaths) {
  return deaths === 0 ? kills.toFixed(2) : (kills / deaths).toFixed(2);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

class ChartRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }
  
  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width - 40;
    this.canvas.height = 150;
  }
  
  drawPerformanceChart(data) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    
    ctx.clearRect(0, 0, width, height);
    
    const maxACS = Math.max(...data.map(d => d.acs)) + 20;
    const minACS = Math.min(...data.map(d => d.acs)) - 20;
    const range = maxACS - minACS;
    
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (height - padding.top - padding.bottom) * i / 4;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }
    
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(255, 70, 85, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 70, 85, 0)');
    
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    
    data.forEach((d, i) => {
      const x = padding.left + (width - padding.left - padding.right) * i / (data.length - 1);
      const y = padding.top + (height - padding.top - padding.bottom) * (1 - (d.acs - minACS) / range);
      
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = padding.left + (width - padding.left - padding.right) * i / (data.length - 1);
      const y = padding.top + (height - padding.top - padding.bottom) * (1 - (d.acs - minACS) / range);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    ctx.strokeStyle = '#ff4655';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#768079';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    
    data.forEach((d, i) => {
      const x = padding.left + (width - padding.left - padding.right) * i / (data.length - 1);
      ctx.fillText(d.match, x, height - 10);
    });
  }
  
  drawAgentChart(data) {
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const colors = ['#ff4655', '#ff6b7a', '#ff8a8f', '#ff9da5', '#ffb0bb'];
    const total = data.reduce((sum, d) => sum + d.percentage, 0);
    
    let startAngle = -Math.PI / 2;
    
    data.forEach((d, i) => {
      const sliceAngle = (d.percentage / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.arc(width / 2, height / 2, Math.min(width, height) / 2 - 10, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      
      startAngle += sliceAngle;
    });
    
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, Math.min(width, height) / 2 - 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#1f2731';
    ctx.fill();
    
    ctx.fillStyle = '#ece8e1';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.length.toString(), width / 2, height / 2);
  }
}

class App {
  constructor() {
    this.currentView = 'home';
    this.currentRegion = 'apac';
    this.currentSearchRegion = 'apac';
    this.searchedPlayer = null;
    this.performanceChart = null;
    this.agentChart = null;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.renderLeaderboard();
    this.updateNavigation();
  }
  
  bindEvents() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchView(e.target.dataset.view);
      });
    });
    
    document.querySelectorAll('.region-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchRegion(e.target.dataset.region);
      });
    });
    
    document.getElementById('search-btn').addEventListener('click', () => this.searchPlayer());
    
    document.getElementById('riot-id').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchPlayer();
    });
    
    document.getElementById('region-select').addEventListener('change', (e) => {
      this.currentSearchRegion = e.target.value;
    });
    
    window.addEventListener('resize', debounce(() => {
      if (this.performanceChart) this.performanceChart.resize();
      if (this.agentChart) this.agentChart.resize();
      if (this.searchedPlayer) {
        const matches = this.searchedPlayer.matches;
        this.performanceChart?.drawPerformanceChart(generatePerformanceTrend(matches));
        this.agentChart?.drawAgentChart(calculateAgentDistribution(matches));
      }
    }, 200));
  }
  
  switchView(view) {
    this.currentView = view;
    
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === view);
    });
    
    document.querySelectorAll('.view').forEach(v => {
      v.classList.toggle('active', v.id === `${view}-view`);
    });
    
    if (view === 'tracker') {
      setTimeout(() => {
        this.performanceChart = new ChartRenderer('performance-chart');
        this.agentChart = new ChartRenderer('agent-chart');
      }, 100);
    }
  }
  
  switchRegion(region) {
    this.currentRegion = region;
    
    document.querySelectorAll('.region-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.region === region);
    });
    
    document.getElementById('current-region').textContent = region.toUpperCase();
    this.renderLeaderboard();
  }
  
  renderLeaderboard() {
    const players = MOCK_DATA.players[this.currentRegion] || [];
    const tbody = document.getElementById('leaderboard-body');
    
    tbody.innerHTML = players.map((player, index) => `
      <tr class="top-${index + 1}">
        <td class="rank-cell">${index + 1}</td>
        <td>
          <div class="player-cell">
            <div class="avatar">${player.name[0]}</div>
            <span>${player.name}</span>
          </div>
        </td>
        <td>${player.rr}</td>
        <td>${player.winRate.toFixed(1)}%</td>
        <td>${player.kd.toFixed(2)}</td>
        <td>${player.acs}</td>
      </tr>
    `).join('');
  }
  
  searchPlayer() {
    const riotId = document.getElementById('riot-id').value.trim();
    const region = document.getElementById('region-select').value;
    
    if (!riotId || !riotId.includes('#')) {
      this.showError('Please enter a valid Riot ID (Name#Tag)');
      return;
    }
    
    this.showLoading();
    
    const [name, tag] = riotId.split('#');
    
    setTimeout(() => {
      if (name.toLowerCase() === 'nizar' && tag.toLowerCase() === 'asoy') {
        const playerData = {
          id: 999,
          name: "nizar",
          tag: "asoy",
          region: region,
          rr: 756,
          winRate: 58.2,
          kd: 1.28,
          acs: 248,
          rank: "Ascendant 3",
          kast: 72.5,
          headshot: 42.8,
          matches: [
            { id: 1, result: "win", score: "13-8", kills: 18, deaths: 11, assists: 4, acs: 268, agent: "Jett", map: "Ascent", date: "2/12/2026" },
            { id: 2, result: "win", score: "13-10", kills: 22, deaths: 14, assists: 3, acs: 285, agent: "Jett", map: "Haven", date: "2/11/2026" },
            { id: 3, result: "loss", score: "11-13", kills: 15, deaths: 16, assists: 5, acs: 198, agent: "Raze", map: "Split", date: "2/11/2026" },
            { id: 4, result: "win", score: "13-5", kills: 14, deaths: 8, assists: 2, acs: 242, agent: "Jett", map: "Bind", date: "2/10/2026" },
            { id: 5, result: "win", score: "13-9", kills: 20, deaths: 12, assists: 6, acs: 275, agent: "Jett", map: "Pearl", date: "2/10/2026" },
            { id: 6, result: "loss", score: "10-13", kills: 16, deaths: 17, assists: 2, acs: 215, agent: "Omen", map: "Lotus", date: "2/9/2026" },
            { id: 7, result: "win", score: "13-7", kills: 19, deaths: 10, assists: 4, acs: 262, agent: "Jett", map: "Ascent", date: "2/9/2026" },
            { id: 8, result: "win", score: "13-11", kills: 24, deaths: 15, assists: 3, acs: 298, agent: "Jett", map: "Haven", date: "2/8/2026" }
          ]
        };
        this.displayPlayer(playerData);
        return;
      }
      
      const existingPlayer = MOCK_DATA.players[region]?.find(
        p => p.name.toLowerCase() === name.toLowerCase()
      );
      
      if (existingPlayer || Math.random() > 0.3) {
        const playerData = existingPlayer || generateMockPlayer(name, tag || "0000", region);
        playerData.region = region;
        playerData.kast = 65 + Math.random() * 20;
        playerData.headshot = 20 + Math.random() * 25;
        playerData.matches = generateMatchHistory();
        
        this.displayPlayer(playerData);
      } else {
        this.showError('Player not found. Please check the Riot ID and region.');
      }
    }, 800);
  }
  
  displayPlayer(player) {
    this.hideLoading();
    this.hideError();
    this.searchedPlayer = player;
    
    document.getElementById('empty-state').classList.add('hidden');
    document.getElementById('player-dashboard').classList.remove('hidden');
    
    document.getElementById('player-name').textContent = player.name;
    document.getElementById('player-tag').textContent = `#${player.tag}`;
    document.getElementById('player-rank').textContent = player.rank;
    document.getElementById('player-initial').textContent = player.name[0].toUpperCase();
    
    document.getElementById('kpi-rr').textContent = player.rr;
    document.getElementById('kpi-winrate').textContent = `${player.winRate.toFixed(1)}%`;
    document.getElementById('kpi-kd').textContent = player.kd.toFixed(2);
    document.getElementById('kpi-acs').textContent = player.acs;
    document.getElementById('kpi-kast').textContent = `${player.kast.toFixed(1)}%`;
    document.getElementById('kpi-headshot').textContent = `${player.headshot.toFixed(1)}%`;
    
    this.renderMatchHistory(player.matches);
    
    setTimeout(() => {
      if (!this.performanceChart) {
        this.performanceChart = new ChartRenderer('performance-chart');
        this.agentChart = new ChartRenderer('agent-chart');
      }
      
      const trend = generatePerformanceTrend(player.matches);
      const agentDist = calculateAgentDistribution(player.matches);
      
      this.performanceChart.drawPerformanceChart(trend);
      this.agentChart.drawAgentChart(agentDist);
    }, 50);
  }
  
  renderMatchHistory(matches) {
    const container = document.getElementById('matches-list');
    
    container.innerHTML = matches.slice(0, 8).map(m => `
      <div class="match-item ${m.result}">
        <span class="match-result">${m.result === 'win' ? 'WIN' : 'LOSS'}</span>
        <span class="match-score">${m.score}</span>
        <div class="match-stats">
          <span>${m.kills}/${m.deaths}/${m.assists}</span>
          <span>${m.acs} ACS</span>
        </div>
        <span class="match-map">${m.map}</span>
      </div>
    `).join('');
  }
  
  showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
    document.getElementById('player-dashboard').classList.add('hidden');
    document.getElementById('empty-state').classList.add('hidden');
  }
  
  hideLoading() {
    document.getElementById('loading').classList.add('hidden');
  }
  
  showError(message) {
    this.hideLoading();
    const errorEl = document.getElementById('error');
    errorEl.querySelector('p').textContent = message;
    errorEl.classList.remove('hidden');
    document.getElementById('player-dashboard').classList.add('hidden');
    document.getElementById('empty-state').classList.add('hidden');
  }
  
  hideError() {
    document.getElementById('error').classList.add('hidden');
  }
  
  updateNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === this.currentView);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
