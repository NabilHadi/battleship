import "./styles/style.css";
import DOMController from "./dom";
import { GameModule } from "./game";

GameModule.placeShipsOnBoards();

DOMController.renderBoards();
DOMController.setupClickHandlers();
DOMController.setupDraggableShips();
