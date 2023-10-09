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
  startX = event.pageX - canvas.offsetLeft;
  startY = event.pageY - canvas.offsetTop;
  if (startY < 400) {
    return;
  }
  isDrawing = true;
  console.log(startY);
});

canvas.addEventListener("mousemove", (event) => {
  if (!isDrawing) return;

  const mouseX = event.pageX - canvas.offsetLeft;
  const mouseY = event.pageY - canvas.offsetTop;

  ctx.setLineDash([]); // возвращает обратно к сплошной линии
  ctx.strokeStyle = "white"; // возвращаем начальный цвет
  canCreate = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawPipeLines(); // draw existing pipes

  if (mouseY < 400) {
    ctx.setLineDash([5, 15]); // создает пунктирный паттерн: 5px образующей линии, 15px промежутка
    ctx.strokeStyle = "red";
    canCreate = false;
  }

  pipeLines.forEach((pipe) => {
    if (linesIntersect(pipe.startX, pipe.startY, pipe.endX, pipe.endY, startX, startY, mouseX, mouseY)) {
      ctx.setLineDash([5, 15]);
      ctx.strokeStyle = "red";
      canCreate = false;
    }
  })

  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.moveTo(startX, startY);
  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();
  ctx.restore();
});

canvas.addEventListener("mouseup", (event) => {
  const mouseX = event.pageX - canvas.offsetLeft;
  const mouseY = event.pageY - canvas.offsetTop;
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
function linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
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




background.addEventListener('load', drawBackground);

