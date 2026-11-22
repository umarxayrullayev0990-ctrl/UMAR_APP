(() => {
  if (document.getElementById('cyber-guard-btn')) return;

  const style = document.createElement('style');
  style.textContent = `
    #cyber-guard-btn {
      position:fixed;right:16px;bottom:205px;z-index:9970;
      padding:13px 16px;background:#101b12;color:#65ff9b;
      border:1px solid #20d878;border-radius:13px;
      box-shadow:0 0 15px #087b43;
    }
    #cyber-guard-panel {
      position:fixed;inset:0;z-index:9975;
      display:none;overflow:auto;padding:20px;
      color:#baffd0;background:#06120b;
      font-family:Arial,sans-serif;
    }
    #cyber-guard-panel button {
      padding:11px 15px;margin:5px;
      border:1px solid #20d878;border-radius:10px;
      color:#8cffb0;background:#10291a;
    }
    .guard-item {
      padding:13px;margin:10px 0;
      border:1px solid #205c39;border-radius:12px;
      background:#0b1e12;
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'cyber-guard-btn';
  btn.textContent = 'CYBER GUARD X1';
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.id = 'cyber-guard-panel';
  panel.innerHTML = `
    <h2>CYBER GUARD X1</h2>
    <p>Qurilma va ilova xavfsizligi nazorati</p>
    <button id="guard-scan">TEKSHIRISH</button>
    <button id="guard-close">YOPISH</button>
    <div id="guard-results"></div>
    <p style="font-size:12px;color:#83a994">
      Bu tekshiruv faqat brauzer/WebView orqali mavjud
      ma'lumotlarni ko'rsatadi. Antivirus yoki to'liq
      Android xavfsizlik auditi emas.
    </p>
  `;
  document.body.appendChild(panel);

  const results = panel.querySelector('#guard-results');

  function item(title, value, detail) {
    return `
      <div class="guard-item">
        <b>${title}</b>
        <div>${value}</div>
        <small>${detail}</small>
      </div>
    `;
  }

  function scan() {
    const secure = window.isSecureContext;
    const online = navigator.onLine;
    const protocol = location.protocol;
    const permissions = !!navigator.permissions;
    const storage = !!window.localStorage;
    const serviceWorker = 'serviceWorker' in navigator;
    const media = !!navigator.mediaDevices;

    let html = '';

    html += item(
      'Internet',
      online ? 'ULANGAN' : 'UZILGAN',
      'navigator.onLine holati'
    );

    html += item(
      'HTTPS / Secure Context',
      secure ? 'XAVFSIZ KONTEKST' : 'SECURE CONTEXT EMAS',
      'Protokol: ' + protocol
    );

    html += item(
      'Permissions API',
      permissions ? 'MAVJUD' : 'MAVJUD EMAS',
      'Ruxsatlarni so‘rash imkoniyati'
    );

    html += item(
      'Local Storage',
      storage ? 'MAVJUD' : 'MAVJUD EMAS',
      'Ilova sozlamalarini saqlash imkoniyati'
    );

    html += item(
      'Service Worker',
      serviceWorker ? 'QO‘LLAB-QUVVATLANADI' : 'QO‘LLANMAYDI',
      'Fon xizmatlari imkoniyati'
    );

    html += item(
      'Media API',
      media ? 'MAVJUD' : 'MAVJUD EMAS',
      'Kamera va mikrofon API imkoniyati'
    );

    html += item(
      'Brauzer',
      navigator.userAgent,
      'WebView yoki brauzer ma’lumoti'
    );

    html += item(
      'Platforma',
      navigator.platform || 'Noma’lum',
      'Qurilma platformasi'
    );

    results.innerHTML = html;
  }

  btn.onclick = () => {
    panel.style.display = 'block';
    scan();
  };

  panel.querySelector('#guard-scan').onclick = scan;

  panel.querySelector('#guard-close').onclick = () => {
    panel.style.display = 'none';
  };
})();
