import GameboardView from "./views/gameboard-view";
import { GameModule, EventAggregator } from "./game";

// DOM Controller
const DOMController = (function (player1ContainerView, player2ContainerView) {
  let player1BoardView;
  let player2BoardView;

  // render boards function
  function renderBoards() {
    player1BoardView = GameboardView(
      "first-player-board",
      ["board"],
      GameModule.gameboard1,
      true
    );
    player2BoardView = GameboardView(
      "second-player-board",
      ["board"],
      GameModule.gameboard2,
      false
    );

    player1ContainerView.append(player1BoardView.getView());
    player2ContainerView.append(player2BoardView.getView());
  }

  function boardClickHandler(evn) {
    if (!evn.target.dataset.x && !evn.target.dataset.y) return;
    evn.stopPropagation();

    const x = Number(evn.target.dataset.x);
    const y = Number(evn.target.dataset.y);
    const playerID = Number(evn.target.dataset.player);

    if (GameModule.isFirstPlayerTurn) {
      if (playerID !== 2) return;

      const respone = GameModule.gameboard2.receiveAttack({ x, y });
      if (!respone) return;

      if (respone.isMissedAttack) {
        player2BoardView.changeHitStateFor({ x, y }, true);
      } else {
        player2BoardView.changeHitStateFor({ x, y }, false);
      }
      GameModule.nextPlayerTurn();
    }
  }

  function setupClickHandlers() {
    player1BoardView.getView().addEventListener("click", boardClickHandler);
    player2BoardView.getView().addEventListener("click", boardClickHandler);
  }

  function removeClickHandlers() {
    player1BoardView.getView().removeEventListener("click", boardClickHandler);
    player2BoardView.getView().removeEventListener("click", boardClickHandler);
  }

  EventAggregator.subscribe(GameModule.GAME_END_EVENT, (event) => {
    removeClickHandlers();
    const outputDiv = document.querySelector(".output-msg");
    outputDiv.textContent = `*** ${event.winner.name} WON!! ***`;
  });

  EventAggregator.subscribe(GameModule.COMPUTER_PLAYED, (event) => {
    if (event.response.isMissedAttack) {
      player1BoardView.changeHitStateFor(event.coordinates, true);
    } else {
      player1BoardView.changeHitStateFor(event.coordinates, false);
    }
    GameModule.isFirstPlayerTurn = true;
  });

  return {
    renderBoards,
    setupClickHandlers,
    removeClickHandlers,
  };
})(
  document.querySelector("#first-player-container"),
  document.querySelector("#second-player-container")
);

export default DOMController;

// 1- render boards on the DOM
// 2- add click lisensers and handlers for boards
// 3- when user clicks on board call recieve attack on that board
// 4- check if attack is either missed shot or seccesful attack on ship
// 5- update board on DOM
