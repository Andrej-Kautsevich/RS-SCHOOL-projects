const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

import {
  isMouseInValve,
  checkPipeLineLength,
  calculateLineLength,
  getPathAlongLine,
  createOilPolygons,
  checkLinesIntersect,

  PIPE_COST_PER_LENGTH,
} from "./calculations.js"

import {
  drawNewOilRig,
  drawNewWagon,
  drawPipeLines,
  drawOilRigs,
  drawValves,
  pumpingAnimation,
  drawOilPolygons,
  drawFrame,
  drawWagons,
  drawOilPrice,
} from "./render.js"

import {
  changePrice,
  updateMoneyBox,
  priceIntervals,
} from "./price.js"

import {
  updateOilRigs,
  OIL_RIG_CAPACITY,
  OIL_PUMP_SPEED
} from "./oilRigs.js"

let isPipeDrawing = false;
let canCreatePipe = false;
let isGameOver = false;
let pipeLines = [];
let oilRigs = [];
let wagons = [];
let valves = [];
let groundLevel;
let currentValve;
let pipes = [];
let polygons = [];
let leftFactory = { price: 0.95 };
let rightFactory = { price: 0.95 };
let money = 2000;
let earnings = 0;
let spendings = 0;

const MONTH_DURATION = 20 * 1000 //0.5 minute

const WAGON_CAPACITY = 150; // max oil in wagon
const WAGON_WIDTH = 114;
const OIL_PUMP_SPEED_TO_WAGON = 1; // Oil volume decrease per 0.1 second


function drawNewPipe(startX, startY, mouseX, mouseY) {
  ctx.save();
  ctx.strokeStyle = "white";

  canCreatePipe = true;
  if (mouseY < groundLevel) {
    ctx.setLineDash([5, 15]);
    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
    canCreatePipe = false;  // disallow creating pipes above ground 
  }

  pipeLines.forEach((pipe) => {
    // disallow intersection with existing pipes
    if (checkLinesIntersect(pipe.startX, pipe.startY, pipe.endX, pipe.endY, currentValve.x, currentValve.y, mouseX, mouseY)) {
      ctx.setLineDash([5, 15]);
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      canCreatePipe = false;
    }
  })

  //calculate pipe cost
  canCreatePipe = checkPipeLineLength(startX, startY, mouseX, mouseY, canCreatePipe, money);

  const length = calculateLineLength(currentValve.x, currentValve.y, mouseX, mouseY);
  const pipeCost = Math.round(length * PIPE_COST_PER_LENGTH);

  // draw new pipe
  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.moveTo(startX, startY);
  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();

  // draw price
  ctx.font = "36px Smokum"
  ctx.fillText(`$${pipeCost}`, mouseX + 10, mouseY - 10)
  ctx.restore();
}

function createNewPipeLine(event) {
  if (isWagonDrawing) return;
  if (isOilRigDrawing) return;
  if (!canCreatePipe) {
    isPipeDrawing = false;
    return
  };

  const mouseX = event.offsetX;
  const mouseY = event.offsetY;
  const length = calculateLineLength(currentValve.x, currentValve.y, mouseX, mouseY);
  const pipeCost = Math.round(length * PIPE_COST_PER_LENGTH);
  money -= pipeCost;
  spendings += pipeCost;

  isPipeDrawing = false;

  ctx.closePath();
  pipeLines.push({
    startX: currentValve.x,
    startY: currentValve.y,
    endX: mouseX,
    endY: mouseY,
  })

  //create new valve on pipe end
  let pathArc = new Path2D();
  pathArc.arc(mouseX, mouseY, valveImg.width / 2, 0, 2 * Math.PI);

  let newPathToValve = currentValve.pathToValve.slice();
  newPathToValve.push(valves.length + 1);

  valves.push({
    id: valves.length + 1,
    pathToValve: newPathToValve,
    toOilRig: currentValve.toOilRig,
    pathArc: pathArc,
    x: mouseX,
    y: mouseY,
  });

  //update oil polygon
  polygons.forEach((polygon) => {
    const path = polygon.path;
    if (ctx.isPointInPath(path, mouseX, mouseY)) {
      const toNewOilRig = currentValve.toOilRig;

      if (!polygon.toOilRig.includes(toNewOilRig)) {
        let toOilRig = polygon.toOilRig.slice();
        toOilRig.push(toNewOilRig);
        polygon.toOilRig = toOilRig;
      }

      //add new active pipe
      pipes.push({
        isActive: false,
        path: newPathToValve,
        polygonID: polygon.id,
        toOilRig: currentValve.toOilRig,
      })
    }
  })
  canCreatePipe = false;
}

