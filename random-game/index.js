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

  ctx.translate(0, background.height) //translate to ground start

  for (let i = 0; i < numPolygons; i++) {
    const shiftX = (polygonGap * i) + Math.floor(Math.random() * (polygonGap - polygonSize));
    console.log(shiftX)
  }



  // Рисование многоугольников
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);  // Очистка холста

  polygons.forEach((polygon) => {


    ctx.beginPath();
    ctx.moveTo(polygon[0].x, polygon[0].y);

    for (let i = 1; i < polygon.length; i++) {
      ctx.lineTo(polygon[i].x, polygon[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = "#211b15";
    ctx.fill();
  });
}

// background.addEventListener('load', drawBackground);

// createOilPolygons();

//based on this work https://cglab.ca/~sander/misc/ConvexGeneration/convex.html
function generatePolygon(numPoints = 10) {
  // Step 1: generate two list of random X and Y coordinates
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: Math.floor(Math.random() * polygonSize),
      y: Math.floor(Math.random() * polygonSize),
    });
  }
  console.log(points)

  // Step 2: sort them (here by x coordinate for starting point in Graham scan algorithm)
  const sortedPoints = points.sort((a, b) => a.x - b.x);

  // Step 3: isolate the extreme points
  const minXPoint = sortedPoints[0]; // leftmost
  const maxXPoint = sortedPoints[sortedPoints.length - 1]; // rightmost

  // Step 4: randomly divide the interior points into two chains (not sure the purpose here)
  let leftChain = [];
  let rightChain = [];
  for (let i = 1; i < sortedPoints.length - 1; i++) {
    if (Math.random() > 0.5) {
      leftChain.push(sortedPoints[i]);
    } else {
      rightChain.push(sortedPoints[i]);
    }
  }

  // Steps 5-7: seems to be about mixing coordinates, not applicable in this simplified context

  // Step 8: Sort the vectors by angle
  // No 'vectors' yet, we can sort points by angle from the starting point
  const pointsSortedByAngle = sortedPoints.slice(1).sort((a, b) => {
    const angleA = Math.atan2(a.y - minXPoint.y, a.x - minXPoint.x);
    const angleB = Math.atan2(b.y - minXPoint.y, b.x - minXPoint.x);

    return angleA - angleB;
  });
  pointsSortedByAngle.unshift(minXPoint); // add starting point in front

  // Step 9: Lay them end-to-end to form a polygon (simple convex polygon)
  let polygon = [pointsSortedByAngle[0], pointsSortedByAngle[1]];
  for (let i = 2; i < pointsSortedByAngle.length; i++) {
    while (polygon.length >= 2 && crossProduct(polygon[polygon.length - 2], polygon[polygon.length - 1], pointsSortedByAngle[i]) <= 0) {
      polygon.pop();
    }
    polygon.push(pointsSortedByAngle[i]);
  }

  // Step 10: Move the polygon to the original min and max coordinates (here I just translate them)
  const shiftX = minXPoint.x;
  const shiftY = minXPoint.y;
  const shiftedPolygon = polygon.map(point => ({ x: point.x - shiftX, y: point.y - shiftY }));

  polygons.push(shiftedPolygon);

  return shiftedPolygon;

}

function crossProduct(point1, point2, point3) {
  return (point2.x - point1.x) * (point3.y - point1.y) - (point2.y - point1.y) * (point3.x - point1.x);
}

console.log(generatePolygon());

createOilPolygons();