(function () {
  const style = document.createElement('style');
  style.textContent = `
  #umarEarth {
    background:radial-gradient(circle,#102b50,#030817 75%);
    border:1px solid #00bfff;
    border-radius:20px;
    padding:15px;
    margin:15px 0;
    text-align:center;
    color:#00eaff;
    overflow:hidden;
  }
  #earthCanvas {
    width:100%;
    max-width:360px;
    display:block;
    margin:auto;
    touch-action:none;
  }
  #umarEarth button {
    background:#063653;
    color:#00eaff;
    border:1px solid #00cfff;
    padding:10px 18px;
    border-radius:10px;
    margin:5px;
  }`;
  document.head.appendChild(style);

  const box = document.createElement('section');
  box.id = 'umarEarth';
  box.innerHTML = `
    <h2>🌍 3D EARTH</h2>
    <canvas id="earthCanvas" width="360" height="360"></canvas>
    <p>PLANET EARTH SYSTEM</p>
    <button id="earthZoomIn">ZOOM +</button>
    <button id="earthZoomOut">ZOOM -</button>
    <p style="font-size:12px">Drag to rotate the planet</p>
  `;

  (document.querySelector('main') ||
   document.querySelector('.container') ||
   document.body).appendChild(box);

  const canvas = document.getElementById('earthCanvas');
  const ctx = canvas.getContext('2d');

  let rotation = 0;
  let zoom = 1;
  let dragging = false;
  let lastX = 0;

  const stars = Array.from({length:90}, () => ({
    x:Math.random()*360,
    y:Math.random()*360,
    r:Math.random()*1.5
  }));

  function draw() {
    const w=360,h=360,c=180;
    ctx.clearRect(0,0,w,h);

    stars.forEach(s=>{
      ctx.fillStyle='#ffffff';
      ctx.globalAlpha=0.3+Math.random()*0.5;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha=1;

    const R=115*zoom;

    ctx.save();
    ctx.translate(c,c);

    ctx.shadowColor='#00aaff';
    ctx.shadowBlur=35;

    const ocean=ctx.createRadialGradient(-40,-45,5,0,0,R);
    ocean.addColorStop(0,'#39caff');
    ocean.addColorStop(0.55,'#0755a5');
    ocean.addColorStop(1,'#020d30');

    ctx.fillStyle=ocean;
    ctx.beginPath();
    ctx.arc(0,0,R,0,Math.PI*2);
    ctx.fill();

    ctx.shadowBlur=0;
    ctx.save();
    ctx.beginPath();
    ctx.arc(0,0,R,0,Math.PI*2);
    ctx.clip();

    // Simplified continent shapes
    const continents=[
      [-0.65,-0.35,0.25,0.35],
      [-0.55,0.25,0.16,0.40],
      [0.05,-0.55,0.55,0.22],
      [0.25,-0.05,0.28,0.42],
      [0.68,0.48,0.22,0.15],
      [-0.85,-0.55,0.16,0.13]
    ];

    continents.forEach(([x,y,rx,ry])=>{
      ctx.save();
      ctx.translate(x*R,y*R);
      ctx.rotate(rotation*0.3);
      ctx.fillStyle='#25c77b';
      ctx.beginPath();
      ctx.ellipse(0,0,rx*R,ry*R,0,0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    });

    // Latitude lines
    ctx.strokeStyle='#63dfff77';
    ctx.lineWidth=1;

    for(let i=-2;i<=2;i++){
      const y=i*R/3;
      const width=Math.sqrt(Math.max(0,R*R-y*y));
      ctx.beginPath();
      ctx.ellipse(0,y,width,width*0.22,0,0,Math.PI*2);
      ctx.stroke();
    }

    // Longitude lines
    for(let i=0;i<6;i++){
      const a=i*Math.PI/6+rotation;
      ctx.beginPath();
      ctx.ellipse(0,0,R*Math.abs(Math.cos(a)),R,0,0,Math.PI*2);
      ctx.stroke();
    }

    ctx.restore();

    ctx.strokeStyle='#49dfff';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(0,0,R,0,Math.PI*2);
    ctx.stroke();

    ctx.restore();

    rotation+=dragging?0:0.003;
    requestAnimationFrame(draw);
  }

  canvas.addEventListener('pointerdown',e=>{
    dragging=true;
    lastX=e.clientX;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove',e=>{
    if(!dragging)return;
    rotation+=(e.clientX-lastX)*0.01;
    lastX=e.clientX;
  });

  canvas.addEventListener('pointerup',()=>dragging=false);
  canvas.addEventListener('pointercancel',()=>dragging=false);

  document.getElementById('earthZoomIn').onclick=()=>{
    zoom=Math.min(1.5,zoom+0.1);
  };

  document.getElementById('earthZoomOut').onclick=()=>{
    zoom=Math.max(0.6,zoom-0.1);
  };

  draw();
})();
