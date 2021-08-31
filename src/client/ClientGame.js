import ClientEngine from './ClientEngine';
import ClientWorld from './ClientWorld';
// import gameObjects from '../configs/gameObjects.json';
import ClientApi from './ClientApi';

// import sprites from '../configs/sprites';
// import levelCfg from '../configs/world.json';

class ClientGame {
  constructor(cfg) {
    Object.assign(this, {
      cfg,
      gameObjects: cfg.gameObjects,
      player: null,
      players: {},
      api: new ClientApi({
        game: this,
        ...cfg.apiCfg,
      }),
      spawnPoint: [],
    });

    this.api.connect();
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
    return new ClientWorld(this, this.engine, this.cfg.world);
  }

  // возвращаем экземпляр мира в метод moveTo() объекта movableObject
  getWorld() {
    return this.map;
  }

  // загружаем спрайты и запускаем отрисовку мира
  initEngine() {
    this.engine.loadSprites(this.cfg.sprites).then(() => {
      this.map.init();
      this.engine.on('render', (_, time) => {
        // eslint-disable-next-line no-unused-expressions
        this.player && this.engine.camera.focusAtGameObject(this.player);
        this.map.render(time);
      });
      // запускаем движок
      this.engine.start();
      this.initKeys();
      this.engine.focus();
      this.api.join(this.cfg.playerName);
    });
  }

  setPlayers(playersList) {
    playersList.forEach((player) => this.createPlayer(player));
  }

  createCurrentPlayer(playerCfg) {
    const playerObj = this.createPlayer(playerCfg);

    this.setPlayer(playerObj);
  }

  createPlayer({ id, col, row, layer, skin, name }) {
    if (!this.players[id]) {
      const cell = this.map.cellAt(col, row);
      const playerObj = cell.createGameObject(
        {
          // eslint-disable-next-line quote-props
          class: 'player',
          type: skin,
          playerId: id,
          playerName: name,
        },
        layer,
      );

      cell.addGameObject(playerObj);

      this.players[id] = playerObj;
    }

    return this.players[id];
  }

  moveMyChar(keyDown, dir) {
    this.api.move(dir);
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

  getPlayerById(id) {
    return this.players[id];
  }

  removePlayerById(id) {
    const player = this.getPlayerById(id);

    if (player) {
      player.detouch();
      delete this.players[id];
    }
  }

  addSpawnPoint(spawnPoint) {
    this.spawnPoint.push(spawnPoint);
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
