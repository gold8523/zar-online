class ClientWorld {
  constructor(game, engine, levelCfg) {
    Object.assign(this, {
      game,
      engine,
      levelCfg,
      height: levelCfg.map.length,
      width: levelCfg.map[0].length,
      worldBlockW: 48,
      worldBlockH: 48,
    });
  }

  // в цикле получаем название ячейки и вызываем функцию рендера
  getWorldMap() {
    const { map } = this.levelCfg;

    map.forEach((mapRow, y) => {
      mapRow.forEach((mapCell, x) => {
        this.engine.renderSpriteFrame({
          sprite: ['terrain', mapCell[0][0]],
          frame: 0,
          x: x * this.worldBlockH,
          y: y * this.worldBlockW,
          w: this.worldBlockW,
          h: this.worldBlockH,
        });
      });
    });
  }

  // запускаем рисование карты
  init() {
    this.getWorldMap();
  }
}

export default ClientWorld;
