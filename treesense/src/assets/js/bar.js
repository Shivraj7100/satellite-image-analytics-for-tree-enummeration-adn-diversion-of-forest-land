document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('mybarChart');
  if (!canvas || typeof Chart === 'undefined') return;
  const data = { 2013: 2.1, 2014: 1.5, 2015: 1.9, 2016: 2.8, 2017: 2.2, 2018: 2.6, 2019: 1.4, 2020: 3.2, 2021: 1.2, 2022: 4.7 };
  new Chart(canvas, {
    type: 'bar',
    data: { labels: Object.keys(data), datasets: [{ label: 'Rainfall departure', data: Object.values(data), backgroundColor: 'rgba(31,122,77,.18)', borderColor: '#1f7a4d', borderWidth: 2, borderRadius: 8 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Bhopal rainfall departure (2013–2022)', font: { size: 18 } } }, scales: { y: { beginAtZero: true, grid: { color: '#e6ece8' } }, x: { grid: { display: false } } } }
  });
});