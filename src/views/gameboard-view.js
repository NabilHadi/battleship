import { createHTMLElement } from "../utils";
import GridItemView from "./grid-item-view";

const GameboardView = (id, classes, boardArray, playerId) => {
  const gameboardDiv = createHTMLElement({ id, classes });
  const boardOverlay = createHTMLElement({
    id: `board-${playerId}-overlay`,
    classes: ["enemy-overlay", "hide"],
  });

  const startGameBtn = createHTMLElement({
    id: `start-game-btn-${playerId}`,
    classes: ["start-game-btn", "btn"],
  });
  startGameBtn.textContent = "START GAME";
  boardOverlay.append(startGameBtn);

  gameboardDiv.append(boardOverlay);

  const boardUnitViews = [];
  let boardUnitShipViews = [];

  for (let boardUnit of boardArray) {
    const boardItemView = GridItemView(
      ["board-unit"],
      boardUnit.x,
      boardUnit.y,
      playerId
    );
    boardUnitViews.push(boardItemView);
    gameboardDiv.append(boardItemView.getView());
  }

  return {
    changeHitStateFor(coordinates, isMissedAttack) {
      const boardUnitView = boardUnitViews.find((v) => {
        return (
          v.getView().dataset.x == coordinates.x &&
          v.getView().dataset.y == coordinates.y
        );
      });

      if (!boardUnitView) return;

      boardUnitView.getView().dataset.isHit = true;
      if (!isMissedAttack) {
        boardUnitView.addHasShip();
        boardUnitShipViews.push(boardUnitView);
      }
    },
    changeShipStateFor(coordinates, hasShip) {
      const boardUnitView = boardUnitViews.find((v) => {
        return (
          v.getView().dataset.x == coordinates.x &&
          v.getView().dataset.y == coordinates.y
        );
      });

      if (!boardUnitView) return;

      if (hasShip) {
        boardUnitView.addHasShip();
        boardUnitShipViews.push(boardUnitView);
      } else {
        boardUnitView.removeHasShip();
        boardUnitShipViews = boardUnitShipViews.filter((unit) => {
          unit === boardUnitView;
        });
      }
    },
    changeShipHintClass(coordinates, hasShip) {
      const boardItemView = boardUnitViews.find((v) => {
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
    removeAllShips() {
      boardUnitViews.forEach((unitView) => {
        unitView.removeHasShip();
      });
    },
    showOverLay() {
      boardOverlay.classList.remove("hide");
    },
    hideOverlay() {
      boardOverlay.classList.add("hide");
    },
    getView() {
      return gameboardDiv;
    },
    getBoardItemViews() {
      return boardUnitViews;
    },
    getStartGameBtn() {
      return startGameBtn;
    },
  };
};

export default GameboardView;
