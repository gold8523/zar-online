import { io } from 'socket.io-client';
import { getTime } from '../common/util';

class ClientChatApi {
  constructor(cfg) {
    Object.assign(this, { ...cfg });
  }

  connect() {
    const { chatUrl } = this;
    const chatForm = document.getElementById('form');
    const chatInput = document.getElementById('input');
    const message = document.querySelector('.message');

    this.io = io(chatUrl);

    console.log('#### chat', this);

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (chatInput) {
        this.io.emit('chat message', chatInput.value);
        chatInput.value = '';
      }
    });

    this.io.emit('start', this.chat.cfg.playerName);

    this.io.on('chat online', (data) => {
      message.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> сейчас online: <span style="color: blue">${data.online}<span></p>`);
    });

    this.io.on('chat connection', (data) => {
      message.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> <span style="color: green">${data.msg}<span></p>`);
    });

    this.io.on('chat message', (data) => {
      if (this.io.id === data.id) {
        message.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> <span style="color: purple">${data.name}: ${data.msg}</span></p>`);
      } else {
        message.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> ${data.name}: ${data.msg}</p>`);
      }
    });

    this.io.on('chat disconnect', (data) => {
      message.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> <span style="color: red">${data.msg}<span></p>`);
    });
  }
}

export default ClientChatApi;
