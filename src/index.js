import "./styles/style.css";
import DOMController from "./dom";
import { EventAggregator, GameModule } from "./game";

EventAggregator.publish(GameModule.PRE_GAME_STAGE_EVENT);

GameModule.placeShipsOnBoards();

EventAggregator.publish(GameModule.SHIP_PLACEMENT_STAGE_EVENT);

DOMController.setupClickHandlers();
