const GameboardView = (id, classes) => {
  const gameboardDiv = document.createElement("div");
  gameboardDiv.setAttribute("id", id);
  gameboardDiv.classList.add(...classes);

  return {
    populateView(gameboardModel) {
      gameboardDiv.innerHTML = "";
      for (let boardUnit of gameboardModel.getBoard()) {
        const boardUnitDiv = document.createElement("div");
        boardUnitDiv.classList.add("board-unit");
        boardUnitDiv.dataset.x = boardUnit.x;
        boardUnitDiv.dataset.y = boardUnit.y;
        boardUnitDiv.dataset.player = gameboardModel.getPlayerId();
        boardUnitDiv.dataset.hasShip = boardUnit.hasShip;
        boardUnitDiv.dataset.isHit = boardUnit.isHit;
        gameboardDiv.append(boardUnitDiv);
      }
    },
    getView() {
      return gameboardDiv;
    },
  };
};

export default GameboardView;
