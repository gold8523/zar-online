import './index.scss';
import DenWalk from './assets/Male-5-Walk.png';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const lingrad = ctx.createLinearGradient(400, 400, 400, 600);
const spriteW = 48;
const spriteH = 48;
const shots = 3;
let cycle = 0;
let bottomPressed = false;
let pX = width / 2 - spriteW / 2;
let pY = height / 2 - spriteH / 2;
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

function moveWawe(numWawe) {
  let nextWaweX = waweX;
  let nextWaweY = waweY;
  for (let j = 0; j < numWawe; j += 1) {
    if (waweY > 400) {
      for (let i = nextWaweX; i < width; i += 100) {
        drawWawe(i, nextWaweY);
        if (j % 2 === 0) {
          nextWaweX = 50;
        } else if (j % 3 === 1) {
          nextWaweX = 25;
        } else {
          nextWaweX = 10;
        }
      }
      // for (let i = waweX + 50; i < width; i += 100) {
      //   drawWawe(i, waweY + 35);
      // }
      // for (let i = waweX + 30; i < width; i += 100) {
      //   drawWawe(i, waweY + 70);
      // }
      // for (let i = waweX; i < width; i += 100) {
      //   drawWawe(i, waweY + 140);
      // }
      waweY -= 1;
    } else {
      waweY = height;
    }
    nextWaweY += 35;
  }
}

function drawSand() {
  for (let i = 0; i <= width; i += 8) {
    for (let j = 0; j <= height; j += 8) {
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

          if (pY >= height - spriteH) {
            pY = height - spriteH;
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

          if (pX >= width - spriteW) {
            pX = width - spriteW;
          } else {
            pX += 10;
          }
          break;
        default:
          break;
      }
    }
    ctx.clearRect(0, 0, width, height);
    drawSand();
    drawWather();
    moveWawe(8);
    ctx.drawImage(img, cycle * spriteW, spriteRow, spriteW, spriteH, pX, pY, spriteW, spriteH);
  }, 150);
});
// console.log('###: INIT :###');
// console.log('####');
