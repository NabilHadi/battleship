import GridItemView from "./grid-item-view";

const GameboardView = (id, classes, gameboard, showShips) => {
  const gameboardDiv = document.createElement("div");
  gameboardDiv.setAttribute("id", id);
  gameboardDiv.classList.add(...classes);
  const gameBoardItemViews = [];

  for (let boardUnit of gameboard.getBoard()) {
    const boardItemView = GridItemView(
      ["board-unit"],
      boardUnit.x,
      boardUnit.y,
      gameboard.getPlayerId()
    );

    if (showShips && gameboard.hasShipAt({ x: boardUnit.x, y: boardUnit.y })) {
      boardItemView.addHasShip();
    }
    gameBoardItemViews.push(boardItemView);
    gameboardDiv.append(boardItemView.getView());
  }

  return {
    changeHitStateFor(coordinates, isMissedAttack) {
      const boardItemView = gameBoardItemViews.find((v) => {
        return (
          v.getView().dataset.x == coordinates.x &&
          v.getView().dataset.y == coordinates.y
        );
      });

      boardItemView.getView().dataset.isHit = true;
      if (!isMissedAttack) {
        boardItemView.addHasShip();
      }
    },
    changeShipStateFor(coordinates, hasShip) {
      const boardItemView = gameBoardItemViews.find((v) => {
        return (
          v.getView().dataset.x == coordinates.x &&
          v.getView().dataset.y == coordinates.y
        );
      });

      if (!boardItemView) return;

      if (hasShip) {
        boardItemView.addHasShip();
      } else {
        boardItemView.removeHasShip();
      }
    },
    changeShipHintClass(coordinates, hasShip) {
      const boardItemView = gameBoardItemViews.find((v) => {
        return (
          v.getView().dataset.x == coordinates.x &&
          v.getView().dataset.y == coordinates.y
        );
      });

      if (!boardItemView) return;

      if (hasShip) {
        boardItemView.getView().classList.add("ship-placement-hint");
      } else {
        boardItemView.getView().classList.remove("ship-placement-hint");
      }
    },
    getView() {
      return gameboardDiv;
    },
    getBoardItemViews() {
      return gameBoardItemViews;
    },
  };
};

export default GameboardView;
