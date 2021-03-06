import Ship from "./ship";
import { getRandomCoordinates } from "./utils";

const isWithinBoardRange = (coordinates, maxLength) => {
  return coordinates.every((co) => {
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
    canPlaceShipAt(coordinates) {
      if (!isWithinBoardRange(coordinates, size)) {
        return false;
      }

      if (
        coordinates.some((coords) => {
          return getShipAt(coords, shipsArray);
        })
      ) {
        return false;
      }

      return true;
    },
    placeShipAt(name, ...coordinates) {
      if (!this.canPlaceShipAt(coordinates)) return false;

      const ship = Ship({ name, coordinates });
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
    getValidShipCoordinatesHZ(length) {
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
        }
        isValidCoordinates = this.canPlaceShipAt(shipCoordinates);
      }
      return shipCoordinates;
    },
    getValidShipCoordinatesVR(length) {
      let shipCoordinates = [];
      let randomCoords = getRandomCoordinates(size);
      let isValidCoordinates = false;

      while (!isValidCoordinates) {
        shipCoordinates = [];
        randomCoords = getRandomCoordinates(size);
        if (randomCoords.y + length - 1 < size) {
          for (let i = 0; i < length; i++) {
            shipCoordinates.push({ x: randomCoords.x, y: randomCoords.y + i });
          }
        } else if (randomCoords.y - length >= 0) {
          for (let i = length - 1; i >= 0; i--) {
            shipCoordinates.push({ x: randomCoords.x, y: randomCoords.y - i });
          }
        }
        isValidCoordinates = this.canPlaceShipAt(shipCoordinates);
      }
      return shipCoordinates;
    },
    getValidShipCoordinates(length) {
      return Math.floor(Math.random() * 2) === 0
        ? this.getValidShipCoordinatesHZ(length)
        : this.getValidShipCoordinatesVR(length);
    },
  };
};

export default Gameboard;
