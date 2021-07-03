import './index.scss';
import DenWalk from './assets/Male-5-Walk.png';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const spriteW = 48;
const spriteH = 48;
const shots = 3;
let cycle = 0;
let bottomPressed = false;
let pX = 280;
let pY = 280;
let vector = null;
let spriteRow = 0;

const img = document.createElement('img');
img.src = DenWalk;

function drawWhater() {
  ctx.beginPath();
  ctx.moveTo(100, 150);
  ctx.bezierCurveTo(100, 150, 120, 140, 150, 150);
  ctx.stroke();
}

function drawWhater1() {
  ctx.beginPath();
  ctx.moveTo(200, 250);
  ctx.bezierCurveTo(200, 250, 220, 240, 250, 250);
  ctx.stroke();
}

function drawWhater2() {
  ctx.beginPath();
  ctx.moveTo(200, 230);
  ctx.bezierCurveTo(200, 230, 220, 220, 250, 230);
  ctx.stroke();
}

function drawWhater3() {
  ctx.beginPath();
  ctx.moveTo(400, 150);
  ctx.bezierCurveTo(400, 150, 420, 140, 450, 150);
  ctx.stroke();
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
    drawWhater();
    drawWhater1();
    drawWhater2();
    drawWhater3();
    ctx.drawImage(img, cycle * spriteW, spriteRow, spriteW, spriteH, pX, pY, spriteW, spriteH);
  }, 100);
});
// console.log('###: INIT :###');
// console.log('####');
