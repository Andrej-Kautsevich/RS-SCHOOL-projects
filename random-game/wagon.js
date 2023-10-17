const WAGON_CAPACITY = 500; // max oil in wagon
const WAGON_WIDTH = 114;
const OIL_PUMP_SPEED = 10; // Oil volume decrease per 0.1 second

import {
  sellLeft,
  sellRight,
  leftFactory,
  rightFactory,
  leftInc,
  rightInc,
  canvas,
  oilRigs,
} from "./index.js"


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
      wagon.oilVolume += OIL_PUMP_SPEED / 10;
      oilRig.oilVolume -= OIL_PUMP_SPEED / 10;
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
    wagon.oilVolume -= OIL_PUMP_SPEED / 10;
    money += (OIL_PUMP_SPEED / 10) * factory.price;
    console.log(factory.price);
    earnings += (OIL_PUMP_SPEED / 10) * factory.price;
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

  if (oilRigInDirection) { // Если есть OilRig в направлении `direction`
    return true; // Завершить функцию, так как не нужно что-то менять
  }

  // Проверить, есть ли OilRig в другом направлении
  oilRigInDirection = activeOilRigs.find(
    oilRig => wagon.direction === 1
      ? oilRig.valve < position
      : oilRig.valve > position
  );

  if (oilRigInDirection) { // Если есть OilRig в другом направлении
    wagon.direction *= -1; // Изменить направление движения
    return true
  }
  else {
    return false; // Если нет OilRigs ни в одном из направлений
  }
}

export {
  updateWagonState,
  WAGON_WIDTH,
}