import Gameboard from "./gameboard";
import Player, { AIPlayer } from "./player";

export const EventAggregator = (function () {
  function Event(name) {
    this._handlers = [];
    this.name = name;
  }
  Event.prototype.addHandler = function (handler) {
    this._handlers.push(handler);
  };
  Event.prototype.removeHandler = function (handler) {
    this._handlers = this._handlers.filter((h) => {
      h !== handler;
    });
  };
  Event.prototype.fire = function (eventArgs) {
    this._handlers.forEach(function (h) {
      h(eventArgs);
    });
  };

  const events = [];

  function getEvent(eventName) {
    return events.find((e) => {
      return e.name === eventName;
    });
  }

  return {
    publish(eventName, eventArgs) {
      let event = getEvent(eventName);

      if (!event) {
        event = new Event(eventName);
        events.push(event);
      }

      event.fire(eventArgs);
    },
    subscribe(eventName, handler) {
      let event = getEvent(eventName);

      if (!event) {
        event = new Event(eventName);
        events.push(event);
      }

      event.addHandler(handler);
    },
  };
})();

export const GameModule = (function (boardsSize) {
  const COMPUTER_PLAYED_EVENT = "computerPlayed";
  const PRE_GAME_STAGE_EVENT = "preGame";
  const SHIP_PLACEMENT_STAGE_EVENT = "shipPlacement";
  const GAME_START_EVENT = "gameStart";
  const GAME_END_EVENT = "gameEnded";
  const RESTART_GAME_EVENT = "restartGame";

  const player1 = Player({ name: "Player1", id: 1 });
  const gameboard1 = Gameboard(boardsSize, player1);

  const computerPlayer = AIPlayer("Computer", 2, gameboard1);
  const gameboard2 = Gameboard(boardsSize, computerPlayer);

  let isFirstPlayerTurn = true;

  return {
    player1,
    computerPlayer,
    gameboard1,
    gameboard2,
    get isFirstPlayerTurn() {
      return isFirstPlayerTurn;
    },
    set isFirstPlayerTurn(v) {
      isFirstPlayerTurn = v;
    },
    nextPlayerTurn() {
      isFirstPlayerTurn = false;
      if (!this.checkForWinner()) {
        // computer plays too fast, gotta slow it down a bit
        setTimeout(() => {
          EventAggregator.publish(COMPUTER_PLAYED_EVENT, computerPlayer.play());
          if (gameboard1.isAllShipsSunk()) {
            EventAggregator.publish(GAME_END_EVENT, { winner: computerPlayer });
          }
        }, 300);
      }
    },
    placeShipsOnBoards() {
      gameboard2.placeShipAt(...gameboard1.getValidShipCoordinates(5));
      gameboard2.placeShipAt(...gameboard1.getValidShipCoordinates(4));
      gameboard2.placeShipAt(...gameboard1.getValidShipCoordinates(3));
      gameboard2.placeShipAt(...gameboard1.getValidShipCoordinates(3));
      gameboard2.placeShipAt(...gameboard1.getValidShipCoordinates(2));
    },
    checkForWinner() {
      if (gameboard1.isAllShipsSunk()) {
        EventAggregator.publish(GAME_END_EVENT, { winner: computerPlayer });
        return true;
      } else if (gameboard2.isAllShipsSunk()) {
        EventAggregator.publish(GAME_END_EVENT, { winner: player1 });
        return true;
      }
      return false;
    },
    get COMPUTER_PLAYED_EVENT() {
      return COMPUTER_PLAYED_EVENT;
    },
    get GAME_END_EVENT() {
      return GAME_END_EVENT;
    },
    get PRE_GAME_STAGE_EVENT() {
      return PRE_GAME_STAGE_EVENT;
    },
    get SHIP_PLACEMENT_STAGE_EVENT() {
      return SHIP_PLACEMENT_STAGE_EVENT;
    },
    get GAME_START_EVENT() {
      return GAME_START_EVENT;
    },
    get RESTART_GAME_EVENT() {
      return RESTART_GAME_EVENT;
    },
  };
})(9);
