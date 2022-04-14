import EventAggregator, {
  GAME_END_EVENT,
  COMPUTER_PLAYED_EVENT,
  PRE_GAME_STAGE_EVENT,
} from "./eventAggregator";

const GameModule = (function () {
  let player1;
  let player1Gameboard;

  let player2;
  let player2Gameboard;

  EventAggregator.subscribe(
    PRE_GAME_STAGE_EVENT,
    ({ p1, p1Gameboard, p2, p2Gameboard }) => {
      player1 = p1;
      player1Gameboard = p1Gameboard;
      player2 = p2;
      player2Gameboard = p2Gameboard;
    }
  );

  let isFirstPlayerTurn = true;

  return {
    get player1() {
      return player1;
    },
    get player2() {
      return player2;
    },
    get player1Gameboard() {
      return player1Gameboard;
    },
    get player2Gameboard() {
      return player2Gameboard;
    },
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
          EventAggregator.publish(COMPUTER_PLAYED_EVENT, player2.play());
          if (player1Gameboard.isAllShipsSunk()) {
            EventAggregator.publish(GAME_END_EVENT, { winner: player2 });
          }
        }, 600);
      }
    },
    placeShipsOnBoards() {
      player2Gameboard.placeShipAt(
        "Aircraft",
        ...player2Gameboard.getValidShipCoordinates(5)
      );
      player2Gameboard.placeShipAt(
        "Battleship",
        ...player2Gameboard.getValidShipCoordinates(4)
      );
      player2Gameboard.placeShipAt(
        "Submarine",
        ...player2Gameboard.getValidShipCoordinates(3)
      );
      player2Gameboard.placeShipAt(
        "Cruiser",
        ...player2Gameboard.getValidShipCoordinates(3)
      );
      player2Gameboard.placeShipAt(
        "Destroyer",
        ...player2Gameboard.getValidShipCoordinates(2)
      );
    },
    checkForWinner() {
      if (player1Gameboard.isAllShipsSunk()) {
        EventAggregator.publish(GAME_END_EVENT, { winner: player2 });
        return true;
      } else if (player2Gameboard.isAllShipsSunk()) {
        EventAggregator.publish(GAME_END_EVENT, { winner: player1 });
        return true;
      }
      return false;
    },
  };
})();

export default GameModule;
