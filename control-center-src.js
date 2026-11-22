import { App } from '@capacitor/app';

(() => {
  if (document.getElementById('umar-control-button')) return;

  const style = document.createElement('style');
  style.textContent = `
    #umar-control-button {
      position:fixed;top:15px;right:15px;z-index:99999;
      background:#111827;color:#00e5ff;border:1px solid #00e5ff;
      padding:12px 16px;border-radius:12px;font-weight:bold;
    }
    #umar-control-panel {
      display:none;position:fixed;top:65px;right:12px;z-index:99999;
      width:230px;background:#101827;color:white;
      border:1px solid #00e5ff;border-radius:14px;padding:12px;
      box-shadow:0 0 20px #00e5ff55;
    }
    #umar-control-panel button {
      width:100%;padding:12px;margin:4px 0;border:0;
      border-radius:8px;background:#263449;color:white;font-weight:bold;
    }
    #umar-control-panel .exit {background:#9d2525}
    #umar-control-panel .home {background:#075985}
    body.umar-night {filter:brightness(.72)}
  `;
  document.head.appendChild(style);

  const launcher = document.createElement('button');
  launcher.id = 'umar-control-button';
  launcher.textContent = '☰ UMAR';
  document.body.appendChild(launcher);

  const panel = document.createElement('div');
  panel.id = 'umar-control-panel';
  panel.innerHTML = `
    <h3>UMAR CONTROL CENTER X1</h3>
    <button class="home" id="ucHome">⌂ HOME</button>
    <button id="ucBack">← BACK</button>
    <button id="ucMenu">☰ MENU / MODULLAR</button>
    <button id="ucNight">🌙 NIGHT MODE</button>
    <button class="exit" id="ucExit">⏻ EXIT APP</button>
    <div id="ucModules" style="display:none">
      <hr>
      <button data-module="umarAI">UMAR AI</button>
      <button data-module="umarVoice">VOICE CONTROL</button>
      <button data-module="space-mode-btn">SPACE MODE</button>
    </div>
  `;
  document.body.appendChild(panel);

  launcher.onclick = () => {
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  };

  function closePanels() {
    let closed = false;

    ['umarAI', 'umarVoice'].forEach(id => {
      const el = document.getElementById(id);
      if (el && getComputedStyle(el).display !== 'none') {
        el.style.display = 'none';
        closed = true;
      }
    });

    const space = document.getElementById('space-mode-canvas');
    if (space && getComputedStyle(space).display !== 'none') {
      document.getElementById('space-mode-close')?.click();
      closed = true;
    }

    return closed;
  }

  document.getElementById('ucHome').onclick = () => {
    closePanels();
    panel.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  document.getElementById('ucBack').onclick = async () => {
    if (closePanels()) return;
    if (window.history.length > 1) window.history.back();
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  document.getElementById('ucMenu').onclick = () => {
    const modules = document.getElementById('ucModules');
    modules.style.display = modules.style.display === 'block' ? 'none' : 'block';
  };

  document.querySelectorAll('#ucModules button').forEach(button => {
    button.onclick = () => {
      const id = button.dataset.module;

      if (id === 'space-mode-btn') {
        document.getElementById(id)?.click();
      } else {
        const module = document.getElementById(id);
        if (module) {
          module.style.display = 'block';
        } else {
          alert('Modul hali ishga tushmagan.');
        }
      }
      panel.style.display = 'none';
    };
  });

  document.getElementById('ucNight').onclick = () => {
    document.body.classList.toggle('umar-night');
  };

  document.getElementById('ucExit').onclick = async () => {
    if (confirm('UMAR APP ilovasidan chiqmoqchimisiz?')) {
      try {
        await App.exitApp();
      } catch (error) {
        alert('Ilovani yopish faqat Android APK ichida ishlaydi.');
      }
    }
  };

  App.addListener('backButton', async ({ canGoBack }) => {
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
    } else if (!closePanels()) {
      if (canGoBack) window.history.back();
      else await App.exitApp();
    }
  });
})();
