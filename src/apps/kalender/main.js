const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const monthYearEl = document.getElementById('monthYear');
const calendarDaysEl = document.getElementById('calendarDays');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const todayDateEl = document.getElementById('todayDate');

function renderCalendar(month, year) {
  monthYearEl.textContent = `${monthNames[month]} ${year}`;
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
  const todayDate = today.getDate();
  
  calendarDaysEl.innerHTML = '';
  
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'day empty';
    calendarDaysEl.appendChild(emptyDay);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'day';
    dayEl.textContent = day;
    
    if (isCurrentMonth && day === todayDate) {
      dayEl.classList.add('today');
    }
    
    dayEl.addEventListener('click', () => selectDate(day, month, year));
    calendarDaysEl.appendChild(dayEl);
  }
  
  const totalCells = firstDay + daysInMonth;
  const remainingCells = 7 - (totalCells % 7);
  if (remainingCells < 7) {
    for (let i = 0; i < remainingCells; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'day empty';
      calendarDaysEl.appendChild(emptyDay);
    }
  }
  
  updateFooter();
}

function selectDate(day, month, year) {
  document.querySelectorAll('.day').forEach(d => {
    d.classList.remove('selected');
  });
  const selectedDay = Array.from(document.querySelectorAll('.day')).find(
    d => parseInt(d.textContent) === day && !d.classList.contains('empty')
  );
  if (selectedDay) {
    selectedDay.classList.add('selected');
  }
}

function updateFooter() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  todayDateEl.textContent = today.toLocaleDateString('id-ID', options);
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
}

prevBtn.addEventListener('click', prevMonth);
nextBtn.addEventListener('click', nextMonth);

renderCalendar(currentMonth, currentYear);
