import { io } from 'socket.io-client';
import './index.scss';
import ClientGame from './client/ClientGame';
import { getTime } from './common/util';

// после загрузки страницы создаем экземпляр игры и получаем canvas
window.addEventListener('load', () => {
  const socket = io('https://jsprochat.herokuapp.com/');
  const $form = document.getElementById('nameForm');
  const $putName = document.getElementById('name');
  const $startImg = document.querySelector('.start-game');

  const $chatWrap = document.querySelector('.chat-wrap');

  const $chatForm = document.getElementById('form');
  const $chatInput = document.getElementById('input');
  const $message = document.querySelector('.message');

  let usersOnline;

  const submitForm = (e) => {
    e.preventDefault();

    if ($putName.value) {
      ClientGame.init({
        tagId: 'game',
        myPlayerName: $putName.value,
      });

      socket.emit('start', $putName.value);

      $chatWrap.style.display = 'block';

      $form.removeEventListener('submit', submitForm);
      $startImg.remove();
      // form.remove();
    }
  };

  $form.addEventListener('submit', submitForm);

  $chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($chatInput) {
      console.log('##### =>', $chatInput.value);
      socket.emit('chat message', $chatInput.value);
      $chatInput.value = '';
    }
  });

  socket.on('chat online', (data) => {
    usersOnline = data.names;
    console.log('##### online', usersOnline);
    $message.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> сейчас online: <span style="color: blue">${data.online}<span></p>`);
  });

  socket.on('chat connection', (data) => {
    $message.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> <span style="color: green">${data.msg}<span></p>`);
  });

  socket.on('chat message', (data) => {
    let myMs;
    for (let i = 0; i < usersOnline.length; i++) {
      const { id } = usersOnline[i];
      console.log('#', id);
      if (data.id !== id) {
        myMs = `<p><strong>${getTime(data.time)}</strong> ${data.name}: ${data.msg}</p>`;
      } else {
        myMs = `<p><strong>${getTime(data.time)}</strong> <span style="color: purple">${data.name}: ${data.msg}<span></p>`;
      }
    }
    // if () {
    //   $message.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> <span style="color: purple">${data.msg}<span></p>`);
    // } else {
    $message.insertAdjacentHTML('beforeend', myMs);
    // }
  });

  socket.on('chat disconnect', (data) => {
    $message.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> <span style="color: red">${data.msg}<span></p>`);
  });
});
// import terrainAtlas from './assets/terrain.png';
// import worldCfg from './configs/world.json';
// import sprites from './configs/sprites';
// import DenWalk from './assets/Male-5-Walk.png';

// const canvas = document.getElementById('game');
// const ctx = canvas.getContext('2d');
// const width = canvas.width;
// const height = canvas.height;
// const spriteW = 48;
// const spriteH = 48;
// const shots = 3;
// let cycle = 0;
// let bottomPressed = false;
// let pX = width / 2 - spriteW / 2;
// let pY = height / 2 - spriteH / 2;
// let vector = null;
// let spriteRow = 0;

// const terrain = document.createElement('img');
// terrain.src = terrainAtlas;

// const img = document.createElement('img');
// img.src = DenWalk;

// terrain.addEventListener('load', () => {
//   const { map } = worldCfg;
//   map.forEach((cfgRow, y) => {
//     cfgRow.forEach((cfgCell, x) => {
//       const [sX, sY, sW, sH] = sprites.terrain[cfgCell[0]].frames[0];
//       ctx.drawImage(terrain, sX, sY, sW, sH, x * spriteW, y * spriteH, spriteW, spriteH);
//     });
//   });
// });

// function keyDownHendler(e) {
//   if (e.key === 'Down' || e.key === 'ArrowDown') {
//     bottomPressed = true;
//     vector = 'Down';
//   } else if (e.key === 'Up' || e.key === 'ArrowUp') {
//     bottomPressed = true;
//     vector = 'Up';
//   } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
//     bottomPressed = true;
//     vector = 'Left';
//   } else if (e.key === 'Right' || e.key === 'ArrowRight') {
//     bottomPressed = true;
//     vector = 'Right';
//   }
// }

// function keyUpHendler(e) {
//   if (e.key === 'Down' || e.key === 'ArrowDown') {
//     bottomPressed = false;
//     vector = 'Down';
//   } else if (e.key === 'Up' || e.key === 'ArrowUp') {
//     bottomPressed = false;
//     vector = 'Up';
//   } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
//     bottomPressed = false;
//     vector = 'Left';
//   } else if (e.key === 'Right' || e.key === 'ArrowRight') {
//     bottomPressed = false;
//     vector = 'Right';
//   }
// }

// function move() {
//   cycle = (cycle + 1) % shots;
// }

// document.addEventListener('keydown', keyDownHendler);

// document.addEventListener('keyup', keyUpHendler);

// function walk(timestamp) {
//   if (bottomPressed) {
//     switch (vector) {
//       case 'Down':
//         spriteRow = 0;

//         move();

//         if (pY >= height - spriteH) {
//           pY = height - spriteH;
//         } else {
//           pY += 10;
//         }

//         break;
//       case 'Up':
//         spriteRow = spriteH * 3;

//         move();

//         if (pY <= 0) {
//           pY = 0;
//         } else {
//           pY -= 10;
//         }

//         break;
//       case 'Left':
//         spriteRow = spriteH;

//         move();

//         if (pX <= 0) {
//           pX = 0;
//         } else {
//           pX -= 10;
//         }

//         break;
//       case 'Right':
//         spriteRow = spriteH * 2;

//         move();

//         if (pX >= width - spriteW) {
//           pX = width - spriteW;
//         } else {
//           pX += 10;
//         }
//         break;
//       default:
//         break;
//     }
//   }
//   ctx.clearRect(0, 0, width, height);
//   ctx.drawImage(img, cycle * spriteW, spriteRow, spriteW, spriteH, pX, pY, spriteW, spriteH);

//   window.requestAnimationFrame(walk);
// }

// img.addEventListener('load', () => {
//   window.requestAnimationFrame(walk);
// });
// // console.log('###: INIT :###');
// // console.log('####');
