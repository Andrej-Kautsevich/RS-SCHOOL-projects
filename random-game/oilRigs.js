const OIL_RIG_CAPACITY = 1000; //max oil in rig
const OIL_PUMP_SPEED = 5; // Oil volume decrease per 0.1 second

function updateOilRigs(oilRigs, pipes, polygons) {
  if (oilRigs) {
    oilRigs.forEach((oilRig) => {
      updateOilRig(oilRig, pipes, polygons);
    })
  }
}

function updateOilRig(oilRig, pipes, polygons) {
  if (pipes) {
    pipes.forEach((pipe) => {
      if (pipe.toOilRig === oilRig.id) {
        const polygon = polygons.find(p => p.id === pipe.polygonID);
        updatePipe(pipe, oilRig, polygon);
      }
    })
  }
}

function updatePipe(pipe, oilRig, polygon) {
  if (oilRig.oilVolume < OIL_RIG_CAPACITY && polygon.oilVolume > 0) {
    pipe.isActive = true;
    oilRig.oilVolume += OIL_PUMP_SPEED;
    polygon.oilVolume -= OIL_PUMP_SPEED;
  } else {
    pipe.isActive = false;
  }
}

export {
  updateOilRigs,
  OIL_RIG_CAPACITY,
  OIL_PUMP_SPEED
}