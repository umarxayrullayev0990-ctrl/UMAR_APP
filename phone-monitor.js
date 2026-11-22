(function () {
  if (document.getElementById('phoneMonitor')) return;

  const panel = document.createElement('div');
  panel.id = 'phoneMonitor';

  panel.innerHTML = `
    <style>
      #phoneMonitor {
        background:linear-gradient(145deg,#10172b,#07101c);
        color:#00eaff;
        padding:18px;
        margin:15px;
        border:1px solid #00aaff;
        border-radius:18px;
        font-family:Arial,sans-serif;
      }
      #phoneMonitor h2 {text-align:center}
      #phoneMonitor .pm-item {
        background:#14243a;
        padding:12px;
        margin:9px 0;
        border-radius:10px;
        color:white;
      }
      #phoneMonitor .pm-value {
        color:#00eaff;
        float:right;
      }
    </style>
    <h2>PHONE MONITOR</h2>
    <div class="pm-item">📱 Qurilma <span class="pm-value" id="pmDevice">Aniqlanmoqda</span></div>
    <div class="pm-item">⚙️ Platforma <span class="pm-value" id="pmPlatform">—</span></div>
    <div class="pm-item">🔋 Batareya <span class="pm-value" id="pmBattery">Tekshirilmoqda</span></div>
    <div class="pm-item">🔌 Zaryad <span class="pm-value" id="pmCharging">—</span></div>
    <div class="pm-item">🌐 Internet <span class="pm-value" id="pmNetwork">—</span></div>
    <div class="pm-item">📐 Ekran <span class="pm-value" id="pmScreen">—</span></div>
    <div class="pm-item">🧠 Xotira (brauzer limiti) <span class="pm-value" id="pmMemory">—</span></div>
    <p style="font-size:12px;color:#9bb3c8">
      Ma'lumotlar Android WebView ruxsat bergan imkoniyatlar doirasida olinadi.
    </p>
  `;

  document.body.appendChild(panel);

  const ua = navigator.userAgent;
  document.getElementById('pmDevice').textContent =
    ua.match(/Android[^;)]*/i)?.[0] || 'Mobil qurilma';

  document.getElementById('pmPlatform').textContent =
    navigator.platform || 'Noma’lum';

  document.getElementById('pmScreen').textContent =
    `${screen.width} × ${screen.height}`;

  function updateNetwork() {
    document.getElementById('pmNetwork').textContent =
      navigator.onLine ? 'Ulangan' : 'Ulanmagan';
  }

  updateNetwork();
  window.addEventListener('online', updateNetwork);
  window.addEventListener('offline', updateNetwork);

  if (navigator.deviceMemory) {
    document.getElementById('pmMemory').textContent =
      navigator.deviceMemory + ' GB (taxminiy)';
  } else {
    document.getElementById('pmMemory').textContent =
      'Mavjud emas';
  }

  async function updateBattery() {
    if (!navigator.getBattery) {
      document.getElementById('pmBattery').textContent =
        'Brauzer qo‘llamaydi';
      document.getElementById('pmCharging').textContent =
        'Mavjud emas';
      return;
    }

    try {
      const battery = await navigator.getBattery();

      function render() {
        document.getElementById('pmBattery').textContent =
          Math.round(battery.level * 100) + '%';
        document.getElementById('pmCharging').textContent =
          battery.charging ? 'Zaryad olayapti' : 'Zaryadda emas';
      }

      render();
      battery.addEventListener('levelchange', render);
      battery.addEventListener('chargingchange', render);
    } catch (e) {
      document.getElementById('pmBattery').textContent =
        'Ruxsat yoki API mavjud emas';
    }
  }

  updateBattery();
})();
