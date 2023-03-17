const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const rightButton = document.getElementById("rightButton");
const leftButton = document.getElementById("leftButton");
canvas.height = 400;
canvas.width = 720;
// ballmovement

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

const ballRadius = 5;
// paddle
const paddleHeight = 15;
const paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;
// movement
let rightPressed = false;
let leftPressed = false;
// bricks
let brickRowCount = 6;
let brickColumnCount = 10;
let brickWidth = 60;
let brickHeight = 15;
let brickPadding = 5;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];
let score = 0;

let lives = 10;
const mediaQuery = window.matchMedia("(max-width: 600px)");
function screenSize() {
  if (mediaQuery.matches) {
    canvas.height = 240;
    canvas.width = 320;
    brickRowCount = 4;
    brickColumnCount = 8;
    brickWidth = 30;
    brickHeight = 10;
    brickPadding = 5;
  }
}
screenSize();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "orangered";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  drawBricks();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  if (rightPressed) {
    paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 7, 0);
  }
  if (rightPressed) {
    paddleX += 6;
  } else if (leftPressed) {
    paddleX -= 6;
  }
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
    rightButton.classList.add("animate");
    setTimeout(() => {
      rightButton.classList.remove("animate");
    }, 50);
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
    leftButton.classList.add("animate");
    setTimeout(() => {
      leftButton.classList.remove("animate");
    }, 50);
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "orangered";
  ctx.fillText(`Score: ${score}`, 8, 20);
}
function drawLives() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "orangered";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 80, 20);
}

draw();
