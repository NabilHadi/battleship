import GameboardView from "./views/gameboard-view";
import GameModule from "./game";
import EventAggregator, {
  COMPUTER_PLAYED_EVENT,
  GAME_END_EVENT,
  GAME_START_EVENT,
  RESTART_GAME_EVENT,
  SHIP_PLACEMENT_STAGE_EVENT,
} from "./eventAggregator";
import ShipView from "./views/ship-view";
import ButtonView from "./views/button-view";
import { createHTMLElement } from "./utils";

const aircraftShip = ShipView({
  id: "aircraft",
  classes: ["ship", "draggable"],
  isVertical: false,
  isDraggable: true,
  length: 5,
});
const battleShip = ShipView({
  id: "battleship",
  classes: ["ship", "draggable"],
  isVertical: false,
  isDraggable: true,
  length: 4,
});
const submarineShip = ShipView({
  id: "submarine",
  classes: ["ship", "draggable"],
  isVertical: false,
  isDraggable: true,
  length: 3,
});
const cruiserShip = ShipView({
  id: "cruiser",
  classes: ["ship", "draggable"],
  isVertical: false,
  isDraggable: true,
  length: 3,
});
const destroyerShip = ShipView({
  id: "destroyer",
  classes: ["ship", "draggable"],
  isVertical: false,
  isDraggable: true,
  length: 2,
});

// DOM Controller
const DOMController = (function (player1ContainerView, player2ContainerView) {
  let player1BoardView;
  let player2BoardView;

  const restartGameBtn = ButtonView({
    id: "restart-game-btn",
    classes: ["btn"],
    textContent: "Restart Game",
    clickHandler: (e) => {
      EventAggregator.publish(RESTART_GAME_EVENT, e);
    },
  });

  const resetShipsBtn = ButtonView({
    id: "reset-ships-btn",
    classes: ["btn"],
    textContent: "Reset Ships",
    clickHandler: () => {
      player1BoardView.removeAllShips();
      GameModule.player1Gameboard.resetBoard();
      setupDraggableShips();
    },
  });

  const firstPlayerShipsContainer = document.querySelector(
    "#first-player-ships"
  );

  const shipsViews = [
    aircraftShip,
    battleShip,
    submarineShip,
    cruiserShip,
    destroyerShip,
  ];

  const randomShipBtn = ButtonView({
    id: "random-ships-btn",
    classes: ["btn"],
    textContent: "Random",
    clickHandler: () => {
      player1BoardView.removeAllShips();
      GameModule.player1Gameboard.resetBoard();
      shipsViews.forEach((shipView) => {
        const coordinates = GameModule.player1Gameboard.getValidShipCoordinates(
          Number(shipView.getView().dataset.length)
        );
        GameModule.player1Gameboard.placeShipAt(...coordinates);
        shipView.isPlaced = true;
        coordinates.forEach((c) => {
          player1BoardView.changeShipStateFor(c, true);
        });
      });
    },
  });

  firstPlayerShipsContainer.append(
    randomShipBtn.getView(),
    resetShipsBtn.getView(),
    restartGameBtn.getView()
  );

  const outputDiv = document.querySelector(".output-msg");

  function setupDraggableShips() {
    shipsViews.forEach((shipView) => {
      shipView.isPlaced = false;
    });

    shipsViews.forEach((shipView) => {
      shipView.getView().addEventListener("dragstart", (e) => {
        outputDiv.textContent = "Hold `shift` to flip the ship";
        e.target.classList.add("dragging");
      });

      shipView.getView().addEventListener("drag", (e) => {
        if (e.shiftKey) {
          shipView.setIsVertical(true);
        } else {
          shipView.setIsVertical(false);
        }
      });

      shipView.getView().addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
        shipView.setIsVertical(false);
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

          const canPlace =
            GameModule.player1Gameboard.canPlaceShipAt(adjacentUnits);
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
          const canPlace = GameModule.player1Gameboard.placeShipAt(
            ...adjacentUnits
          );
          if (canPlace) {
            adjacentUnits.forEach((u) => {
              player1BoardView.changeShipStateFor(u, true);
            });
            const shipView = shipsViews.find(
              (shipView) => shipView.getView().id === dragging.id
            );
            if (shipView) {
              shipView.isPlaced = true;
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

      const respone = GameModule.player2Gameboard.receiveAttack({ x, y });
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

  // render boards function
  function renderBoards() {
    player1BoardView = GameboardView({
      id: "first-player-board",
      classes: ["board"],
      boardArray: GameModule.player1Gameboard.getBoard(),
      playerId: GameModule.player1Gameboard.getPlayerId(),
      startGameClickHandler: null,
    });

    player2BoardView = GameboardView({
      id: "second-player-board",
      classes: ["board"],
      boardArray: GameModule.player2Gameboard.getBoard(),
      playerId: GameModule.player2Gameboard.getPlayerId(),
      startGameClickHandler: () => {
        const isAllShipsPlaced = shipsViews.every(
          (shipsView) => shipsView.isPlaced
        );
        if (isAllShipsPlaced) {
          EventAggregator.publish(GAME_START_EVENT);
        } else {
          outputDiv.textContent = "Please place all ships to start the game";
        }
      },
    });

    player1ContainerView.append(player1BoardView.getView());
    player2ContainerView.append(player2BoardView.getView());
  }

  const gameContinaer = document.querySelector("#game-container");
  const gameOverlay = createHTMLElement({
    id: "game-overlay",
    classes: ["game-overlay", "hide"],
  });
  gameOverlay.append(
    createHTMLElement({
      type: "label",
      id: "name-label",
      textContent: "Enter your name",
    }),
    createHTMLElement({ type: "input", id: "name-input", classes: ["input"] })
  );
  gameContinaer.append(gameOverlay);

  function showGameOverlay() {
    gameOverlay.classList.remove("hide");
  }

  function hideGameOverlay() {
    gameOverlay.classList.add("hide");
  }

  EventAggregator.subscribe(SHIP_PLACEMENT_STAGE_EVENT, () => {
    GameModule.placeShipsOnBoards();
    randomShipBtn.enableBtn();
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
    player2BoardView.enableStartGameBtn();
  });

  EventAggregator.subscribe(GAME_START_EVENT, () => {
    randomShipBtn.disableBtn();
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

  EventAggregator.subscribe(GAME_END_EVENT, (event) => {
    removeClickHandlers();
    outputDiv.textContent = `*** ${event.winner.name} WON!! ***`;
  });

  EventAggregator.subscribe(COMPUTER_PLAYED_EVENT, (event) => {
    if (event.response.isMissedAttack) {
      player1BoardView.changeHitStateFor(event.coordinates, true);
      GameModule.isFirstPlayerTurn = true;
    } else {
      player1BoardView.changeHitStateFor(event.coordinates, false);
      GameModule.nextPlayerTurn();
    }
  });

  EventAggregator.subscribe(RESTART_GAME_EVENT, () => {
    // reset boards
    GameModule.player1Gameboard.resetBoard();
    GameModule.player2Gameboard.resetBoard();
    player1BoardView.resetBoard();
    player2BoardView.resetBoard();
    outputDiv.textContent = "";
    // show overlay
    EventAggregator.publish(SHIP_PLACEMENT_STAGE_EVENT);
  });

  return {
    renderBoards,
    setupClickHandlers,
    removeClickHandlers,
    setupDraggableShips,
    showGameOverlay,
    hideGameOverlay,
  };
})(
  document.querySelector("#first-player-container"),
  document.querySelector("#second-player-container")
);

export default DOMController;
