import "p5";

const COUNTDOWN = 3000;
const GAME_TIME = 10000;

let counter = 0;
let timer = 0;
let lastTime = 0;
let showWelcome = true;
let roundFinished = false;

setHighscoreText();

function getHighscore() {
  return localStorage.getItem("highscore") || 0;
}

function updateHighscore() {
  const current = getHighscore();

  if (counter > current) {
    localStorage.setItem("highscore", counter);
    setHighscoreText(counter);
  }
}

function setHighscoreText() {
  document.querySelector(
    "p#highscore",
  ).textContent = `Highscore: ${getHighscore()}`;
}

function restartRound() {
  counter = 0;
  timer = GAME_TIME + COUNTDOWN;
  roundFinished = false;
  showWelcome = false;
}

function tick() {
  const currentTime = millis();
  timer -= currentTime - lastTime;
  timer = Math.max(timer, 0);
  lastTime = currentTime;

  if (timer <= 0 && !roundFinished) {
    roundFinished = true;

    updateHighscore(counter);
  }
}

function isRunning() {
  return timer > 0 && timer <= GAME_TIME;
}

function getMainText() {
  if (showWelcome) {
    return "Press enter to\nstart pressing.";
  } else if (timer > GAME_TIME) {
    return `Get ready... ${parseInt((timer - GAME_TIME) / 1000) + 1}`;
  } else {
    return counter;
  }
}

function getTimeText() {
  if (isRunning()) {
    const sec = Math.floor(timer / 1000);
    const milli = Math.floor((timer - sec * 1000) / 10);
    return `Time left: ${sec.toString().padStart(2, "0")}.${milli
      .toString()
      .substring(0, 2)
      .padEnd(2, "0")}`;
  } else if (roundFinished && !showWelcome) {
    return "Time's up! Press enter to restart.";
  } else {
    return "";
  }
}

window.setup = function() {
  createCanvas(750, 750);
};

window.draw = function() {
  tick();

  background(255);

  textAlign(CENTER, CENTER);

  textSize(70);
  text(getMainText(), width / 2, height / 2);
  textSize(30);
  text(getTimeText(), width / 2, height - 50);

  if (roundFinished && !showWelcome) {
    text(
      `(${Math.floor((counter / (GAME_TIME / 1000)) * 100) / 100} CPS)`,
      width / 2,
      height / 2 + 70,
    );
  }
};

window.keyTyped = function() {
  if (isRunning() && key === " ") {
    counter += 1;
  }
};

window.keyPressed = function() {
  if (!isRunning() && keyCode === ENTER) {
    restartRound();
  }
};
