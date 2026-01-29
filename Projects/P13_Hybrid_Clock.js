const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');
const timeEl = document.getElementById('time');
const ampmEl = document.getElementById('ampm');
const dateEl = document.getElementById('date');
const toggleFormatBtn = document.getElementById('toggleFormat');
const toggleThemeBtn = document.getElementById('toggleTheme');

let is24Hour = false;

function updateClock() {
  const now = new Date();

  // Digital clock
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let ampm = '';

  if (!is24Hour) {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }

  timeEl.textContent = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  ampmEl.textContent = is24Hour ? '' : ampm;

  dateEl.textContent = now.toLocaleDateString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // Analog clock - smooth hands
  const ms = now.getMilliseconds();
  const secondAngle = (seconds + ms/1000) * 6;
  const minuteAngle = (minutes + seconds/60 + ms/60000) * 6;
  const hourAngle = ((now.getHours()%12) + minutes/60 + seconds/3600) * 30;

  secondHand.style.transform = `rotate(${secondAngle}deg)`;
  minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
  hourHand.style.transform = `rotate(${hourAngle}deg)`;

  requestAnimationFrame(updateClock);
}

requestAnimationFrame(updateClock);

// Event listeners
toggleFormatBtn.addEventListener('click', () => { is24Hour = !is24Hour; });
toggleThemeBtn.addEventListener('click', () => { document.body.classList.toggle('dark'); });
