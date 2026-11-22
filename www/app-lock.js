(function () {
  if (document.getElementById('appLock')) return;

  const panel = document.createElement('div');
  panel.id = 'appLock';

  panel.innerHTML = `
    <style>
      #appLock {
        margin:15px;padding:18px;
        background:linear-gradient(145deg,#10172b,#07101c);
        border:1px solid #00dfff;border-radius:18px;
        color:#00eaff;text-align:center;
        font-family:Arial,sans-serif;
      }
      #appLock input {
        width:80%;padding:12px;margin:8px;
        background:#101d30;color:white;
        border:1px solid #00dfff;border-radius:8px;
        font-size:18px;text-align:center;
      }
      #appLock button {
        padding:11px 18px;margin:6px;
        background:#07354b;color:#00eaff;
        border:1px solid #00dfff;border-radius:8px;
      }
      #appLockStatus {color:white;min-height:22px}
    </style>
    <h2>APP LOCK</h2>
    <p>UMAR APP uchun PIN-kod o‘rnating</p>
    <input id="lockPin" type="password" inputmode="numeric"
      maxlength="8" placeholder="4–8 raqamli PIN">
    <br>
    <button id="saveLockPin">PIN O‘RNATISH</button>
    <button id="testLockPin">TEKSHIRISH</button>
    <p id="appLockStatus">Himoya sozlanmagan</p>
  `;

  document.body.appendChild(panel);

  const pinInput = document.getElementById('lockPin');
  const status = document.getElementById('appLockStatus');

  document.getElementById('saveLockPin').onclick = () => {
    const pin = pinInput.value.trim();

    if (!/^\d{4,8}$/.test(pin)) {
      status.textContent = 'PIN 4–8 ta raqamdan iborat bo‘lsin';
      return;
    }

    localStorage.setItem('umarAppPin', pin);
    pinInput.value = '';
    status.textContent = 'PIN o‘rnatildi';
  };

  document.getElementById('testLockPin').onclick = () => {
    const saved = localStorage.getItem('umarAppPin');
    if (!saved) {
      status.textContent = 'Avval PIN o‘rnating';
    } else if (pinInput.value === saved) {
      status.textContent = 'PIN to‘g‘ri';
      pinInput.value = '';
    } else {
      status.textContent = 'PIN noto‘g‘ri';
    }
  };
})();
