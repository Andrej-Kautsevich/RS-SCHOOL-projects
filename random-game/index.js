const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//Images
const soil = new Image();

const background = new Image();


//Source
soil.src = "assets/soil.jpg"

background.src = "assets/background.jpg";


function drawBackground() {
  ctx.drawImage(background, 0, 0);
  ctx.translate(0, background.height)

  //ground background
  ctx.beginPath();
  ctx.fillStyle = "#714031";
  ctx.fillRect(0, 0, canvas.width, canvas.height - background.height)
  ctx.closePath();

  ctx.beginPath();
  const soilPattern = ctx.createPattern(soil, "repeat");
  ctx.fillStyle = soilPattern;
  ctx.fillRect(0, 0, canvas.width, canvas.height - background.height);
  ctx.closePath();

  //road background
  ctx.beginPath();
  ctx.fillStyle = "#d68b53";
  ctx.fillRect(0, 0, canvas.width, 13)
  ctx.closePath();

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// draw new pipe

let isDrawing = false;
let canCreate = true;
let startX, startY;
let pipeLines = [];

canvas.addEventListener("mousedown", (event) => {
  startX = event.offsetX;
  startY = event.offsetY;
  if (startY < 300) {
    return;
  } // above ground 
  isDrawing = true;
  console.log(startX, startY);
});

canvas.addEventListener("mousemove", (event) => {
  if (!isDrawing) return;

  const mouseX = event.offsetX;
  const mouseY = event.offsetY;

  ctx.setLineDash([]); // возвращает обратно к сплошной линии
  ctx.strokeStyle = "white"; // возвращаем начальный цвет
  canCreate = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPipeLines(); // draw existing pipes

  if (mouseY < 300) {
    ctx.setLineDash([5, 15]); // создает пунктирный паттерн: 5px образующей линии, 15px промежутка
    ctx.strokeStyle = "red";
    canCreate = false;
  } // can not create pipes above ground 

  pipeLines.forEach((pipe) => {
    if (checkLinesIntersect(pipe.startX, pipe.startY, pipe.endX, pipe.endY, startX, startY, mouseX, mouseY)) {
      ctx.setLineDash([5, 15]);
      ctx.strokeStyle = "red";
      canCreate = false;
    }
  })

  // draw new pipe
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.moveTo(startX, startY);
  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();
  ctx.restore();
});

canvas.addEventListener("mouseup", (event) => {
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;
  if (!isDrawing) return;
  isDrawing = false;
  if (!canCreate) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //remove drawn line
    drawBackground();
    drawPipeLines(); // draw existing pipes
  } else {
    ctx.closePath();
    pipeLines.push({
      startX: startX,
      startY: startY,
      endX: mouseX,
      endY: mouseY
    })
    drawPipeLines(); // draw existing pipes
  }
});

function drawPipeLines() {
  pipeLines.forEach((pipe) => {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#7b8688"
    ctx.setLineDash([]);
    ctx.moveTo(pipe.startX, pipe.startY);
    ctx.lineTo(pipe.endX, pipe.endY);
    ctx.stroke();
  })
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

const polygons = [];         // Массив для хранения координат многоугольников
const polygonSize = 100;    // Max polygon size

function createOilPolygons() {
  const canvasWidth = 1024;    // Ширина холста
  const canvasHeight = 400;    // Высота холста
  const numPolygons = 4;       // Количество многоугольников
  const polygonGap = Math.floor(canvasWidth / numPolygons);


  for (let i = 0; i < numPolygons; i++) {
    const originX = (polygonGap * i) + Math.floor(Math.random() * (polygonGap - polygonSize));
    const originY = 300 + Math.floor(Math.random() * (canvasHeight - polygonSize));

    const polygonSideNumber = Math.floor(Math.random() * 6 + 5)
    const points = generatePolygon(polygonSideNumber, originX, originY);
    const oilVolume = calculatePolygonArea(points);
    polygons.push({
      points: points,
      oilVolume: oilVolume,
    });

    // Рисование многоугольников
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.closePath();
    ctx.fillStyle = "#211b15";
    ctx.strokeStyle = "#9a4c25";
    ctx.lineWidth = 5;
    ctx.fill();
    ctx.stroke();
  }
}

background.addEventListener('load', drawBackground);

createOilPolygons();

//based on this work https://cglab.ca/~sander/misc/ConvexGeneration/convex.html
function generatePolygon(n = 10, originX = 0, originY = 0) {
  // Step 1: generate two list of random X and Y coordinates
  const xPool = [];
  const yPool = [];
  for (let i = 0; i < n; i++) {
    xPool.push(Math.floor(Math.random() * polygonSize))
    yPool.push(Math.floor(Math.random() * polygonSize))
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

  // // Step 10: Move the polygon to the original min and max coordinates
  for (let i = 0; i < n; i++) {
    let p = points[i];
    points[i] = { x: p.x + originX, y: p.y + originY };
  }

  return points
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let t = array[i]; array[i] = array[j]; array[j] = t
  }
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

  return Math.abs(area / 2);
}

