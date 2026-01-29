const clock = document.querySelector('.clock');
const ticksContainer = clock.querySelector('.ticks');
const numbersContainer = clock.querySelector('.numbers');

// Generate 60 ticks accurately
for (let i = 0; i < 60; i++) {
  const tick = document.createElement('div');
  tick.classList.add('tick');
  if (i % 5 === 0) {
    tick.classList.add('hour'); // long hour ticks
  } else {
    tick.classList.add('minute'); // short minute/second ticks
  }
  tick.style.transform = `rotate(${i * 6}deg) translateY(-140px)`; // precise placement
  ticksContainer.appendChild(tick);
}

// Generate numbers 1-12 accurately
for (let i = 1; i <= 12; i++) {
  const number = document.createElement('div');
  number.classList.add('number');
  number.innerText = i;
  number.style.transform = `rotate(${i * 30}deg) translateY(-110px) rotate(${-i * 30}deg)`; // upright
  numbersContainer.appendChild(number);
}

// Function to update clock hands
function updateClock() {
  const now = new Date();
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();

  const hourDeg = (h + m / 60 + s / 3600) * 30; // 360/12 = 30 deg/hour
  const minuteDeg = (m + s / 60) * 6;          // 360/60 = 6 deg/min
  const secondDeg = s * 6;                     // 6 deg per second

  document.getElementById('hour').style.transform = `rotate(${hourDeg}deg)`;
  document.getElementById('minute').style.transform = `rotate(${minuteDeg}deg)`;
  document.getElementById('second').style.transform = `rotate(${secondDeg}deg)`;
}

// Initialize and set interval for ticking
updateClock();
setInterval(updateClock, 1000);
