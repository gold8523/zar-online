import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';
import gameObjects from '../configs/gameObjects.json';

import sprites from '../configs/sprites';
import levelCfg from '../configs/world.json';

class ClientGame {
  constructor(cfg) {
    Object.assign(this, {
      cfg,
      gameObjects,
      player: null,
    });

    this.engine = this.createEngine();
    this.map = this.createWorld();
    this.initEngine();
  }

  setPlayer(player) {
    this.player = player;
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
      this.map.init();
      this.engine.on('render', (_, time) => {
        this.map.render(time);
      });
      // запускаем движок
      this.engine.start();
      this.initKeys();
    });
  }

  moveMyChar(keyDown, x, y) {
    if (keyDown) {
      this.player.moveByCellCoord(x, y, (cell) => cell.findObjectsByType('grass').length);
    }
  }

  initKeys() {
    this.engine.input.onKey({
      ArrowLeft: (keydown) => {
        this.moveMyChar(keydown, -1, 0);
      },
    });
    this.engine.input.onKey({
      ArrowRight: (keydown) => {
        this.moveMyChar(keydown, +1, 0);
      },
    });
    this.engine.input.onKey({
      ArrowDown: (keydown) => {
        this.moveMyChar(keydown, 0, +1);
      },
    });
    this.engine.input.onKey({
      ArrowUp: (keydown) => {
        this.moveMyChar(keydown, 0, -1);
      },
    });
  }

  // создаем экземпляр игры
  static init(cfg) {
    if (!ClientGame.game) {
      ClientGame.game = new ClientGame(cfg);
      console.log('Game INIt');
    }
  }
}

export default ClientGame;
