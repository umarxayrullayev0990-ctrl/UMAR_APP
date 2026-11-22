(() => {
  const box = document.createElement('section');
  box.id = 'cyberRadar';
  box.innerHTML = `
    <h2>CYBER RADAR</h2>
    <canvas id="radarCanvas" width="320" height="320"></canvas>
    <p id="radarStatus">GPS KUTILMOQDA...</p>
    <p id="radarCoords">Koordinatalar: --</p>
    <p id="radarAccuracy">Aniqlik: --</p>
    <p id="radarSpeed">Tezlik: --</p>
  `;

  (document.querySelector('main') ||
   document.querySelector('.container') ||
   document.body).appendChild(box);

  const canvas = document.getElementById('radarCanvas');
  const ctx = canvas.getContext('2d');
  const status = document.getElementById('radarStatus');
  const coords = document.getElementById('radarCoords');
  const accuracy = document.getElementById('radarAccuracy');
  const speed = document.getElementById('radarSpeed');

  let angle = 0;

  function draw() {
    const c = 160;
    ctx.clearRect(0, 0, 320, 320);
    ctx.strokeStyle = '#00bfa5';
    ctx.lineWidth = 1;

    for (let r = 40; r <= 140; r += 40) {
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(c, 20);
    ctx.lineTo(c, 300);
    ctx.moveTo(20, c);
    ctx.lineTo(300, c);
    ctx.stroke();

    const gradient = ctx.createConicGradient(angle, c, c);
    gradient.addColorStop(0, '#00ffb055');
    gradient.addColorStop(0.25, 'transparent');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.arc(c, c, 140, angle, angle + Math.PI * 1.5);
    ctx.closePath();
    ctx.fill();

    angle += 0.025;
    requestAnimationFrame(draw);
  }

  draw();

  if (!navigator.geolocation) {
    status.textContent = 'GPS QURILMASI MAVJUD EMAS';
    return;
  }

  status.textContent = 'GPS RUXSATI KUTILMOQDA...';

  navigator.geolocation.watchPosition(
    (position) => {
      const p = position.coords;
      status.textContent = 'GPS FAOL';
      coords.textContent =
        `Koordinatalar: ${p.latitude.toFixed(6)}, ${p.longitude.toFixed(6)}`;
      accuracy.textContent =
        `Aniqlik: ${Math.round(p.accuracy)} metr`;
      speed.textContent =
        `Tezlik: ${p.speed == null ? '--' : (p.speed * 3.6).toFixed(1) + ' km/soat'}`;
    },
    (error) => {
      status.textContent = 'GPS XATOSI: ' + error.message;
    },
    {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 15000
    }
  );
})();
