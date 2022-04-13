import "./styles/style.css";
import DOMController from "./dom";
import EventAggregator, {
  PRE_GAME_STAGE_EVENT,
  SHIP_PLACEMENT_STAGE_EVENT,
} from "./eventAggregator";
import Player, { AIPlayer } from "./player";
import Gameboard from "./gameboard";

let player1 = Player({ name: "You", id: 1 });
let player1Gameboard = Gameboard(10, player1);

let player2 = AIPlayer("Computer", 2, player1Gameboard);
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
