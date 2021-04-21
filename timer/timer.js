// https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/
// TODO:
// - pause + continue
// - design
// - sound (tick, ring)

const FULL_DASH_ARRAY = 283;

const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: 10,
  },
  alert: {
    color: "red",
    threshold: 5,
  },
};

let endTime = Date.now();
let timerInterval = null;

document.getElementById("app").innerHTML = `
<div class="agile-timer">
  <svg class="agile-timer-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="agile-timer-circle">
      <circle class="agile-timer-scale" cx="50" cy="50" r="45" />
      <path
        id="agile-timer-indicator-path"
        stroke-dasharray="283"
        class="agile-timer-indicator-path ${COLOR_CODES.info.color}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <div class="agile-timer-display">
    <span style="height: 30%"></span>
    <div class="agile-timer-time">
      <input type="number" id="minutes-input" min="0" max="60" step="1" value="0" required>
      <output id="minutes-output" style="display: none"></output>
      :
      <input type="number" id="seconds-input" min="0" max="59" step="1" value="20" required>
      <output id="seconds-output" style="display: none"></output>
    </div>
    <span class="agile-timer-controls">
      <span id="agile-timer-control-start" onClick="startTimer()">Start</span>
      <span id="agile-timer-control-reset" onClick="resetTimer()">Reset</span>
    </span>
  </div>
</div>
`;
setMode();

function getDuration() {
  const minutes = Number.parseInt(
    document.getElementById("minutes-input").value,
    10
  );
  const seconds = Number.parseInt(
    document.getElementById("seconds-input").value,
    10
  );
  return minutes * 60 + seconds;
}

function getRemainingTime(endTime) {
  const remainingTime = endTime - Date.now();
  if (remainingTime <= 0) {
    return 0;
  }
  return Math.round(remainingTime / 1000);
}

function isValid() {
  return (
    document.getElementById("minutes-input").reportValidity() &&
    document.getElementById("seconds-input").reportValidity()
  );
}

function onTimesUp() {
  clearInterval(timerInterval);
  setMode("finished");
}

function resetTimer() {
  setMode();

  const { alert, warning, info } = COLOR_CODES;
  document
    .getElementById("agile-timer-indicator-path")
    .classList.remove(alert.color, warning.color);
  document
    .getElementById("agile-timer-indicator-path")
    .classList.add(info.color);
}

// Update the dasharray value as time passes, starting with 283
function setCircleDasharray(duration, remainingTime) {
  const rawTimeFraction = remainingTime / duration;
  const timeFraction = rawTimeFraction - (1 / duration) * (1 - rawTimeFraction);

  const circleDasharray = `${(timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
  document
    .getElementById("agile-timer-indicator-path")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function setIndicatorColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;

  // If the remaining time is less than or equal to 5, remove the "warning" class and apply the "alert" class.
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("agile-timer-indicator-path")
      .classList.remove(warning.color);
    document
      .getElementById("agile-timer-indicator-path")
      .classList.add(alert.color);

    // If the remaining time is less than or equal to 10, remove the base color and apply the "warning" class.
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("agile-timer-indicator-path")
      .classList.remove(info.color);
    document
      .getElementById("agile-timer-indicator-path")
      .classList.add(warning.color);
  }
}

function setMode(mode) {
  if (mode === "running") {
    document.getElementById("minutes-input").style.display = "none";
    document.getElementById("seconds-input").style.display = "none";
    document.getElementById("minutes-output").style.display = "block";
    document.getElementById("seconds-output").style.display = "block";
    document.getElementById("agile-timer-control-reset").classList.add("disabled");
    document.getElementById("agile-timer-control-start").classList.add("disabled");
  } else if (mode === "finished") {
    document.getElementById("agile-timer-control-reset").classList.remove("disabled");
    document.getElementById("agile-timer-control-start").classList.add("disabled");
  } else {
    document.getElementById("minutes-output").style.display = "none";
    document.getElementById("seconds-output").style.display = "none";
    document.getElementById("minutes-input").style.display = "block";
    document.getElementById("seconds-input").style.display = "block";
    document.getElementById("agile-timer-control-reset").classList.add("disabled");
    document.getElementById("agile-timer-control-start").classList.remove("disabled");
  }
}

function startTimer() {
  if (!isValid()) {
    return;
  }

  setMode("running");

  const duration = getDuration();
  endTime = Date.now() + duration * 1000;
  updateRemainingTime(getRemainingTime(endTime));

  timerInterval = setInterval(() => {
    const remainingTime = getRemainingTime(endTime);
    updateRemainingTime(remainingTime);

    setCircleDasharray(duration, remainingTime);
    setIndicatorColor(remainingTime);

    if (remainingTime <= 0) {
      onTimesUp();
    }
  }, 1000);
}

function updateRemainingTime(remainingTime) {
  let minutes = 0;
  let seconds = 0;

  if (remainingTime > 0) {
    minutes = Math.floor(remainingTime / 60);
    seconds = remainingTime % 60;
  }

  document.getElementById("minutes-output").innerHTML = minutes;
  document.getElementById("seconds-output").innerHTML =
    seconds < 10 ? `0${seconds}` : seconds;
}
