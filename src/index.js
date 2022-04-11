import "./styles/style.css";
import DOMController from "./dom";
import GameModule from "./game";
import EventAggregator, {
  PRE_GAME_STAGE_EVENT,
  SHIP_PLACEMENT_STAGE_EVENT,
} from "./eventAggregator";

EventAggregator.publish(PRE_GAME_STAGE_EVENT);

GameModule.placeShipsOnBoards();

EventAggregator.publish(SHIP_PLACEMENT_STAGE_EVENT);

DOMController.setupClickHandlers();
