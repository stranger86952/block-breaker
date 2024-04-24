const canvas = document.getElementById('gameCanvas');
const logo = document.getElementsByClassName('logo-container')[0];
let timer = 10;
function startGame() {
  canvas.style.display = 'block';
  logo.style.display = 'none';
  const button = document.getElementsByClassName('button-container');
  button[0].style.display = 'none';
  const buttons = document.getElementsByTagName('button');
  buttons[0].innerText = 'Restart'
  buttons[1].innerText = 'Home'
  const ctx = canvas.getContext('2d');
  const ballRadius = 10;
  let x = canvas.width / 2;
  let y = canvas.height - 30;
  let dx = 2;
  let dy = -2;
  const paddleHeight = 10;
  const paddleWidth = 150;
  let paddleX = (canvas.width - paddleWidth) / 2;
  let rightPressed = false;
  let leftPressed = false;
  const brickRowCount = 5;
  const brickColumnCount = 10;
  const brickWidth = 70;
  const brickHeight = 20;
  const brickPadding = 5;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;
  let brickFallSpeed = 2;
  let score = 0;
  let bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      bricks[c][r] = { x: brickX, y: brickY, status: 0 };
    }
  }

  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 0 || (1 <= b.status && b.status < 2)) {
          ctx.beginPath();
          ctx.rect(b.x, b.y, brickWidth, brickHeight);
          ctx.fillStyle = `rgba(0, 149, 221, ${2 - b.status})`;
          ctx.fill();
          ctx.closePath();
          if (1 <= b.status && b.status < 2) {
            b.y += brickFallSpeed;
            if (b.y + brickHeight >= canvas.height - paddleHeight) {
              b.status = 2;
            }
          }
        }
      }
    }
  }

  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 0) {
          if (x + ballRadius > b.x && x - ballRadius < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
            dy = -dy;
            if (x < b.x + brickWidth / 2) {
              dx = -Math.abs(dx);
            } else {
              dx = Math.abs(dx);
            }
            b.status = 1;
            score += 1;
          }
        }
      }
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  }

  function drawScore() {
    ctx.font = '32px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 16, canvas.height - 20);
  }

  function finish() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '32px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Game Over!    Your Score: ' + score, canvas.width / 2 - 200, canvas.height / 2 - 40);
    button[0].style.display = 'block';
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 200px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(timer, canvas.width / 2 - 100, canvas.height / 2 + 100);
    if(timer<0){
      finish();
      return;
    }
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        finish();
        return;
      }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
  }

  canvas.addEventListener('click', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if ((1 <= b.status && b.status < 2) && mouseX > b.x && mouseX < b.x + brickWidth && mouseY > b.y && mouseY < b.y + brickHeight) {
          b.status += 0.2;
          score += 2;
          if (b.status === 2) score += 5;
        }
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      leftPressed = true;
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      leftPressed = false;
    }
  });

  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', () => {
    startGame();
    timer = 10;
    setInterval(function () {
      timer--;
    }, 1000);
    const utilityButton = document.getElementById('utilityButton');
    utilityButton.addEventListener('click', () => {
      if (utilityButton.innerText == 'Tutorial') {

      } else {
        logo.style.display = 'block';
        startButton.innerText = 'Start';
        utilityButton.innerText = 'Tutorial';
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  });
});
