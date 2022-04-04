const Ship = function (coordinatesArr = []) {
  coordinatesArr = coordinatesArr.map((coords) => {
    return {
      ...coords,
      isHit: false,
    };
  });

  return {
    get length() {
      return coordinatesArr.length;
    },
    hit(coords) {
      coordinatesArr.find((value) => {
        return value.x === coords.x && value.y === coords.y;
      }).isHit = true;
    },
    isHitAt(coords) {
      return coordinatesArr.find((value) => {
        return value.x === coords.x && value.y === coords.y;
      }).isHit;
    },
    isSunk() {
      return coordinatesArr.every((value) => {
        return value.isHit === true;
      });
    },
    getHitCoordinates() {
      return coordinatesArr.filter((value) => {
        return value.isHit === true;
      });
    },
    getCoordinates() {
      return coordinatesArr.map((pos) => {
        return { x: pos.x, y: pos.y };
      });
    },
  };
};

const Gameboard = function (_size = 0) {
  const boardArray = [];
  const shipsArray = [];

  for (let x = 0; x < _size; x++) {
    for (let y = 0; y < _size; y++) {
      boardArray.push({
        x,
        y,
        hasShip: false,
      });
    }
  }

  const isWihinBoardRange = (coords) => {
    return coords.every((co) => {
      return co.x >= 0 && co.x < _size && co.y >= 0 && co.y < _size;
    });
  };

  const hasShipAt = (coordinates) => {
    return shipsArray.some((ship) => {
      const shipCoords = ship.getCoordinates();
      return shipCoords.some((shipCo) => {
        return coordinates.some((co) => {
          return shipCo.x === co.x || shipCo.y === co.y;
        });
      });
    });
  };

  return {
    get size() {
      return _size;
    },
    placeShipAt(...coordinates) {
      if (isWihinBoardRange(coordinates) && !hasShipAt(coordinates)) {
        const ship = Ship(coordinates);
        shipsArray.push(ship);
        coordinates.forEach((co) => {
          boardArray.find(
            (pos) => pos.x === co.x && pos.y === co.y
          ).hasShip = true;
        });
        return true;
      }
      return false;
    },
    getBoard() {
      return [...boardArray];
    },
    getShips() {
      return [...shipsArray];
    },
  };
};

export { Ship, Gameboard };
