import EventAggregator, {
  GAME_END_EVENT,
  COMPUTER_PLAYED_EVENT,
} from "./eventAggregator";
import Gameboard from "./gameboard";
import Player, { AIPlayer } from "./player";

const GameModule = (function (boardsSize) {
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
  };
})(9);

export default GameModule;
