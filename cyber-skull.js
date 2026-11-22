(function () {
  if (document.getElementById('cyberSkull')) return;

  const panel = document.createElement('div');
  panel.id = 'cyberSkull';

  panel.innerHTML = `
    <style>
      #cyberSkull {
        margin:15px;padding:15px;
        background:radial-gradient(circle,#172b45,#050914);
        border:1px solid #00dfff;border-radius:18px;
        color:#00eaff;text-align:center;
        font-family:Arial,sans-serif;
      }
      #cyberSkull canvas {
        width:100%;max-width:420px;height:300px;
        display:block;margin:auto;touch-action:none;
      }
    </style>
    <h2>3D CYBER SKULL</h2>
    <canvas id="skullCanvas" width="600" height="420"></canvas>
    <p>Barmoq bilan aylantiring</p>
  `;

  document.body.appendChild(panel);

  const canvas = document.getElementById('skullCanvas');
  const ctx = canvas.getContext('2d');
  let angle = 0;
  let dragging = false;
  let lastX = 0;
  let glow = 0;

  function draw() {
    ctx.clearRect(0,0,600,420);
    ctx.save();
    ctx.translate(300,205);
    ctx.rotate(Math.sin(angle)*0.12);

    ctx.shadowBlur = 22;
    ctx.shadowColor = '#00eaff';
    ctx.strokeStyle = '#00eaff';
    ctx.lineWidth = 5;

    // Bosh suyagi
    ctx.beginPath();
    ctx.ellipse(0,-35,115,135,0,0,Math.PI*2);
    ctx.fillStyle = '#17283b';
    ctx.fill();
    ctx.stroke();

    // Peshona va jag‘
    ctx.beginPath();
    ctx.moveTo(-75,45);
    ctx.lineTo(-60,115);
    ctx.lineTo(-35,145);
    ctx.lineTo(35,145);
    ctx.lineTo(60,115);
    ctx.lineTo(75,45);
    ctx.stroke();

    // Ko‘zlar
    ctx.shadowBlur = 30 + glow;
    ctx.shadowColor = '#ff1744';
    ctx.fillStyle = '#ff1744';

    ctx.beginPath();
    ctx.ellipse(-48,-35,32,24,-0.2,0,Math.PI*2);
    ctx.ellipse(48,-35,32,24,0.2,0,Math.PI*2);
    ctx.fill();

    // Burun
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#050914';
    ctx.beginPath();
    ctx.moveTo(0,5);
    ctx.lineTo(-17,40);
    ctx.lineTo(17,40);
    ctx.closePath();
    ctx.fill();

    // Tishlar
    ctx.strokeStyle = '#00eaff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-48,100);
    ctx.lineTo(48,100);
    for(let x=-35;x<=35;x+=17){
      ctx.moveTo(x,100);
      ctx.lineTo(x,135);
    }
    ctx.stroke();

    // Neon chiziqlar
    ctx.strokeStyle = '#00eaff';
    ctx.beginPath();
    ctx.moveTo(-110,-80);
    ctx.lineTo(-145,-110);
    ctx.moveTo(110,-80);
    ctx.lineTo(145,-110);
    ctx.stroke();

    ctx.restore();
    glow = (glow + 0.5) % 12;
    angle += dragging ? 0 : 0.012;
    requestAnimationFrame(draw);
  }

  canvas.addEventListener('pointerdown',e=>{
    dragging=true;
    lastX=e.clientX;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove',e=>{
    if(!dragging)return;
    angle += (e.clientX-lastX)*0.012;
    lastX=e.clientX;
  });

  canvas.addEventListener('pointerup',()=>dragging=false);
  canvas.addEventListener('pointercancel',()=>dragging=false);

  draw();
})();
