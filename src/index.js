import "./styles/style.css";
import DOMController from "./dom";
import EventAggregator, {
  PRE_GAME_STAGE_EVENT,
  SHIP_PLACEMENT_STAGE_EVENT,
} from "./eventAggregator";
import Player, { AIPlayer } from "./player";
import Gameboard from "./gameboard";
import { getRandomCoordinates } from "./utils";

let player1 = Player({ name: "You", id: 1 });
let player1Gameboard = Gameboard(10, player1);

let player2 = AIPlayer({
  player: Player({ name: "Computer", id: 2 }),
  nextMoves: [],
  playFunction: function () {
    let coordinates = this.nextMoves.shift();
    if (!coordinates) {
      coordinates = getRandomCoordinates(player1Gameboard.size);
    }
    let response = player1Gameboard.receiveAttack(coordinates);
    while (!response) {
      coordinates = this.nextMoves.shift();
      if (!coordinates) {
        coordinates = getRandomCoordinates(player1Gameboard.size);
      }
      response = player1Gameboard.receiveAttack(coordinates);
    }

    if (!response.isMissedAttack) {
      this.nextMoves.push({ x: coordinates.x + 1, y: coordinates.y });
      this.nextMoves.push({ x: coordinates.x - 1, y: coordinates.y });
      this.nextMoves.push({ x: coordinates.x, y: coordinates.y + 1 });
      this.nextMoves.push({ x: coordinates.x, y: coordinates.y - 1 });
    }

    return {
      coordinates,
      response,
    };
  },
});
let player2Gameboard = Gameboard(10, player2);

EventAggregator.publish(PRE_GAME_STAGE_EVENT, {
  p1: player1,
  p1Gameboard: player1Gameboard,
  p2: player2,
  p2Gameboard: player2Gameboard,
});

DOMController.renderBoards();

EventAggregator.publish(SHIP_PLACEMENT_STAGE_EVENT);

DOMController.setupClickHandlers();
