const panel = document.createElement('section');
panel.id = 'umarFeatures';
panel.innerHTML = `
<style>
#umarFeatures{margin:16px;padding:16px;background:#151b20;color:white;border-radius:16px;font-family:Arial}
#umarFeatures input,#umarFeatures button{padding:12px;margin:5px 0;border-radius:9px;border:0;max-width:100%;box-sizing:border-box}
#umarFeatures input{width:100%}
#umarFeatures button{background:#39d353;color:#071009;font-weight:bold}
#umarFeatures h2{color:#39d353}
#umarFeatures .artel{background:white;color:#159447;text-align:center;padding:18px;font-size:30px;font-weight:bold;border-radius:12px;margin-top:18px}
</style>
<h2>UMAR APP — Sozlamalar</h2>
<p>Ismingiz:</p>
<input id="umarName" placeholder="Ismingizni kiriting">
<button id="saveName">Ismni saqlash</button>
<hr>
<h3>Fonar</h3>
<button id="flashBtn">FONARNI YOQISH / O‘CHIRISH</button>
<hr>
<h3>Eslatma</h3>
<input id="reminderText" placeholder="Eslatma matni">
<input id="reminderTime" type="datetime-local">
<button id="reminderBtn">Eslatma o‘rnatish</button>
<hr>
<h3>Ovoz yozish</h3>
<button id="recordBtn">YOZISHNI BOSHLASH</button>
<button id="stopRecordBtn">TO‘XTATISH</button>
<audio id="recordedAudio" controls style="width:100%;display:none"></audio>
<hr>
<h3>Ovoz sozlamalari</h3>
<button id="voiceBtn">OVOZNI SINASH</button>
<div style="background:#080B0D;color:#39D353;text-align:center;padding:18px;border-radius:12px;margin-top:18px;font-size:32px;font-weight:bold;line-height:1.1">U<br>M<br><small style="font-size:13px">UMAR APP</small></div><div class="artel">ARTEL</div>
`;
document.body.appendChild(panel);

const nameInput = document.getElementById('umarName');
nameInput.value = localStorage.getItem('umarUserName') || '';

document.getElementById('saveName').onclick = () => {
  const name = nameInput.value.trim();
  if (!name) return alert('Ismingizni kiriting');
  localStorage.setItem('umarUserName', name);
  document.querySelectorAll('h2').forEach(h => {
    if (h.textContent.includes('Привет')) h.textContent = 'Привет, ' + name + '!';
  });
  alert('Ism saqlandi');
};

let flashOn = false;
document.getElementById('flashBtn').onclick = async () => {
  try {
    const flash = window.UmarNative?.CapacitorFlash;
    if (!flash) return alert('Fonar moduli topilmadi');
    if (flashOn) await flash.switchOff();
    else await flash.switchOn();
    flashOn = !flashOn;
  } catch (e) { alert('Fonar ishlamadi: ' + e.message); }
};

document.getElementById('reminderBtn').onclick = async () => {
  const text = document.getElementById('reminderText').value.trim();
  const time = document.getElementById('reminderTime').value;
  if (!text || !time) return alert('Matn va vaqtni kiriting');
  const at = new Date(time);
  if (at <= new Date()) return alert('Kelajakdagi vaqtni tanlang');
  try {
    const notify = window.UmarNative?.LocalNotifications;
    if (!notify) return alert('Eslatma moduli topilmadi');
    let permission = await notify.checkPermissions();
    if (permission.display !== 'granted') permission = await notify.requestPermissions();
    if (permission.display !== 'granted') return alert('Bildirishnomaga ruxsat berilmadi');
    await notify.schedule({notifications:[{id:Date.now()%2147483647,title:'UMAR APP',body:text,schedule:{at}}]});
    alert('Eslatma o‘rnatildi');
  } catch (e) { alert('Xatolik: ' + e.message); }
};

let recorder, chunks = [];
document.getElementById('recordBtn').onclick = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio:true});
    chunks = [];
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      const audio = document.getElementById('recordedAudio');
      audio.src = URL.createObjectURL(new Blob(chunks,{type:'audio/webm'}));
      audio.style.display = 'block';
      stream.getTracks().forEach(t => t.stop());
    };
    recorder.start();
    alert('Ovoz yozish boshlandi');
  } catch (e) { alert('Mikrofonga ruxsat kerak: ' + e.message); }
};

document.getElementById('stopRecordBtn').onclick = () => {
  if (recorder && recorder.state === 'recording') recorder.stop();
};

document.getElementById('voiceBtn').onclick = () => {
  const name = localStorage.getItem('umarUserName') || 'друг';
  if (typeof speak === 'function') speak('Привет, ' + name + '. UMAR APP работает.');
  else alert('Ovoz funksiyasi topilmadi');
};
