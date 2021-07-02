import './index.scss';
import DenWalk from './assets/Male-5-Walk.png';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const spriteW = 48;
const spriteH = 48;
const shots = 3;
let cycle = 0;
let bottomPressed = false;
let pX = 0;
let pY = 0;
let vector = null;
let spriteRow = 0;

const img = document.createElement('img');
img.src = DenWalk;

function keyDownHendler (e) {
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
};

function keyUpHendler (e) {
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
};

document.addEventListener('keydown', keyDownHendler);

document.addEventListener('keyup', keyUpHendler);

img.addEventListener('load', () => {
    setInterval(() => {
        if (bottomPressed) {
            switch(vector) {
                case 'Down' :
                    spriteRow = 0;
                    move();
                    pY += 10;
                    break;
                case 'Up' :
                    spriteRow = spriteH * 3;
                    move();
                    pY -= 10;
                    break;
                case 'Left' : 
                    spriteRow = spriteH;
                    move();
                    pX -= 10;
                    break;
                case 'Right' :
                    spriteRow = spriteH * 2;
                    move();
                    pX += 10;
                    break;
                default :
                    pX = 300;
                    pY = 300;
            }
        }

        ctx.clearRect(0, 0, 600, 600);
        ctx.drawImage(img, cycle * spriteW, spriteRow, spriteW, spriteH, pX, pY, spriteW, spriteH);
    }, 100);
});
console.log('###: INIT :###');
// console.log('####');
