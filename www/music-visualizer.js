(function () {
  if (document.getElementById('musicVisualizer')) return;

  const panel = document.createElement('div');
  panel.id = 'musicVisualizer';

  panel.innerHTML = `
    <style>
      #musicVisualizer {
        margin:15px;padding:18px;
        background:#080e1c;color:#00eaff;
        border:1px solid #00dfff;border-radius:18px;
        text-align:center;font-family:Arial,sans-serif;
      }
      #musicVisualizer canvas {
        width:100%;height:190px;
        background:#050914;border-radius:12px;
      }
      #musicVisualizer button {
        padding:11px 20px;margin:8px;
        background:#07354b;color:#00eaff;
        border:1px solid #00dfff;border-radius:8px;
      }
    </style>
    <h2>MUSIC VISUALIZER</h2>
    <canvas id="musicCanvas" width="600" height="220"></canvas>
    <p id="musicStatus">Mikrofonni yoqib, ovozni ko‘ring</p>
    <button id="musicStart">START</button>
    <button id="musicStop">STOP</button>
  `;

  document.body.appendChild(panel);

  const canvas = document.getElementById('musicCanvas');
  const ctx = canvas.getContext('2d');
  const status = document.getElementById('musicStatus');

  let audioContext = null;
  let stream = null;
  let analyser = null;
  let source = null;
  let animation = null;

  function draw() {
    if (!analyser) return;

    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    ctx.clearRect(0,0,600,220);

    const bars = 45;
    const step = Math.floor(data.length / bars);
    const width = 10;

    for (let i=0;i<bars;i++) {
      const value = data[i*step] || 0;
      const height = value * 0.65;
      const x = i * 13 + 5;

      const gradient = ctx.createLinearGradient(0,220-height,0,220);
      gradient.addColorStop(0,'#ff1744');
      gradient.addColorStop(1,'#00eaff');

      ctx.fillStyle = gradient;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00dfff';
      ctx.fillRect(x,220-height,width,height);
    }

    animation = requestAnimationFrame(draw);
  }

  document.getElementById('musicStart').onclick = async () => {
    try {
      if (stream) return;

      stream = await navigator.mediaDevices.getUserMedia({audio:true});
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await audioContext.resume();

      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      status.textContent = 'Mikrofon ishlayapti';
      draw();
    } catch (e) {
      status.textContent = 'Mikrofon ruxsati berilmadi yoki mavjud emas';
    }
  };

  document.getElementById('musicStop').onclick = async () => {
    cancelAnimationFrame(animation);

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    if (audioContext) await audioContext.close();

    stream = null;
    audioContext = null;
    analyser = null;
    source = null;

    ctx.clearRect(0,0,600,220);
    status.textContent = 'To‘xtatildi';
  };
})();
