import {
  canvas,
  ctx,
} from "./index.js";

const PIPE_COST_PER_LENGTH = 1;
const POLYGON_DENSITY = 4;
const POLYGON_SIZE = 125;    // Max polygon size

function isMouseInValve(mouseX, mouseY, valves) {
  for (let i = 0; i < valves.length; i++) {
    if (ctx.isPointInPath(valves[i].pathArc, mouseX, mouseY)) {
      return valves[i];  // point inside a valve
    }
  }
  return false; // point outside a valve
}

function checkPipeLineLength(startX, startY, endX, endY, canCreatePipe, money) {
  const length = calculateLineLength(startX, startY, endX, endY);
  if (length < 25) {
    ctx.strokeStyle = "red";
    canCreatePipe = false;
  }

  const pipeCost = length * PIPE_COST_PER_LENGTH;
  if (pipeCost >= money) {
    ctx.setLineDash([5, 15]);
    ctx.strokeStyle = "red";
    canCreatePipe = false;
  }
  return canCreatePipe;
}

function calculateLineLength(x1, y1, x2, y2) {
  var deltaX = x2 - x1;
  var deltaY = y2 - y1;
  var length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  return length;
}

function getPathFromPipe(pipe, valves) {
  let pathToRig = new Path2D();

  let valvesId = pipe.path
  let points = [];

  for (let id of valvesId) {
    for (let i = 0; i < valves.length; i++) {
      if (valves[i].id === id) {
        points.push({ x: valves[i].x, y: valves[i].y });
        break;
      }
    }
  }

  pathToRig.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    pathToRig.lineTo(points[i].x, points[i].y)
  }
  return pathToRig;
}

function getPathAlongLine(startX, startY, endX, endY, lineWidth) {
  // Вычисление вектора направления
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const directionX = dx / length;
  const directionY = dy / length;

  // Добавить 10px к концу линии
  const extension = 25;
  endX += directionX * extension;
  endY += directionY * extension;

  // Вычисление перпендикулярного вектора
  const perpendicularX = -directionY;
  const perpendicularY = directionX;

  // Вычисление точек пути
  const startPointLeft = {
    x: startX + perpendicularX * lineWidth / 2,
    y: startY + perpendicularY * lineWidth / 2
  };
  const endPointLeft = {
    x: endX + perpendicularX * lineWidth / 2,
    y: endY + perpendicularY * lineWidth / 2
  };
  const endPointRight = {
    x: endX - perpendicularX * lineWidth / 2,
    y: endY - perpendicularY * lineWidth / 2
  };
  const startPointRight = {
    x: startX - perpendicularX * lineWidth / 2,
    y: startY - perpendicularY * lineWidth / 2
  };

  let path = new Path2D();

  path.moveTo(startPointLeft.x, startPointLeft.y);
  path.lineTo(endPointLeft.x, endPointLeft.y);
  path.lineTo(endPointRight.x, endPointRight.y);
  path.lineTo(startPointRight.x, startPointRight.y);
  path.closePath();

  return path;
}

function createOilPolygons(groundLevel) {

  let polygons = []
  const polygonGap = Math.floor((canvas.width - POLYGON_SIZE * 2) / POLYGON_DENSITY);

  let originX = Math.floor(Math.random() * POLYGON_SIZE);
  while (originX < (canvas.width - POLYGON_SIZE)) {
    const originY = getRandomInt(groundLevel+13, canvas.height - POLYGON_SIZE) + POLYGON_SIZE;
    const polygonSideNumber = getRandomInt(5, 10) //random number between [5-10]
    const points = generatePolygon(polygonSideNumber, originX, originY);
    const oilVolume = Math.floor(calculatePolygonArea(points) / 4);

    let path = new Path2D();
    path.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      path.lineTo(points[i].x, points[i].y)
    }
    path.closePath();

    let maxPointX = points.reduce((max, curr) => max > curr.x ? max : curr.x, points[0].x);

    polygons.push({
      id: polygons.length + 1,
      path: path,
      points: points,
      oilVolume: oilVolume,
      maxOilVolume: oilVolume,
      isActive: false,
      activePipesId: [],
      toOilRig: [],
    });
    originX = maxPointX + getRandomInt(0, polygonGap)
  }
  return polygons
}

