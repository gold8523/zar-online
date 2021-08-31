import { io } from 'socket.io-client';

class ClientApi {
  constructor(cfg) {
    Object.assign(this, { ...cfg });
  }

  connect() {
    const { url, path } = this;

    this.io = io(url, { path });

    this.io.on('welcome', this.onWelcome);
    this.io.on('join', this.onJoin.bind(this));
    this.io.on('newPlayer', this.onNewPlayer.bind(this));
    this.io.on('playerMove', this.onPlayerMove.bind(this));
    this.io.on('playerDisconect', this.onPlayerDisconect.bind(this));
  }

  // eslint-disable-next-line class-methods-use-this
  onWelcome(serverStatus) {
    console.log('#### server online', serverStatus);
  }

  // eslint-disable-next-line class-methods-use-this
  onJoin(player) {
    this.game.createCurrentPlayer(player.player);
    this.game.setPlayers(player.playersList);
    console.log('#### player', player);
  }

  onNewPlayer(player) {
    this.game.createPlayer(player);
  }

  // eslint-disable-next-line class-methods-use-this
  onPlayerMove(moveCfg) {
    const { game } = this;
    const { col, row, id } = moveCfg;
    const player = game.getPlayerById(id);

    if (player) {
      player.moveToCellCoord(col, row);
    }
  }

  onPlayerDisconect(id) {
    this.game.removePlayerById(id);
  }

  join(playerName) {
    this.io.emit('join', playerName);
  }

  move(dir) {
    this.io.emit('move', dir);
  }
}

export default ClientApi;
