import Gameboard from "./gameboard";
import Player from "./player";
import GameboardView from "./views/gameboard-view";

export const DomController = (function () {
  const player1 = Player({ name: "Player1", id: 1 });
  const player2 = Player({ name: "Player2", id: 2 });

  const gameboard1 = Gameboard(9, player1);
  const gameboard2 = Gameboard(9, player2);

  gameboard1.placeShipAt({ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 });
  gameboard1.placeShipAt({ x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 });

  gameboard2.placeShipAt({ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 });
  gameboard2.placeShipAt({ x: 7, y: 3 }, { x: 6, y: 3 }, { x: 5, y: 3 });

  const firstPlayerBoardView = GameboardView("first-player-board", ["board"]);
  const secondPlayerBoardView = GameboardView("second-player-board", ["board"]);

  firstPlayerBoardView.populateView(gameboard1);
  secondPlayerBoardView.populateView(gameboard2);

  const firstPlayerContainerView = document.querySelector(
    "#first-player-container"
  );
  const secondPlayerContainerView = document.querySelector(
    "#second-player-container"
  );

  firstPlayerContainerView.append(firstPlayerBoardView.getView());
  secondPlayerContainerView.append(secondPlayerBoardView.getView());

  let isFirstPlayerTurn = true;

  const boardClickHandler = (e) => {
    if (!e.target.dataset.x && !e.target.dataset.y) return;
    e.stopPropagation();

    const x = Number(e.target.dataset.x);
    const y = Number(e.target.dataset.y);
    const playerNum = Number(e.target.dataset.player);

    if (isFirstPlayerTurn) {
      if (playerNum !== 2) return;

      const attackResponse = gameboard2.receiveAttack({ x, y });
      console.log(attackResponse);
      secondPlayerBoardView.populateView(gameboard2);
    } else {
      if (playerNum !== 1) return;
      const attackResponse = gameboard1.receiveAttack({ x, y });
      console.log(attackResponse);
      firstPlayerBoardView.populateView(gameboard1);
    }
    isFirstPlayerTurn = !isFirstPlayerTurn;
  };

  firstPlayerBoardView.getView().addEventListener("click", boardClickHandler);
  secondPlayerBoardView.getView().addEventListener("click", boardClickHandler);

  return {};
})();

const Game = function () {
  return {
    getBoards() {
      return "[gameboard1.getBoard(), gameboard2.getBoard()]";
    },
  };
};

export default Game;
