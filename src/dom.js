import GameboardView from "./views/gameboard-view";
import { GameModule, EventAggregator } from "./game";
import ShipView from "./views/ship-view";
import ButtonView from "./views/button-view";

const aircraftShip = ShipView(
  "aircraft",
  ["ship", "draggable"],
  false,
  true,
  5
);
const battleShip = ShipView(
  "battleship",
  ["ship", "draggable"],
  false,
  true,
  4
);
const submarineShip = ShipView(
  "submarine",
  ["ship", "draggable"],
  false,
  true,
  3
);
const cruiserShip = ShipView("cruiser", ["ship", "draggable"], false, true, 3);
const destroyerShip = ShipView(
  "destroyer",
  ["ship", "draggable"],
  false,
  true,
  2
);

// DOM Controller
const DOMController = (function (player1ContainerView, player2ContainerView) {
  let player1BoardView;
  let player2BoardView;

  const shipsViews = [
    aircraftShip,
    battleShip,
    submarineShip,
    cruiserShip,
    destroyerShip,
  ];

  const outputDiv = document.querySelector(".output-msg");

  // render boards function
  function renderBoards() {
    player1BoardView = GameboardView(
      "first-player-board",
      ["board"],
      GameModule.gameboard1.getBoard(),
      GameModule.gameboard1.getPlayerId()
    );
    player2BoardView = GameboardView(
      "second-player-board",
      ["board"],
      GameModule.gameboard2.getBoard(),
      GameModule.gameboard2.getPlayerId()
    );

    player1ContainerView.append(player1BoardView.getView());
    player2ContainerView.append(player2BoardView.getView());
  }

  const restartGameBtn = ButtonView({
    id: "restart-game-btn",
    classes: ["btn"],
    textContent: "Restart Game",
    clickHandler: (e) => {
      EventAggregator.publish(GameModule.RESTART_GAME_EVENT, e);
    },
  });

  const resetShipsBtn = ButtonView({
    id: "reset-ships-btn",
    classes: ["btn"],
    textContent: "Reset Ships",
    clickHandler: () => {
      player1BoardView.removeAllShips();
      GameModule.gameboard1.resetBoard();
      setupDraggableShips();
    },
  });

  const firstPlayerShipsContainer = document.querySelector(
    "#first-player-ships"
  );

  firstPlayerShipsContainer.append(
    restartGameBtn.getView(),
    resetShipsBtn.getView()
  );

  function setupDraggableShips() {
    shipsViews.forEach((shipView) => {
      shipView.removeClass("hide-draggable-ship");
    });

    shipsViews.forEach((shipView) => {
      shipView.getView().addEventListener("dragstart", (e) => {
        outputDiv.textContent = "Hold `shift` to flip the ship";
        e.target.classList.add("dragging");
      });

      shipView.getView().addEventListener("drag", (e) => {
        if (e.shiftKey) {
          shipView.getView().dataset.isVertical = true;
        } else {
          shipView.getView().dataset.isVertical = false;
        }
      });

      shipView.getView().addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
        shipView.getView().dataset.isVertical = false;
      });
    });

    const p1BoardUnits = document.querySelectorAll(
      `.board-unit[data-player="1"]`
    );

    p1BoardUnits.forEach((unit) => {
      let adjacentUnits = [];

      function resetAdjacentUnits() {
        adjacentUnits.forEach((u) => {
          player1BoardView.changeShipHintClass(u, false);
        });
        adjacentUnits = [];
      }

      unit.addEventListener("dragover", (e) => {
        const dragging = document.querySelector(".dragging");
        const length = Number(dragging.dataset.length);
        const x = Number(unit.dataset.x);
        const y = Number(unit.dataset.y);

        if (length > 0) {
          resetAdjacentUnits();
          if (dragging.dataset.isVertical === "true") {
            for (let i = 0; i <= length - 1; i++) {
              adjacentUnits.push({ x: x, y: y + i });
            }
          } else {
            for (let i = 0; i <= length - 1; i++) {
              adjacentUnits.push({ x: x + i, y });
            }
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
        resetAdjacentUnits();
      });

      unit.addEventListener("drop", () => {
        const dragging = document.querySelector(".dragging");
        const length = Number(dragging.dataset.length);

        if (length > 0) {
          const canPlace = GameModule.gameboard1.placeShipAt(...adjacentUnits);
          if (canPlace) {
            adjacentUnits.forEach((u) => {
              player1BoardView.changeShipStateFor(u, true);
            });
            const shipView = shipsViews.find(
              (shipView) => shipView.getView().id === dragging.id
            );
            if (shipView) {
              shipView.addClass("hide-draggable-ship");
            }
          }
        }
        resetAdjacentUnits();
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
        GameModule.nextPlayerTurn();
      } else {
        player2BoardView.changeHitStateFor({ x, y }, false);
        GameModule.checkForWinner();
      }
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

  EventAggregator.subscribe(GameModule.PRE_GAME_STAGE_EVENT, () => {
    renderBoards();
  });

  EventAggregator.subscribe(GameModule.SHIP_PLACEMENT_STAGE_EVENT, () => {
    // disable restart game button
    restartGameBtn.disableBtn();
    const p1ShipsContainer = document.querySelector(
      "#first-player-ships #ships-container"
    );

    p1ShipsContainer.append(
      ...shipsViews.map((shipView) => shipView.getView())
    );
    setupDraggableShips();
    resetShipsBtn.enableBtn();
    player2BoardView.showOverLay();
    player2BoardView.getStartGameBtn().addEventListener("click", () => {
      const isAllShipsPlaced = shipsViews.every((shipsView) =>
        shipsView.getView().classList.contains("hide-draggable-ship")
      );
      if (isAllShipsPlaced) {
        EventAggregator.publish(GameModule.GAME_START_EVENT);
      } else {
        outputDiv.textContent = "Please place all ships to start the game";
      }
    });
  });

  EventAggregator.subscribe(GameModule.GAME_START_EVENT, () => {
    // disable resetShips button
    resetShipsBtn.disableBtn();
    // hide enemyOverlay
    player2BoardView.hideOverlay();
    // set up click handlers
    setupClickHandlers();
    outputDiv.textContent = "Game started";
    // enable restart game button
    restartGameBtn.enableBtn();
    GameModule.isFirstPlayerTurn = true;
  });

  EventAggregator.subscribe(GameModule.GAME_END_EVENT, (event) => {
    removeClickHandlers();
    outputDiv.textContent = `*** ${event.winner.name} WON!! ***`;
  });

  EventAggregator.subscribe(GameModule.COMPUTER_PLAYED_EVENT, (event) => {
    if (event.response.isMissedAttack) {
      player1BoardView.changeHitStateFor(event.coordinates, true);
      GameModule.isFirstPlayerTurn = true;
    } else {
      player1BoardView.changeHitStateFor(event.coordinates, false);
      GameModule.nextPlayerTurn();
    }
  });

  EventAggregator.subscribe(GameModule.RESTART_GAME_EVENT, () => {
    // reset boards
    GameModule.gameboard1.resetBoard();
    GameModule.gameboard2.resetBoard();
    player1BoardView.resetBoard();
    player2BoardView.resetBoard();
    GameModule.placeShipsOnBoards();
    outputDiv.textContent = "";
    // show overlay
    EventAggregator.publish(GameModule.SHIP_PLACEMENT_STAGE_EVENT);
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
