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
    return new ClientEngine(document.getElementById(this.cfg.tagId), this);
  }

  // создаем экземпляр класса мира и передаем контекст, движок, конфиг мира
  createWorld() {
    return new ClientWorld(this, this.engine, levelCfg);
  }

  // возвращаем экземпляр мира в метод moveTo() объекта movableObject
  getWorld() {
    return this.map;
  }

  // загружаем спрайты и запускаем отрисовку мира
  initEngine() {
    this.engine.loadSprites(sprites).then(() => {
      this.map.init();
      this.engine.on('render', (_, time) => {
        this.engine.camera.focusAtGameObject(this.player);
        this.map.render(time);
      });
      // запускаем движок
      this.engine.start();
      this.initKeys();
    });
  }

  moveMyChar(keyDown, dir) {
    const { player } = this;
    const dirs = {
      left: [-1, 0],
      right: [+1, 0],
      up: [0, -1],
      down: [0, +1],
    };

    if (player && player.motionProgress === 1) {
      // eslint-disable-next-line arrow-body-style
      const canMove = player.moveByCellCoord(dirs[dir][0], dirs[dir][1], (cell) => {
        return cell.findObjectsByType('grass').length;
      });

      if (canMove) {
        player.setState(dir);
        player.once('motion-stopped', () => player.setState('main'));
      }
    }
  }

  initKeys() {
    this.engine.input.onKey({
      ArrowLeft: (keydown) => {
        this.moveMyChar(keydown, 'left');
      },
    });
    this.engine.input.onKey({
      ArrowRight: (keydown) => {
        this.moveMyChar(keydown, 'right');
      },
    });
    this.engine.input.onKey({
      ArrowDown: (keydown) => {
        this.moveMyChar(keydown, 'down');
      },
    });
    this.engine.input.onKey({
      ArrowUp: (keydown) => {
        this.moveMyChar(keydown, 'up');
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
