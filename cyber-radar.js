(function () {
  const style = document.createElement('style');
  style.textContent = `
  #cyberRadar {
    background:#030d18;
    border:1px solid #00eaff;
    border-radius:18px;
    padding:15px;
    margin:15px 0;
    text-align:center;
    color:#00eaff;
  }
  #cyberRadar canvas {
    width:100%;
    max-width:320px;
    display:block;
    margin:auto;
  }
  `;
  document.head.appendChild(style);

  const box = document.createElement('section');
  box.id = 'cyberRadar';
  box.innerHTML = `
    <h2>CYBER RADAR</h2>
    <canvas id="radarCanvas" width="320" height="320"></canvas>
    <p id="radarStatus">SYSTEM SCANNING...</p>
  `;

  (document.querySelector('main') ||
   document.querySelector('.container') ||
   document.body).appendChild(box);

  const canvas = document.getElementById('radarCanvas');
  const ctx = canvas.getContext('2d');
  let angle = 0;

  function draw() {
    const c = 160;
    ctx.clearRect(0,0,320,320);

    ctx.strokeStyle='#00bfa5';
    ctx.lineWidth=1;

    for(let r=40;r<=140;r+=40) {
      ctx.beginPath();
      ctx.arc(c,c,r,0,Math.PI*2);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(c,20);
    ctx.lineTo(c,300);
    ctx.moveTo(20,c);
    ctx.lineTo(300,c);
    ctx.stroke();

    const gradient=ctx.createConicGradient(angle,c,c);
    gradient.addColorStop(0,'#00ffb055');
    gradient.addColorStop(0.25,'transparent');
    gradient.addColorStop(1,'transparent');

    ctx.fillStyle=gradient;
    ctx.beginPath();
    ctx.moveTo(c,c);
    ctx.arc(c,c,140,angle,angle+Math.PI*1.5);
    ctx.closePath();
    ctx.fill();

    angle+=0.025;
    requestAnimationFrame(draw);
  }

  draw();
})();
