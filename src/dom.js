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

  function setupDraggableShips() {
    const p1Ships = document.querySelectorAll("#first-player-ships .ship");
    p1Ships.forEach((ship) => {
      ship.addEventListener("dragstart", (e) => {
        e.target.classList.add("dragging");
      });

      ship.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
      });
    });

    const p1BoardUnits = document.querySelectorAll(
      `.board-unit[data-player="1"]`
    );

    p1BoardUnits.forEach((unit) => {
      let adjacentUnits = [];

      unit.addEventListener("dragover", (e) => {
        adjacentUnits = [];
        const dragging = document.querySelector(".dragging");
        const length = Number(dragging.dataset.length);
        const x = Number(unit.dataset.x);
        const y = Number(unit.dataset.y);

        if (length > 0) {
          for (let i = 0; i <= length - 1; i++) {
            adjacentUnits.push({ x: x + i, y });
          }

          const canPlace = GameModule.gameboard1.canPlaceShipAt(adjacentUnits);
          if (canPlace) {
            e.preventDefault();
            adjacentUnits.forEach((u) => {
              player1BoardView.changeShipHintClass(u, true);
            });
          }
        }
      });

      unit.addEventListener("dragleave", () => {
        adjacentUnits.forEach((u) => {
          player1BoardView.changeShipHintClass(u, false);
        });
      });

      unit.addEventListener("drop", () => {
        adjacentUnits.forEach((u) => {
          player1BoardView.changeShipHintClass(u, false);
        });
        const dragging = document.querySelector(".dragging");
        const length = Number(dragging.dataset.length);

        if (length > 0) {
          const canPlace = GameModule.gameboard1.placeShipAt(...adjacentUnits);
          if (canPlace) {
            adjacentUnits.forEach((u) => {
              player1BoardView.changeShipStateFor(u, true);
            });
            dragging.remove();
          }
        }
      });
    });
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
    setupDraggableShips,
  };
})(
  document.querySelector("#first-player-container"),
  document.querySelector("#second-player-container")
);

export default DOMController;
