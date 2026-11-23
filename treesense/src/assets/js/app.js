console.log("Script is running!");

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('location-form');
  if (!form) return;

  const input = document.getElementById('location');
  const weather = document.getElementById('weather');
  const status = document.getElementById('weather-status');
  let chart;

  form.addEventListener('submit', async event => {
    event.preventEvent?.();
    event.preventDefault();
    const location = input.value.trim();
    if (!location) return;

    status.textContent = 'Loading weather data…';
    weather.hidden = true;

    try {
      const geocodeResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
      if (!geocodeResponse.ok) throw new Error('Location lookup failed');
      const geocode = await geocodeResponse.json();
      if (!geocode.results?.length) throw new Error('No matching location found');

      const place = geocode.results[0];
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7`);
      if (!weatherResponse.ok) throw new Error('Weather service unavailable');
      const data = await weatherResponse.json();

      document.getElementById('temperature').textContent = `${Math.round(data.current.temperature_2m)}°C`;
      document.getElementById('wind').textContent = `${Math.round(data.current.wind_speed_10m)} km/h`;
      weather.hidden = false;
      status.textContent = `Showing 7-day conditions for ${place.name}${place.country ? `, ${place.country}` : ''}`;

      const labels = data.daily.time.map(date => new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }));
      const ctx = document.getElementById('historical-chart');
      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Precipitation (mm)', data: data.daily.precipitation_sum, backgroundColor: 'rgba(31,122,77,.55)', borderColor: '#1f7a4d', borderWidth: 2, borderRadius: 8, yAxisID: 'y' }, { type: 'line', label: 'Maximum temperature (°C)', data: data.daily.temperature_2m_max, borderColor: '#d97706', backgroundColor: '#d97706', tension: .35, yAxisID: 'y1' }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'mm' } }, y1: { position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: '°C' } } } }
      });
    } catch (error) {
      status.textContent = error.message || 'Unable to load weather data.';
      weather.hidden = true;
    }
  });
});