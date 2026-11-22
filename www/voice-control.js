(function () {
  const style = document.createElement('style');
  style.textContent = `
  #umarVoice {
    background:linear-gradient(145deg,#071629,#10102c);
    border:1px solid #00eaff;
    border-radius:18px;
    padding:16px;
    margin:15px 0;
    text-align:center;
    color:#00eaff;
  }
  #umarVoice button {
    background:#063653;
    color:#00eaff;
    border:1px solid #00dfff;
    padding:13px 20px;
    border-radius:12px;
    margin:6px;
  }
  #voiceResult {
    background:#030b18;
    padding:12px;
    border-radius:10px;
    min-height:35px;
    color:white;
  }`;
  document.head.appendChild(style);

  const box=document.createElement('section');
  box.id='umarVoice';
  box.innerHTML=`
    <h2>VOICE CONTROL</h2>
    <p>UMAR VOICE SYSTEM</p>
    <div id="voiceResult">Ожидание голосовой команды...</div>
    <button id="voiceStart">🎙 START</button>
    <button id="voiceStop">STOP</button>
  `;

  (document.querySelector('main') ||
   document.querySelector('.container') ||
   document.body).appendChild(box);

  const result=document.getElementById('voiceResult');
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  let recognition=null;

  if(SpeechRecognition){
    recognition=new SpeechRecognition();
    recognition.lang='ru-RU';
    recognition.continuous=false;
    recognition.interimResults=false;

    recognition.onresult=e=>{
      const text=e.results[0][0].transcript;
      result.textContent=text;
      command(text.toLowerCase());
    };

    recognition.onerror=e=>{
      result.textContent='Ошибка микрофона: '+e.error;
    };

    recognition.onend=()=>{
      document.getElementById('voiceStart').textContent='🎙 START';
    };
  } else {
    result.textContent='Распознавание речи не поддерживается этим WebView.';
  }

  function say(text){
    if(typeof speak==='function'){
      speak(text);
    } else if('speechSynthesis' in window){
      speechSynthesis.cancel();
      speechSynthesis.speak(
        new SpeechSynthesisUtterance(text)
      );
    }
  }

  function command(text){
    if(text.includes('привет') || text.includes('салом')){
      say('Привет! UMAR система готова.');
    } else if(text.includes('время') || text.includes('soat')){
      say('Сейчас '+new Date().toLocaleTimeString('ru-RU'));
    } else if(text.includes('дата') || text.includes('sana')){
      say('Сегодня '+new Date().toLocaleDateString('ru-RU'));
    } else if(text.includes('радар')){
      document.getElementById('cyberRadar')?.scrollIntoView({behavior:'smooth'});
      say('Cyber radar открыт.');
    } else if(text.includes('земля')){
      document.getElementById('umarEarth')?.scrollIntoView({behavior:'smooth'});
      say('Планета Земля открыта.');
    } else {
      say('Команда принята. Пока эта команда не настроена.');
    }
  }

  document.getElementById('voiceStart').onclick=()=>{
    if(!recognition){
      result.textContent='Голосовое распознавание недоступно.';
      return;
    }
    try{
      recognition.start();
      document.getElementById('voiceStart').textContent='LISTENING...';
    }catch(e){
      result.textContent='Микрофон уже работает.';
    }
  };

  document.getElementById('voiceStop').onclick=()=>{
    recognition?.stop();
  };
})();
