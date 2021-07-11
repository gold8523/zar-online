import EventSourceMixin from '../common/EventSourceMixin';

// класс движка
class ClientEngine {
  constructor(canvas) {
    Object.assign(this, {
      canvas,
      ctx: null,
      imageLoaders: [],
      sprites: {},
      images: {},
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

    this.ctx.drawImage(img, fx, fy, fw, fh, x, y, w, h);
  }
}

Object.assign(ClientEngine.prototype, EventSourceMixin);

export default ClientEngine;
