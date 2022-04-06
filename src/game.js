import Gameboard from "./gameboard";
import Player from "./player";

export const DomController = (function () {
  const firstPlayerBoardDiv = document.querySelector("#first-player-board");
  const secondPlayerBoardDiv = document.querySelector("#second-player-board");

  const player1 = Player("Player1");
  const player2 = Player("Player2");

  const gameboard1 = Gameboard(9, player1);
  const gameboard2 = Gameboard(9, player2);

  gameboard1.placeShipAt({ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 });
  gameboard1.placeShipAt({ x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 });

  gameboard2.placeShipAt({ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 });
  gameboard2.placeShipAt({ x: 7, y: 3 }, { x: 6, y: 3 }, { x: 5, y: 3 });

  let isFirstPlayerTurn = true;

  const boardUnitClickHandler = (e) => {
    if (!e.target.dataset.x && !e.target.dataset.y) return;
    e.stopPropagation();

    const x = Number(e.target.dataset.x);
    const y = Number(e.target.dataset.y);
    const targetPlayerNum = Number(e.target.dataset.player);

    if (isFirstPlayerTurn) {
      if (targetPlayerNum !== 2) return;

      const attackResponse = gameboard2.receiveAttack({ x, y });
      console.log(attackResponse);
      DomController.renderSecondPlayerBoard();
    } else {
      if (targetPlayerNum !== 1) return;
      const attackResponse = gameboard1.receiveAttack({ x, y });
      console.log(attackResponse);
      DomController.renderFirstPlayerBoard();
    }
    isFirstPlayerTurn = !isFirstPlayerTurn;
  };

  firstPlayerBoardDiv.addEventListener("click", boardUnitClickHandler);
  secondPlayerBoardDiv.addEventListener("click", boardUnitClickHandler);

  return {
    renderFirstPlayerBoard() {
      firstPlayerBoardDiv.innerHTML = "";
      for (let boardUnit of gameboard1.getBoard()) {
        const boardUnitDiv = document.createElement("div");
        boardUnitDiv.classList.add("board-unit");
        if (boardUnit.hasShip) {
          boardUnitDiv.classList.add("has-ship");
        } else if (boardUnit.isHit) {
          boardUnitDiv.classList.add("is-hit");
        }
        boardUnitDiv.dataset.x = boardUnit.x;
        boardUnitDiv.dataset.y = boardUnit.y;
        boardUnitDiv.dataset.player = 1;
        boardUnitDiv.dataset.hasShip = boardUnit.hasShip;
        boardUnitDiv.dataset.isHit = boardUnit.isHit;
        firstPlayerBoardDiv.append(boardUnitDiv);
      }
    },
    renderSecondPlayerBoard() {
      secondPlayerBoardDiv.innerHTML = "";
      for (let boardUnit of gameboard2.getBoard()) {
        const boardUnitDiv = document.createElement("div");
        boardUnitDiv.classList.add("board-unit");
        if (boardUnit.hasShip) {
          boardUnitDiv.classList.add("has-ship");
        } else if (boardUnit.isHit) {
          boardUnitDiv.classList.add("is-hit");
        }
        boardUnitDiv.dataset.x = boardUnit.x;
        boardUnitDiv.dataset.y = boardUnit.y;
        boardUnitDiv.dataset.player = 2;
        boardUnitDiv.dataset.hasShip = boardUnit.hasShip;
        boardUnitDiv.dataset.isHit = boardUnit.isHit;
        secondPlayerBoardDiv.append(boardUnitDiv);
      }
    },
  };
})();

const Game = function () {
  return {
    getBoards() {
      return "[gameboard1.getBoard(), gameboard2.getBoard()]";
    },
  };
};

export default Game;