//calculate oil volume in polygon
function calculatePolygonArea(polygon) {
  let area = 0;
  const numVertices = polygon.length;

  for (let i = 0; i < numVertices; i++) {
    const currentVertex = polygon[i];
    const nextVertex = polygon[(i + 1) % numVertices];

    area += (currentVertex.x * nextVertex.y) - (currentVertex.y * nextVertex.x);
  }

  return area;
}

//based on this work https://cglab.ca/~sander/misc/ConvexGeneration/convex.html
function generatePolygon(n = 10, originX = 0, originY = 0) {
  // Step 1: generate two list of random X and Y coordinates
  const xPool = [];
  const yPool = [];
  for (let i = 0; i < n; i++) {
    xPool.push(Math.floor(Math.random() * POLYGON_SIZE))
    yPool.push(Math.floor(Math.random() * POLYGON_SIZE))
  }

  // Step 2: sort them (here by x coordinate for starting point in Graham scan algorithm)
  const sortedPointsX = xPool.sort((a, b) => a - b);
  const sortedPointsY = yPool.sort((a, b) => a - b);

  // Step 3: isolate the extreme points
  const minX = sortedPointsX[0];
  const maxX = sortedPointsX.at(-1);
  const minY = sortedPointsY[0];
  const maxY = sortedPointsY.at(-1);

  // Step 4-5: Divide the interior points into two chains & Extract the vector components
  let xVec = [], yVec = [];

  let lastTop = minX, lastBot = minX;

  for (let i = 1; i < n - 1; i++) {
    let x = xPool[i];

    if (Math.random() < 0.5) {
      xVec.push(x - lastTop);
      lastTop = x;
    } else {
      xVec.push(lastBot - x);
      lastBot = x;
    }
  }

  xVec.push(maxX - lastTop);
  xVec.push(lastBot - maxX);

  let lastLeft = minY, lastRight = minY;

  for (let i = 1; i < n - 1; i++) {
    let y = yPool[i];

    if (Math.random() < 0.5) {
      yVec.push(y - lastLeft);
      lastLeft = y;
    } else {
      yVec.push(lastRight - y);
      lastRight = y;
    }
  }

  yVec.push(maxY - lastLeft);
  yVec.push(lastRight - maxY);

  // Steps 6: Randomly pair up the X- and Y-components
  shuffle(yVec);

  //Steps 7: Combine the paired up components into vectors
  let vec = [];

  for (let i = 0; i < n; i++) {
    vec.push({ x: xVec[i], y: yVec[i] });
  }

  //Steps 8: Sort the vectors by angle
  vec.sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x));

  // Step 9: Lay them end-to-end to form a polygon
  let x = 0, y = 0;
  let minPolygonX = 0;
  let minPolygonY = 0;
  let points = [];

  for (let i = 0; i < n; i++) {
    points.push({ x: x, y: y });

    x += vec[i].x;
    y += vec[i].y;

    minPolygonX = Math.min(minPolygonX, x);
    minPolygonY = Math.min(minPolygonY, y);
  }

  // Step 10: Move the polygon
  let offsetX = originX - minPolygonX;
  for (let i = 0; i < n; i++) {
    let p = points[i];
    points[i] = { x: p.x + offsetX, y: p.y + originY };
  }

  return points
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let t = array[i]; array[i] = array[j]; array[j] = t
  }
}

// check intersect with existing pipe
//x1, y1, line1 start
//x2, y2 line1 end
//x3, y3 line2 start
//x4, y4 line2 end
function checkLinesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  if (x1 === x3 && y1 === y3) {
    return false;
  }

  if (x2 === x3 && y2 === y3) {
    return false;
  }

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  return true;
}

// generate a random real number in a given range
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// generate a random integer in a given range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {
  isMouseInValve,
  checkPipeLineLength,
  calculateLineLength,
  getPathFromPipe,
  getPathAlongLine,
  createOilPolygons,
  checkLinesIntersect,
  getRandomFloat,
  getRandomInt,

  PIPE_COST_PER_LENGTH,
}