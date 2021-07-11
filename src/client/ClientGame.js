import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';
import sprites from '../configs/sprites';
import levelCfg from '../configs/world.json';

class ClientGame {
  constructor(cfg) {
    Object.assign(this, { cfg });

    this.engine = this.createEngine();
    this.map = this.createWorld();
    this.initEngine();
  }

  // создаем экземпляр движка
  createEngine() {
    return new ClientEngine(document.getElementById(this.cfg.tagId));
  }

  // создаем экземпляр класса мира и передаем контекст, движок, конфиг мира
  createWorld() {
    return new ClientWorld(this, this.engine, levelCfg);
  }

  // загружаем спрайты и запускаем отрисовку мира
  initEngine() {
    this.engine.loadSprites(sprites).then(() => {
      this.engine.on('render', () => {
        this.map.init();
      });
      // запускаем движок
      this.engine.start();
    });
  }

  // создаем экземпляр игры
  static init(cfg) {
    if (!ClientGame.game) {
      ClientGame.game = new ClientGame(cfg);
      // console.log('Game INIt');
    }
  }
}

export default ClientGame;
