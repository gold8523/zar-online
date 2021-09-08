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
  }

  onNewPlayer(player) {
    this.game.createPlayer(player);
  }

  onPlayerMove(moveCfg) {
    const { game } = this;
    const { col, row, oldCol, oldRow, id } = moveCfg;
    const player = game.getPlayerById(id);

    if (player) {
      if (col < oldCol && row === oldRow) {
        player.setState('left');
      } else if (col > oldCol && row === oldRow) {
        player.setState('right');
      } else if (col === oldCol && row < oldRow) {
        player.setState('up');
      } else if (col === oldCol && row > oldRow) {
        player.setState('down');
      }

      player.moveToCellCoord(col, row);
      player.once('motion-stopped', () => player.setState('main'));
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

  chat() {
    const { form, input } = this;
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (input) {
        this.io.emit('chat message', input.value);
        input.value = '';
      }
    });
  }
}

export default ClientApi;