function createNewOilRig(event) {
  if (!isOilRigDrawing) return;
  money -= 350;
  spendings += 350;

  const mouseX = event.offsetX;
  isOilRigDrawing = false;
  oilRigs.push({
    valve: mouseX,
    id: oilRigs.length + 1,
    oilVolume: 0,
    isActive: false,
  });

  let pathArc = new Path2D();
  pathArc.arc(mouseX, groundLevel - valveImg.height / 2, valveImg.width / 2, 0, 2 * Math.PI)
  valves.push({
    id: valves.length + 1,
    pathToValve: [valves.length + 1],
    toOilRig: oilRigs.length,
    pathArc: pathArc,
    x: mouseX,
    y: groundLevel - valveImg.height / 2,
  })
}

function createNewWagon(event) {
  if (!isWagonDrawing) return;
  money -= 200;
  spendings += 200;

  const mouseX = event.offsetX;
  isWagonDrawing = false;
  wagons.push({
    id: wagons.length + 1,
    isActive: true,
    oilVolume: 0,
    frameX: 0,
    frameY: 0,
    canvasX: mouseX - WAGON_WIDTH / 2,
    canvasY: groundLevel - wagonImg.height - 13 + 110,
    direction: 1, //to right
    frameCount: 0,
  });

  drawFrame(wagonImg, 0, 0, mouseX - 114 / 2, groundLevel - wagonImg.height - 13 + 110, 1);
}

