import Gameboard from "./gameboard";
import Player, { AIPlayer } from "./player";
import {
  getRandomAdjacentXCoordinates,
  getRandomAdjacentYCoordinates,
} from "./utils";

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
  const COMPUTER_PLAYED = "computerPlayed";
  const GAME_END_EVENT = "gameEnded";

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
      if (gameboard1.isAllShipsSunk()) {
        EventAggregator.publish(GAME_END_EVENT, { winner: computerPlayer });
      } else if (gameboard2.isAllShipsSunk()) {
        EventAggregator.publish(GAME_END_EVENT, { winner: player1 });
      } else {
        // computer plays too fast, gotta slow it down a bit
        setTimeout(() => {
          EventAggregator.publish(COMPUTER_PLAYED, computerPlayer.play());
        }, 300);
      }
    },
    placeShipsOnBoards() {
      gameboard1.placeShipAt(...getRandomAdjacentXCoordinates(3, boardsSize));
      gameboard1.placeShipAt(...getRandomAdjacentXCoordinates(3, boardsSize));
      gameboard1.placeShipAt(...getRandomAdjacentYCoordinates(3, boardsSize));
      gameboard1.placeShipAt(...getRandomAdjacentYCoordinates(3, boardsSize));

      gameboard2.placeShipAt(...getRandomAdjacentXCoordinates(3, boardsSize));
      gameboard2.placeShipAt(...getRandomAdjacentXCoordinates(3, boardsSize));
      gameboard2.placeShipAt(...getRandomAdjacentYCoordinates(3, boardsSize));
      gameboard2.placeShipAt(...getRandomAdjacentYCoordinates(3, boardsSize));
    },
    get COMPUTER_PLAYED() {
      return COMPUTER_PLAYED;
    },
    get GAME_END_EVENT() {
      return GAME_END_EVENT;
    },
  };
})(9);
