import Ship from "./ship";
import { getRandomCoordinates } from "./utils";

const isWithinBoardRange = (coordinatesArray, maxLength) => {
  return coordinatesArray.every((co) => {
    return co.x >= 0 && co.x < maxLength && co.y >= 0 && co.y < maxLength;
  });
};

const getShipAt = (coordinates, shipsArray) => {
  return shipsArray.find((ship) => {
    const shipCoords = ship.getCoordinates();
    return shipCoords.some((shipCo) => {
      return shipCo.x == coordinates.x && shipCo.y == coordinates.y;
    });
  });
};

const Gameboard = function (size = 0, _player = null) {
  const boardArray = [];
  const shipsArray = [];
  const missedAttacks = [];

  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      boardArray.push({
        y,
        x,
      });
    }
  }

  const canPlaceShipAt = (coordinatesArray) => {
    if (!isWithinBoardRange(coordinatesArray, size)) {
      return false;
    }

    if (
      coordinatesArray.some((coords) => {
        return getShipAt(coords, shipsArray);
      })
    ) {
      return false;
    }

    return true;
  };

  const canAttackAt = (coordinates) => {
    if (!isWithinBoardRange([coordinates], size)) {
      return false;
    }

    const ship = getShipAt(coordinates, shipsArray);
    if (ship && ship.isHitAt(coordinates)) {
      return false;
    }

    const isAlreadyhit = missedAttacks.find(
      (coords) => coords.x === coordinates.x && coords.y === coordinates.y
    );
    if (isAlreadyhit) {
      return false;
    }

    return true;
  };

  return {
    get size() {
      return size;
    },
    get player() {
      return _player;
    },
    canPlaceShipAt(coordinatesArray) {
      if (!isWithinBoardRange(coordinatesArray, size)) {
        return false;
      }

      if (
        coordinatesArray.some((coords) => {
          return getShipAt(coords, shipsArray);
        })
      ) {
        return false;
      }

      return true;
    },
    placeShipAt(...coordinatesArray) {
      if (!canPlaceShipAt(coordinatesArray)) return false;

      const ship = Ship(coordinatesArray);
      shipsArray.push(ship);
      return true;
    },
    getBoard() {
      return [...boardArray];
    },
    getShips() {
      return [...shipsArray];
    },
    hasShipAt(coordinates) {
      return !!getShipAt(coordinates, shipsArray);
    },
    getMissedAttacks() {
      return [...missedAttacks];
    },
    receiveAttack(coordinates) {
      if (!canAttackAt(coordinates)) return false;

      const ship = getShipAt(coordinates, shipsArray);
      if (!ship) {
        missedAttacks.push(coordinates);
        return { isMissedAttack: true };
      } else {
        ship.hit(coordinates);
        return { isMissedAttack: false };
      }
    },
    isAllShipsSunk() {
      return shipsArray.every((ship) => {
        return ship.isSunk();
      });
    },
    resetBoard() {
      shipsArray.length = 0;
      missedAttacks.length = 0;
    },
    getPlayerId() {
      return _player.id;
    },
    getValidShipCoordinates(length) {
      let shipCoordinates = [];
      let randomCoords = getRandomCoordinates(size);
      let isValidCoordinates = false;

      while (!isValidCoordinates) {
        shipCoordinates = [];
        randomCoords = getRandomCoordinates(size);
        if (randomCoords.x + length - 1 < size) {
          for (let i = 0; i < length; i++) {
            shipCoordinates.push({ x: randomCoords.x + i, y: randomCoords.y });
          }
        } else if (randomCoords.x - length >= 0) {
          for (let i = length - 1; i >= 0; i--) {
            shipCoordinates.push({ x: randomCoords.x - i, y: randomCoords.y });
          }
        } else if (randomCoords.y + length - 1 < size) {
          for (let i = 0; i < length; i++) {
            shipCoordinates.push({ x: randomCoords.x, y: randomCoords.y + i });
          }
        } else if (randomCoords.y - length >= 0) {
          for (let i = length - 1; i >= 0; i--) {
            shipCoordinates.push({ x: randomCoords.x, y: randomCoords.y - i });
          }
        }
        isValidCoordinates = canPlaceShipAt(shipCoordinates);
      }
      return shipCoordinates;
    },
  };
};

export default Gameboard;
