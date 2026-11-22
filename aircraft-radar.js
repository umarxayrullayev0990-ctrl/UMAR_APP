(() => {
  if (document.getElementById('aircraft-radar-btn')) return;

  const style = document.createElement('style');
  style.textContent = `
    #aircraft-radar-btn {
      position:fixed;right:16px;bottom:145px;z-index:9980;
      padding:13px 16px;background:#071d35;color:#65e5ff;
      border:1px solid #00cfff;border-radius:13px;
      box-shadow:0 0 15px #0077aa;
    }
    #aircraft-radar {
      position:fixed;inset:0;z-index:9985;background:#020b16;
      color:#b9efff;display:none;padding:18px;
      overflow:auto;font-family:Arial,sans-serif;
    }
    #aircraft-radar button {
      padding:10px 14px;border-radius:9px;
      background:#092c42;color:#8eeaff;
      border:1px solid #00bfff;margin:5px;
    }
    #aircraft-map {
      width:100%;height:300px;border:1px solid #087da0;
      border-radius:12px;background:#031525;
    }
    #aircraft-list {
      margin-top:12px;line-height:1.8;
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.id = 'aircraft-radar-btn';
  button.textContent = '✈ AIRCRAFT RADAR X1';
  document.body.appendChild(button);

  const panel = document.createElement('div');
  panel.id = 'aircraft-radar';
  panel.innerHTML = `
    <h2>AIRCRAFT RADAR X1</h2>
    <p>Yaqin atrofdagi samolyotlarni kuzatish</p>
    <button id="aircraft-refresh">Yangilash</button>
    <button id="aircraft-close">Yopish</button>
    <p id="aircraft-status">Joylashuv aniqlanmagan</p>
    <canvas id="aircraft-map"></canvas>
    <div id="aircraft-list">Samolyotlar ma'lumoti hali yuklanmadi.</div>
    <p style="font-size:12px;color:#8ca9b8">
      Ma'lumotlar internet va ADS-B qamroviga bog'liq.
      Bu haqiqiy aviatsiya navigatsiya qurilmasi emas.
    </p>
  `;
  document.body.appendChild(panel);

  const status = panel.querySelector('#aircraft-status');
  const list = panel.querySelector('#aircraft-list');
  const canvas = panel.querySelector('#aircraft-map');
  const ctx = canvas.getContext('2d');

  function drawRadar(planes = []) {
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w,h) * .43;

    ctx.fillStyle = '#031525';
    ctx.fillRect(0,0,w,h);

    ctx.strokeStyle = '#087da0';
    ctx.lineWidth = 1;

    for (let i=1;i<=4;i++) {
      ctx.beginPath();
      ctx.arc(cx,cy,radius*i/4,0,Math.PI*2);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(cx,0);
    ctx.lineTo(cx,h);
    ctx.moveTo(0,cy);
    ctx.lineTo(w,cy);
    ctx.stroke();

    planes.forEach(p => {
      const x = cx + (p.x || 0) * radius;
      const y = cy - (p.y || 0) * radius;
      ctx.fillStyle = '#ffdc55';
      ctx.beginPath();
      ctx.arc(x,y,5,0,Math.PI*2);
      ctx.fill();
    });

    ctx.fillStyle = '#65e5ff';
    ctx.font = '12px Arial';
    ctx.fillText('RADAR',10,18);
  }

  let userLat = null;
  let userLon = null;
  let planes = [];

  async function loadPlanes() {
    if (userLat === null) {
      status.textContent = 'Avval joylashuvga ruxsat bering.';
      return;
    }

    status.textContent = 'Samolyotlar qidirilmoqda...';
    list.textContent = 'Ma’lumot yuklanmoqda...';

    try {
      const latRange = 1.5;
      const lonRange = 1.5;
      const url =
        `https://api.airplanes.live/v2/point/${userLat}/${userLon}/150`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Server javob bermadi');

      const data = await response.json();
      planes = data.ac || [];

      if (!planes.length) {
        status.textContent = 'Hozircha samolyot topilmadi.';
        list.textContent = 'Bu hududda ADS-B signali mavjud emas yoki samolyot aniqlanmadi.';
        drawRadar();
        return;
      }

      status.textContent = `${planes.length} ta samolyot aniqlandi.`;

      list.innerHTML = planes.slice(0,30).map(p => {
        const distance = p.lat && p.lon
          ? (111 * Math.hypot(p.lat-userLat,p.lon-userLon)).toFixed(1)
          : 'Noma’lum';

        return `
          <div style="border-bottom:1px solid #16445a;padding:9px 0">
            <b>✈ ${p.flight || p.hex || 'Noma’lum'}</b><br>
            Masofa: ${distance} km<br>
            Balandlik: ${p.alt_baro ?? 'Noma’lum'} ft<br>
            Tezlik: ${p.gs ?? 'Noma’lum'} knot<br>
            Yo‘nalish: ${p.track ?? 'Noma’lum'}°
          </div>
        `;
      }).join('');

      const points = planes
        .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lon))
        .map(p => ({
          x:(p.lon-userLon)/lonRange,
          y:(p.lat-userLat)/latRange
        }));

      drawRadar(points);
    } catch (e) {
      status.textContent = 'Internet yoki radar serverida xatolik.';
      list.textContent = e.message;
      drawRadar();
    }
  }

  function locate() {
    if (!navigator.geolocation) {
      status.textContent = 'Telefon joylashuv xizmatini qo‘llamaydi.';
      return;
    }

    status.textContent = 'Joylashuv aniqlanmoqda...';

    navigator.geolocation.getCurrentPosition(
      position => {
        userLat = position.coords.latitude;
        userLon = position.coords.longitude;
        status.textContent = 'Joylashuv aniqlandi. Radar tayyor.';
        loadPlanes();
      },
      error => {
        status.textContent = 'Joylashuvga ruxsat berilmadi: ' + error.message;
      },
      {enableHighAccuracy:true,timeout:15000,maximumAge:30000}
    );
  }

  button.onclick = () => {
    panel.style.display = 'block';
    locate();
  };

  panel.querySelector('#aircraft-close').onclick = () => {
    panel.style.display = 'none';
  };

  panel.querySelector('#aircraft-refresh').onclick = loadPlanes;

  drawRadar();
})();