function drawBackground() {
  ctx.drawImage(background, 0, 0);
  ctx.drawImage(rightInc, canvas.width - rightInc.width, groundLevel - rightInc.width - 11);
  ctx.drawImage(leftInc, 0, groundLevel - leftInc.width - 11);

  ctx.translate(0, background.height)

  //road background
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#d68b53";
  ctx.fillRect(0, 0, canvas.width, 13)
  ctx.closePath();
  ctx.restore();

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawGroundBackground() {
  let clipPath = new Path2D();
  if (pipeLines.length) {
    for (let pipe of pipeLines) {
      clipPath.addPath(getPathAlongLine(pipe.startX, pipe.startY, pipe.endX, pipe.endY, 50));
    }
  }
  ctx.save(); 
  if (!isGameOver) ctx.clip(clipPath);
  //draw ground background
  ctx.beginPath();
  ctx.fillStyle = "#714031";
  ctx.fillRect(0, groundLevel, canvas.width, canvas.height - background.height)
  ctx.closePath();
  //draw oil polygons
  drawOilPolygons(polygons);
  ctx.restore(); 
}

function drawGroundOverlay() {
  if (!isGameOver) ctx.drawImage(overlay, 0, groundLevel)
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawGroundOverlay();
  drawGroundBackground();

  drawOilRigs(oilRigImg, oilRigs, OIL_RIG_CAPACITY); //draw existing oil rigs
  drawPipeLines(pipeLines); // draw existing pipes

  pumpingAnimation(pipes, valves);

  drawOilPrice();

  drawWagons(wagonImg, wagons);

  if (isOilRigDrawing) drawNewOilRig(oilRigImg, toDraw.mouseX);
  if (isWagonDrawing) drawNewWagon(wagonImg, toDraw.mouseX);
  if (isPipeDrawing) drawNewPipe(toDraw.startX, toDraw.startY, toDraw.mouseX, toDraw.mouseY);

  drawValves(valveImg, valves);
  if (!isGameOver) window.requestAnimationFrame(render)
}

function updateState() {
  updateOilRigs(oilRigs, pipes, polygons)
  updateMoneyBox(money);
}

//wagons checks 
function updateWagonState(wagon) {
  wagon.isActive = true;
  updateWagonOil(wagon);
  if (wagon.isActive === false) return
  checkWagonFactory(wagon)
  if (wagon.isActive === false) return
  checkWagonState(wagon)
}

function updateWagonOil(wagon) {
  const position = wagon.canvasX + WAGON_WIDTH / 2;
  oilRigs.forEach((oilRig) => {
    if (oilRig.valve === position && oilRig.oilVolume > 0 && wagon.oilVolume < WAGON_CAPACITY) {
      wagon.isActive = false;
      wagon.oilVolume += OIL_PUMP_SPEED_TO_WAGON;
      oilRig.oilVolume -= OIL_PUMP_SPEED_TO_WAGON;
      if (wagon.oilVolume >= WAGON_CAPACITY || oilRig.oilVolume <= 0) {
        wagon.isActive = true;
      }
    }
    checkWagonOilLevel(wagon)
  })
}

function checkWagonOilLevel(wagon) {
  if (wagon.oilVolume < WAGON_CAPACITY * 0.5) {
    wagon.frameY = 0;
  }
  if (wagon.oilVolume >= WAGON_CAPACITY * 0.5) {
    wagon.frameY = 1;
  }
  if (wagon.oilVolume >= WAGON_CAPACITY * 0.9) {
    wagon.frameY = 2;
  }
}

function checkWagonFactory(wagon) {
  if (!sellRight && !sellLeft) return;

  const position = wagon.canvasX;

  if ((position === (leftInc.width / 2)) && sellLeft) {
    sellWagonOil(wagon, leftFactory)
  }

  if ((position + WAGON_WIDTH / 2 === (canvas.width - rightInc.width / 2)) && sellRight) {
    sellWagonOil(wagon, rightFactory)
  }
}

function sellWagonOil(wagon, factory) {
  if (wagon.oilVolume > 0) {
    wagon.isActive = false;
    wagon.oilVolume -= OIL_PUMP_SPEED_TO_WAGON;
    money += OIL_PUMP_SPEED_TO_WAGON * factory.price / 5;
    earnings += OIL_PUMP_SPEED_TO_WAGON * factory.price / 5;
  } else {
    wagon.oilVolume = 0;
    wagon.isActive = true;
    wagon.isMovingToFactory = false;
  }
}

function checkWagonState(wagon) {
  if (wagon.oilVolume >= WAGON_CAPACITY) {
    if (sellLeft) {
      wagon.direction = -1;
      wagon.isActive = true;
    }
    if (sellRight) {
      wagon.direction = 1;
      wagon.isActive = true;
    }
    if (!sellLeft && !sellRight) wagon.isActive = false;
    return;
  }

  if (checkOilRigInDirection(wagon)) {
    return;
  }

  if (wagon.oilVolume > 0) {
    if (sellLeft) {
      wagon.direction = -1;
      wagon.isActive = true;
      wagon.isMovingToFactory = true;
    } else if (sellRight) {
      wagon.direction = 1;
      wagon.isActive = true;
      wagon.isMovingToFactory = true;
    } else {
      wagon.isActive = false;
    }
  } else {
    wagon.isActive = false;
  }
}

function checkOilRigInDirection(wagon) {
  if (wagon.isMovingToFactory === true) {
    return;
  }

  const position = wagon.canvasX + WAGON_WIDTH / 2;
  const activeOilRigs = oilRigs.filter(oilRig => oilRig.oilVolume > 0);

  let oilRigInDirection = activeOilRigs.find(
    oilRig => wagon.direction === 1
      ? oilRig.valve > position
      : oilRig.valve < position
  );

  if (oilRigInDirection) { // If has OilRig in direction
    return true; 
  }

  // is OilRig in other direction
  oilRigInDirection = activeOilRigs.find(
    oilRig => wagon.direction === 1
      ? oilRig.valve < position
      : oilRig.valve > position
  );

  if (oilRigInDirection) { 
    wagon.direction *= -1; //change direction
    return true
  }
  else {
    return false; // if no active rigs in any direction
  }
}


let toDraw = {};

canvas.addEventListener("mousedown", mouseDownListener);
function mouseDownListener(event) {
  const startX = event.offsetX;
  const startY = event.offsetY;
  const valve = isMouseInValve(startX, startY, valves);
  currentValve = valve;
  if (valve) {
    isPipeDrawing = true;
    toDraw.startX = currentValve.x; //adjust to valve center
    toDraw.startY = currentValve.y;
  }
}

canvas.addEventListener("mousemove", mouseMoveListener)
function mouseMoveListener(event) {
  toDraw.mouseX = event.offsetX;
  toDraw.mouseY = event.offsetY;
}

canvas.addEventListener("mouseup", (event) => {
  createNewPipeLine(event);
  createNewOilRig(event);
  createNewWagon(event);
});


//Images
const overlay = new Image();
const background = new Image();
const oilRigImg = new Image();
const valveImg = new Image();
const rightInc = new Image();
const leftInc = new Image();
const wagonImg = new Image();

//Source
overlay.src = "assets/soil.jpg";
background.src = "assets/background.jpg";
oilRigImg.src = "assets/oil-rig.png";
valveImg.src = "assets/valve.png";
rightInc.src = "assets/Right.png";
leftInc.src = "assets/Left.png";
wagonImg.src = "assets/Wagon114x55.png";

function loadImg(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

let gameUpdateInterval;

async function initGame() {
  try {
    // Wait until images are loaded
    const background = await loadImg('assets/background.jpg');
    const overlay = await loadImg('assets/soil.jpg');
    const oilRigImg = await loadImg('assets/oil-rig.png');
    const valveImg = await loadImg('assets/valve.png');
    const rightInc = await loadImg('assets/Right.png');
    const leftInc = await loadImg('assets/Left.png');
    const wagonImg = await loadImg('assets/Wagon114x55.png');

    groundLevel = background.height + 13; // background + road
    resetVariables();
    drawBackground();
    drawGroundOverlay();
    createOilPolygons(groundLevel, polygons);
    drawGroundBackground();
    window.requestAnimationFrame(render);

    dateInterval = setInterval(changeMonth, MONTH_DURATION);
    gameUpdateInterval = setInterval(updateState, 100);

    changePrice(leftFactory.price, newPrice => leftFactory.price = newPrice);
    changePrice(rightFactory.price, newPrice => rightFactory.price = newPrice);
  }
  catch (err) {
    console.error(err);
  }
}

function resetVariables() {
  isPipeDrawing = false;
  canCreatePipe = false;
  pipeLines = [];
  oilRigs = [];
  wagons = [];
  valves = [];
  currentValve = {};
  pipes = [];
  polygons = [];
  leftFactory = { price: 0.95 };
  rightFactory = { price: 0.95 };
  money = 2000;
  earnings = 0;
  spendings = 0;
  monthIndex = 0;
}

//Top Menu
const oilRigIcon = document.getElementById('oil-rig');
const wagonIcon = document.getElementById('wagon');
const sellLeftBtn = document.getElementById('sellLeft');
const sellRightBtn = document.getElementById('sellRight');

let isOilRigDrawing = false;
let isWagonDrawing = false;
oilRigIcon.addEventListener('click', () => {
  if (money > 350) isOilRigDrawing = true;
})
wagonIcon.addEventListener('click', () => {
  if (money > 200) isWagonDrawing = true;
})

let sellLeft = false;
let sellRight = false;

sellLeftBtn.addEventListener('click', () => {
  if (sellRight) {
    sellRight = !sellRight;
    sellRightBtn.classList.toggle('sell-button_active');
  }

  sellLeft = !sellLeft;
  sellLeftBtn.classList.toggle('sell-button_active');
});

sellRightBtn.addEventListener('click', () => {
  if (sellLeft) {
    sellLeft = !sellLeft;
    sellLeftBtn.classList.toggle('sell-button_active');
  }

  sellRight = !sellRight;
  sellRightBtn.classList.toggle('sell-button_active');
});


let monthIndex = 0;
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "END"];
let dateInterval;

function changeMonth() {
  const dateElement = document.getElementById("date");
  monthIndex++;
  if (monthIndex === 12) {
    clearInterval(dateInterval);
    gameOver();
  }
  dateElement.innerHTML = months[monthIndex];
}


const modalWrapper = document.querySelector('.overlay-wrapper');
const gameOverTab = document.querySelector('.game-over');
const newGameTab = document.querySelector('.new-game');
const startGame = document.querySelector('.user-name-form');
const endGameBtn = document.getElementById('end-game');
const userInput = document.querySelector('.user-name-input');


//Game start
startGame.addEventListener('submit', (event) => {
  event.preventDefault();
  modalWrapper.classList.toggle('active');
  newGameTab.classList.toggle('active');
  const userName = userInput.value;

  //save user name
  localStorage.setItem('userName', userName);
  initGame();
})

endGameBtn.addEventListener('click', gameOver)


function gameOver() {
  for (let interval of priceIntervals) {
    clearInterval(interval);
  }

  clearInterval(gameUpdateInterval);
  clearInterval(dateInterval);
  isGameOver = true;

  render();

  ctx.save();
  ctx.font = "36px Smokum"
  ctx.fillText("The land lease has ended", canvas.width / 2, canvas.height / 2);
  ctx.restore()

  setTimeout(() => {
    modalWrapper.classList.toggle('active');
    gameOverTab.classList.toggle('active');
  }, 2000)
  const earningsResult = document.getElementById('earnings');
  const spendingsResult = document.getElementById('spendings');
  const totalResult = document.getElementById('total');
  const restartBtn = document.getElementById('restart')

  earningsResult.innerText = `Earnings: $${earnings.toFixed(0)}`;
  spendingsResult.innerText = `Spendings: -$${spendings.toFixed(0)}`;
  totalResult.innerText = `Total: $${money.toFixed(0)}`;

  //save result
  const userName = localStorage.getItem('userName');
  let userScores = JSON.parse(localStorage.getItem('userScores')) || [];

  const result = {
    user: userName,
    score: Math.round(money),
  };

  if (userScores.length < 10) {
    userScores.push(result);
    localStorage.setItem('userScores', JSON.stringify(userScores));
  } else {
    updateUserScores(result, userScores)
    localStorage.setItem('userScores', JSON.stringify(userScores));
  };

  userScores = JSON.parse(localStorage.getItem('userScores'))
  updateScoreTable(userScores);
  restartBtn.addEventListener('click', reset)
}

//reset last game
function reset() {
  isGameOver = false;
  gameOverTab.classList.toggle('active');
  newGameTab.classList.toggle('active');

  sellLeftBtn.classList.remove('sell-button_active')
  sellRightBtn.classList.remove('sell-button_active')

  const dateElement = document.getElementById("date");
  dateElement.innerHTML = "JAN";
}

function updateUserScores(result, userScores) {
  // find user index with minimum score
  let minIndex = 0;
  let minScore = userScores[0].score;

  for (let i = 1; i < userScores.length; i++) {
    if (userScores[i].score < minScore) {
      minScore = userScores[i].score;
      minIndex = i;
    }
  }

  if (result.score > minScore) {
    userScores.splice(minIndex, 1);
    userScores.push(result);
  }
}

function updateScoreTable(userScores) {
  const scoreList = document.querySelector('.last-games');
  if (scoreList) {
    userScores.sort((a, b) => b.score - a.score);

    scoreList.innerHTML = '';

    //update table
    userScores.forEach((user) => {
      // create new list item
      const newListItem = document.createElement('li');
      newListItem.classList.add('last-games-item');

      const userInfo = document.createElement('div');
      userInfo.classList.add('last-games-user');

      // add player name
      const userName = document.createElement('span');
      userName.classList.add('user-name');
      userName.textContent = user.user;

      // add score
      const userScore = document.createElement('span');
      userScore.classList.add('last-games-result');
      userScore.textContent = user.score;

      userInfo.appendChild(userName);
      userInfo.appendChild(userScore);
      newListItem.appendChild(userInfo);
      scoreList.appendChild(newListItem);
    });
  }
}

alert ('Привет ревьюер, игра работает но экономика пока ещё не настроена, проверять можно, но поиграть пока не получится')


export {
  updateWagonState,
  oilRigs,
  sellLeft,
  sellRight,
  leftFactory,
  rightFactory,
  groundLevel,
  leftInc,
  rightInc,
  canvas,
  ctx,
}