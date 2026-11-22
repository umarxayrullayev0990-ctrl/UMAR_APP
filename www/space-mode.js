(() => {
  if (document.getElementById('space-mode-btn')) return;

  const style = document.createElement('style');
  style.textContent = `
    #space-mode-canvas {
      position:fixed;
      inset:0;
      width:100%;
      height:100%;
      z-index:9990;
      background:#02030d;
      display:none;
    }
    #space-mode-btn {
      position:fixed;
      right:16px;
      bottom:85px;
      z-index:9992;
      padding:12px 17px;
      border:1px solid #8b5cf6;
      border-radius:14px;
      color:white;
      background:#17112e;
    }
    #space-mode-close {
      position:fixed;
      right:16px;
      top:25px;
      z-index:9993;
      display:none;
      padding:10px 15px;
      color:white;
      background:#17112e;
      border:1px solid #a78bfa;
      border-radius:12px;
    }
  `;
  document.head.appendChild(style);

  const canvas = document.createElement('canvas');
  canvas.id = 'space-mode-canvas';
  document.body.appendChild(canvas);

  const btn = document.createElement('button');
  btn.id = 'space-mode-btn';
  btn.textContent = 'SPACE MODE';
  document.body.appendChild(btn);

  const close = document.createElement('button');
  close.id = 'space-mode-close';
  close.textContent = 'YOPISH';
  document.body.appendChild(close);

  const ctx = canvas.getContext('2d');
  let stars = [];
  let active = false;
  let animation;

  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    stars = Array.from({length:180}, () => ({
      x:Math.random()*canvas.width,
      y:Math.random()*canvas.height,
      r:Math.random()*1.8+0.3,
      speed:Math.random()*0.8+0.2
    }));
  }

  function draw() {
    if (!active) return;

    ctx.fillStyle = '#02030d';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    stars.forEach(s => {
      s.y += s.speed;

      if (s.y > canvas.height) {
        s.y = 0;
        s.x = Math.random()*canvas.width;
      }

      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle = 'white';
      ctx.fill();
    });

    const t = Date.now()/1000;

    const planets = [
      {x:canvas.width*.25,y:canvas.height*.38,r:38,c:'#7437d5'},
      {x:canvas.width*.72,y:canvas.height*.62,r:24,c:'#168ca8'}
    ];

    planets.forEach((p,i) => {
      const x = p.x + Math.sin(t*.35+i)*18;
      const y = p.y + Math.cos(t*.3+i)*12;

      const g = ctx.createRadialGradient(x-12,y-12,2,x,y,p.r);
      g.addColorStop(0,'white');
      g.addColorStop(.25,p.c);
      g.addColorStop(1,'#08051c');

      ctx.beginPath();
      ctx.arc(x,y,p.r,0,Math.PI*2);
      ctx.fillStyle = g;
      ctx.shadowColor = p.c;
      ctx.shadowBlur = 22;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    ctx.fillStyle = 'white';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('UMAR SPACE',20,45);

    ctx.font = '13px sans-serif';
    ctx.fillText('GALAXY EXPLORER',22,66);

    animation = requestAnimationFrame(draw);
  }

  btn.onclick = () => {
    active = true;
    canvas.style.display = 'block';
    btn.style.display = 'none';
    close.style.display = 'block';
    resize();
    draw();
  };

  close.onclick = () => {
    active = false;
    cancelAnimationFrame(animation);
    canvas.style.display = 'none';
    btn.style.display = 'block';
    close.style.display = 'none';
  };

  window.addEventListener('resize', () => {
    if (active) resize();
  });
})();
