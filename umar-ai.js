(function () {
  const style = document.createElement('style');
  style.textContent = `
  #umarAI {
    background:linear-gradient(145deg,#071525,#10102c);
    border:1px solid #00d9ff;
    border-radius:18px;
    padding:16px;
    margin:15px 0;
    color:#fff;
    box-shadow:0 0 18px #00bfff33;
  }
  #umarAI h2 {
    color:#00eaff;
    text-align:center;
  }
  #umarMessages {
    height:220px;
    overflow-y:auto;
    background:#050b18;
    border-radius:12px;
    padding:10px;
    font-size:14px;
  }
  .umar-msg {
    padding:9px;
    margin:7px 0;
    border-radius:10px;
    background:#10243b;
  }
  #umarAI input {
    width:68%;
    padding:12px;
    border-radius:10px;
    border:1px solid #00cfff;
    background:#071525;
    color:white;
  }
  #umarAI button {
    padding:11px;
    border:0;
    border-radius:10px;
    background:#00bde8;
    color:#00111b;
    font-weight:bold;
    margin-top:8px;
  }`;
  document.head.appendChild(style);

  const panel = document.createElement('section');
  panel.id = 'umarAI';
  panel.innerHTML = `
    <h2>🤖 UMAR AI</h2>
    <p style="text-align:center;color:#00eaff">
      FUTURE INTELLIGENCE SYSTEM
    </p>
    <div id="umarMessages">
      <div class="umar-msg">
        UMAR AI: Система готова. Задайте вопрос.
      </div>
    </div>
    <input id="umarQuestion" placeholder="Введите сообщение...">
    <button id="umarSend">SEND</button>
    <button id="umarSpeak">VOICE</button>
  `;

  const target = document.querySelector('main') ||
                 document.querySelector('.container') ||
                 document.body;

  target.appendChild(panel);

  const messages = document.getElementById('umarMessages');
  const input = document.getElementById('umarQuestion');

  function addMessage(name, value) {
    const div = document.createElement('div');
    div.className = 'umar-msg';
    div.textContent = name + ': ' + value;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function send() {
    const question = input.value.trim();
    if (!question) return;

    addMessage('YOU', question);
    input.value = '';

    let answer = 'Команда принята. Для настоящего AI необходимо подключение к AI-серверу.';

    const q = question.toLowerCase();

    if (q.includes('привет') || q.includes('salom')) {
      answer = 'Привет! Я UMAR AI. Чем могу помочь?';
    } else if (q.includes('время') || q.includes('soat')) {
      answer = 'Сейчас ' + new Date().toLocaleTimeString('ru-RU');
    } else if (q.includes('дата') || q.includes('sana')) {
      answer = new Date().toLocaleDateString('ru-RU');
    }

    addMessage('UMAR AI', answer);
  }

  document.getElementById('umarSend').onclick = send;

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') send();
  });

  document.getElementById('umarSpeak').onclick = () => {
    const text = messages.lastElementChild.textContent;
    if (typeof speak === 'function') speak(text);
    else if ('speechSynthesis' in window) {
      speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };
})();
