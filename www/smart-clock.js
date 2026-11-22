(function () {
  if (document.getElementById('smartClock')) return;

  const panel = document.createElement('div');
  panel.id = 'smartClock';
  panel.innerHTML = `
    <style>
      #smartClock {
        background:linear-gradient(145deg,#10172b,#07101c);
        color:#00eaff;
        padding:20px;
        margin:15px;
        border:1px solid #00aaff;
        border-radius:18px;
        text-align:center;
        font-family:Arial,sans-serif;
        box-shadow:0 0 15px #008cff44;
      }
      #smartClock .sc-time {
        font-size:38px;
        font-weight:bold;
        letter-spacing:3px;
        text-shadow:0 0 12px #00d9ff;
      }
      #smartClock .sc-date {color:#fff;margin:10px 0}
      #smartClock button {
        background:#07354b;color:#00eaff;
        border:1px solid #00d9ff;
        border-radius:8px;padding:10px 16px;margin:5px;
      }
      #smartClock .sc-stop {font-size:25px;margin:12px}
    </style>
    <h2>SMART CLOCK</h2>
    <div class="sc-time" id="scTime">00:00:00</div>
    <div class="sc-date" id="scDate"></div>
    <hr>
    <h3>Секундомер</h3>
    <div class="sc-stop" id="scStop">00:00:00</div>
    <button id="scStart">START</button>
    <button id="scPause">PAUSE</button>
    <button id="scReset">RESET</button>
  `;

  document.body.appendChild(panel);

  function updateClock() {
    const now = new Date();
    document.getElementById('scTime').textContent =
      now.toLocaleTimeString('uz-UZ', {hour12:false});
    document.getElementById('scDate').textContent =
      now.toLocaleDateString('uz-UZ', {
        weekday:'long', day:'numeric',
        month:'long', year:'numeric'
      });
  }

  updateClock();
  setInterval(updateClock, 1000);

  let elapsed = 0;
  let running = false;
  let startAt = 0;
  let timer = null;

  function renderStopwatch() {
    const total = Math.floor(elapsed / 1000);
    const h = String(Math.floor(total / 3600)).padStart(2,'0');
    const m = String(Math.floor(total % 3600 / 60)).padStart(2,'0');
    const s = String(total % 60).padStart(2,'0');
    document.getElementById('scStop').textContent = `${h}:${m}:${s}`;
  }

  document.getElementById('scStart').onclick = () => {
    if (running) return;
    running = true;
    startAt = Date.now() - elapsed;
    timer = setInterval(() => {
      elapsed = Date.now() - startAt;
      renderStopwatch();
    }, 100);
  };

  document.getElementById('scPause').onclick = () => {
    if (!running) return;
    running = false;
    clearInterval(timer);
    elapsed = Date.now() - startAt;
    renderStopwatch();
  };

  document.getElementById('scReset').onclick = () => {
    running = false;
    clearInterval(timer);
    elapsed = 0;
    renderStopwatch();
  };
})();
