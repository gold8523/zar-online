import './index.scss';
import DenWalk from './assets/Male-5-Walk.png';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const lingrad = ctx.createLinearGradient(400, 400, 400, 600);
const spriteW = 48;
const spriteH = 48;
const shots = 3;
let cycle = 0;
let bottomPressed = false;
let pX = 280;
let pY = 280;
let vector = null;
let spriteRow = 0;
const waweX = 10;
let waweY = 500;

const img = document.createElement('img');
img.src = DenWalk;

// 100, 150, 120,  140,  150,  150
// xs   ys   xs+20 ys-10 xs+50 ys
function drawWawe(xStart, yStart) {
  const checkX1 = xStart;
  const checkY1 = yStart;
  const checkX2 = xStart + 20;
  const checkY2 = yStart - 10;
  const xEnd = xStart + 50;
  const yEnd = yStart;
  ctx.strokeStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(xStart, yStart);
  ctx.bezierCurveTo(checkX1, checkY1, checkX2, checkY2, xEnd, yEnd);
  ctx.stroke();
}

function moveWawe() {
  if (waweY > 400) {
    for (let i = waweX; i < 600; i += 100) {
      drawWawe(i, waweY);
    }
    for (let i = waweX + 50; i < 600; i += 100) {
      drawWawe(i, waweY + 35);
    }
    for (let i = waweX + 30; i < 600; i += 100) {
      drawWawe(i, waweY + 70);
    }

    for (let i = waweX; i < 600; i += 100) {
      drawWawe(i, waweY + 140);
    }

    waweY -= 10;
  } else {
    waweY = 600;
  }
}

function drawSand() {
  for (let i = 0; i <= 600; i += 8) {
    for (let j = 0; j <= 600; j += 8) {
      if (i % 3 === 0) {
        ctx.fillStyle = '#fcdd76';
      } else {
        ctx.fillStyle = '#ffff99';
      }
      ctx.beginPath();
      ctx.arc(i, j, 8, 0, Math.PI * 2, false);
      ctx.fill();
    }
  }
}

function drawWather() {
  // const lingrad = ctx.createLinearGradient(400, 400, 400, 600);
  lingrad.addColorStop(0.1, 'rgb(51, 204, 255, 0.4)');
  lingrad.addColorStop(0.6, 'rgb(19, 47, 171, 0.9');

  ctx.fillStyle = lingrad;
  ctx.fillRect(0, 400, 600, 600);
}

function keyDownHendler(e) {
  if (e.key === 'Down' || e.key === 'ArrowDown') {
    bottomPressed = true;
    vector = 'Down';
  } else if (e.key === 'Up' || e.key === 'ArrowUp') {
    bottomPressed = true;
    vector = 'Up';
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    bottomPressed = true;
    vector = 'Left';
  } else if (e.key === 'Right' || e.key === 'ArrowRight') {
    bottomPressed = true;
    vector = 'Right';
  }
}

function keyUpHendler(e) {
  if (e.key === 'Down' || e.key === 'ArrowDown') {
    bottomPressed = false;
    vector = 'Down';
  } else if (e.key === 'Up' || e.key === 'ArrowUp') {
    bottomPressed = false;
    vector = 'Up';
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    bottomPressed = false;
    vector = 'Left';
  } else if (e.key === 'Right' || e.key === 'ArrowRight') {
    bottomPressed = false;
    vector = 'Right';
  }
}

function move() {
  cycle = (cycle + 1) % shots;
}

document.addEventListener('keydown', keyDownHendler);

document.addEventListener('keyup', keyUpHendler);

img.addEventListener('load', () => {
  setInterval(() => {
    if (bottomPressed) {
      switch (vector) {
        case 'Down':
          spriteRow = 0;

          move();

          if (pY >= 550) {
            pY = 550;
          } else {
            pY += 10;
          }

          break;
        case 'Up':
          spriteRow = spriteH * 3;

          move();

          if (pY <= 0) {
            pY = 0;
          } else {
            pY -= 10;
          }

          break;
        case 'Left':
          spriteRow = spriteH;

          move();

          if (pX <= 0) {
            pX = 0;
          } else {
            pX -= 10;
          }

          break;
        case 'Right':
          spriteRow = spriteH * 2;

          move();

          if (pX >= 560) {
            pX = 560;
          } else {
            pX += 10;
          }
          break;
        default:
          pX = 300;
          pY = 300;
      }
    }
    ctx.clearRect(0, 0, 600, 600);
    drawSand();
    drawWather();
    moveWawe();
    ctx.drawImage(img, cycle * spriteW, spriteRow, spriteW, spriteH, pX, pY, spriteW, spriteH);
  }, 100);
});
// console.log('###: INIT :###');
// console.log('####');
