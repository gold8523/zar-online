import EventSourceMixin from '../common/EventSourceMixin';
import { clamp } from '../common/util';
import ClientCamera from './ClientCamera';
import ClientInput from './ClientInput';

// класс движка
class ClientEngine {
  constructor(canvas, game) {
    Object.assign(this, {
      canvas,
      canvases: { main: canvas },
      ctx: null,
      imageLoaders: [],
      sprites: {},
      images: {},
      camera: new ClientCamera({ canvas, engine: this }),
      input: new ClientInput(canvas),
      game,
      lastRenderTime: 0,
      startTime: 0,
    });

    this.ctx = canvas.getContext('2d');

    // указываем контекст циклу анимации
    this.loop = this.loop.bind(this);
  }

  // запускаем наш движок
  start() {
    this.loop();
  }

  // бесконечный вызов анимации
  loop(timestamp) {
    if (!this.startTime) {
      this.startTime = timestamp;
    }

    this.lastRenderTime = timestamp;

    const { canvas, ctx } = this;
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.trigger('render', timestamp);
    // вызов следующего шага анимации
    this.initNextFrame();
  }

  // вызов следующего шага анимации
  initNextFrame() {
    window.requestAnimationFrame(this.loop);
  }

  // загрузчик спрайтов
  loadSprites(spritesGroup) {
    this.imageLoaders = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const groupName in spritesGroup) {
      if ({}.hasOwnProperty.call(spritesGroup, groupName)) {
        const group = spritesGroup[groupName];
        this.sprites[groupName] = group;

        // eslint-disable-next-line no-restricted-syntax
        for (const spriteName in group) {
          if ({}.hasOwnProperty.call(group, spriteName)) {
            const { img } = group[spriteName];

            if (!this.images[img]) {
              this.imageLoaders.push(this.loadImage(img));
            }
          }
        }
      }
    }

    // дожидаемся загрузки всех спрайтов и возвращаем их
    return Promise.all(this.imageLoaders);
  }

  // загрузчик изображений
  loadImage(url) {
    return new Promise((resolve) => {
      const i = new Image();
      this.images[url] = i;
      i.onload = () => resolve(i);
      i.src = url;
    });
  }

  // функция отрисовывает изображения
  renderSpriteFrame({ sprite, frame, x, y, w, h }) {
    // получаем название ячейки спрайта
    const spriteCfg = this.sprites[sprite[0]][sprite[1]];
    // записываем координаты нужного участка спрайта
    const [fx, fy, fw, fh] = spriteCfg.frames[frame];
    // запиываем картинку из файла
    const img = this.images[spriteCfg.img];
    // получаем камеру(объект)
    const camera = this.camera;

    this.ctx.drawImage(img, fx, fy, fw, fh, x - camera.x, y - camera.y, w, h);
  }

  addCanvas(name, width, height) {
    let canvas = this.canvases[name];

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      this.canvases[name] = canvas;
    }

    return canvas;
  }

  switchCanvas(name) {
    const canvas = this.canvases[name];

    if (canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
    }

    return canvas;
  }

  focus() {
    this.canvases.main.focus();
  }

  renderCanvas(name, fromPos, toPos) {
    const canvas = this.canvases[name];

    if (canvas) {
      this.ctx.drawImage(canvas, fromPos.x, fromPos.y, fromPos.width, fromPos.height, toPos.x, toPos.y, toPos.width, toPos.height);
    }
  }

  renderSign(opt) {
    const options = {
      color: 'Black',
      bgColor: '#f4f4f4',
      font: '16px sans-serif',
      verticalPadding: 5,
      horizontalPadding: 3,
      textAlign: 'center',
      textBaseLine: 'center',
      ...opt,
    };

    const { ctx, camera } = this;

    ctx.textBaseLine = options.textBaseLine;
    ctx.textAlign = options.textAlign;
    ctx.font = options.font;

    const measure = ctx.measureText(options.text);
    const textHeight = measure.actualBoundingBoxAscent;

    const barWidth = clamp(measure.width + 2 * options.horizontalPadding, options.minWidth, options.maxWidth);
    const barHeight = textHeight + 2 * options.verticalPadding;

    const barX = options.x - barWidth / 2 - camera.x;
    const barY = options.y - barHeight / 2 - camera.y;

    const textWidth = clamp(measure.width, 0, barWidth - 2 * options.horizontalPadding);

    ctx.fillStyle = options.bgColor;
    ctx.fillRect(barX, barY, barWidth, barHeight);

    ctx.fillStyle = options.color;
    ctx.fillText(options.text, barX + barWidth / 2, barY + barHeight - options.verticalPadding, textWidth);
  }
}

Object.assign(ClientEngine.prototype, EventSourceMixin);

export default ClientEngine;
