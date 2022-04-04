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
      const hitCoords = coordinatesArr.find((value) => {
        return value.x === coords.x && value.y === coords.y;
      });
      return hitCoords && hitCoords.isHit;
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
  const missedAttacks = [];

  for (let x = 0; x < _size; x++) {
    for (let y = 0; y < _size; y++) {
      boardArray.push({
        x,
        y,
      });
    }
  }

  const isWithinBoardRange = (coordinatesArray) => {
    return coordinatesArray.every((co) => {
      return co.x >= 0 && co.x < _size && co.y >= 0 && co.y < _size;
    });
  };

  const getShipAt = (coordinates) => {
    return shipsArray.find((ship) => {
      const shipCoords = ship.getCoordinates();
      return shipCoords.some((shipCo) => {
        return shipCo.x === coordinates.x && shipCo.y === coordinates.y;
      });
    });
  };

  const canPlaceShipAt = (coordinatesArray) => {
    if (!isWithinBoardRange(coordinatesArray)) {
      return {
        canPlaceShip: false,
        reason: `Coordinates (${coordinatesArray}) are out of board range`,
      };
    }

    if (
      coordinatesArray.every((coords) => {
        return getShipAt(coords);
      })
    ) {
      return {
        canPlaceShip: false,
        reason: `Cannot place ship at coordinates (${coordinatesArray}, another ship is in place)`,
      };
    }

    return {
      canPlaceShip: true,
    };
  };

  const canAttackAt = (coordinates) => {
    if (!isWithinBoardRange([coordinates])) {
      return {
        canAttack: false,
        reason: `Coordinates (${coordinates}) are out of board range`,
      };
    }

    const ship = getShipAt(coordinates);
    if (ship && ship.isHitAt(coordinates)) {
      return {
        canAttack: false,
        reason: `Ship at coordinates(${coordinates}) is already hit`,
      };
    }

    return {
      canAttack: true,
    };
  };

  return {
    get size() {
      return _size;
    },
    placeShipAt(...coordinatesArray) {
      const canPlaceShipResponse = canPlaceShipAt(coordinatesArray);
      if (!canPlaceShipResponse.canPlaceShip) {
        return canPlaceShipResponse;
      }
      const ship = Ship(coordinatesArray);
      shipsArray.push(ship);
      return canPlaceShipResponse;
    },
    getBoard() {
      return [...boardArray];
    },
    getShips() {
      return [...shipsArray];
    },
    receiveAttack(coordinates) {
      const canAttackResponse = canAttackAt(coordinates);
      if (!canAttackResponse.canAttack) {
        return canAttackResponse;
      }

      const ship = getShipAt(coordinates);
      if (!ship) {
        missedAttacks.push(coordinates);
        return { ...canAttackResponse, isMissedShot: true };
      }

      ship.hit(coordinates);
      return {
        ...canAttackResponse,
        isMissedShot: false,
      };
    },
    isAllShipsSunk() {
      return shipsArray.every((ship) => {
        return ship.isSunk();
      });
    },
  };
};

export { Ship, Gameboard };
