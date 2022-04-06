import Ship from "./ship";

const isWithinBoardRange = (coordinatesArray, maxLength) => {
  return coordinatesArray.every((co) => {
    return co.x >= 0 && co.x < maxLength && co.y >= 0 && co.y < maxLength;
  });
};

const getShipAt = (coordinates, shipsArray) => {
  return shipsArray.find((ship) => {
    const shipCoords = ship.getCoordinates();
    return shipCoords.some((shipCo) => {
      return shipCo.x === coordinates.x && shipCo.y === coordinates.y;
    });
  });
};

const Gameboard = function (_size = 0, _player = null) {
  const boardArray = [];
  const shipsArray = [];
  const missedAttacks = [];

  for (let x = 0; x < _size; x++) {
    for (let y = 0; y < _size; y++) {
      boardArray.push({
        x,
        y,
        isHit: false,
        hasShip: false,
      });
    }
  }

  const canPlaceShipAt = (coordinatesArray) => {
    if (!isWithinBoardRange(coordinatesArray, _size)) {
      return {
        canPlaceShip: false,
        reason: `Coordinates (${coordinatesArray}) are out of board range`,
      };
    }

    if (
      coordinatesArray.every((coords) => {
        return getShipAt(coords, shipsArray);
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
    if (!isWithinBoardRange([coordinates], _size)) {
      return {
        canAttack: false,
        reason: `Coordinates (${coordinates}) are out of board range`,
      };
    }

    const ship = getShipAt(coordinates, shipsArray);
    if (ship && ship.isHitAt(coordinates)) {
      return {
        canAttack: false,
        reason: `Ship at coordinates(${coordinates}) is already hit`,
      };
    }

    const isAlreadyhit = missedAttacks.find(
      (coords) => coords.x === coordinates.x && coords.y === coordinates.y
    );
    if (isAlreadyhit) {
      return {
        canAttack: false,
        reason: `Coordinates (${coordinates}) is already hit`,
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
    get player() {
      return _player;
    },
    placeShipAt(...coordinatesArray) {
      const canPlaceShipResponse = canPlaceShipAt(coordinatesArray);
      if (!canPlaceShipResponse.canPlaceShip) {
        return canPlaceShipResponse;
      }
      const ship = Ship(coordinatesArray);
      shipsArray.push(ship);
      for (let shipCoords of ship.getCoordinates()) {
        for (let boardCoords of boardArray) {
          if (
            shipCoords.x === boardCoords.x &&
            shipCoords.y === boardCoords.y
          ) {
            boardCoords.hasShip = true;
          }
        }
      }

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

      boardArray.find((coords) => {
        return coords.x === coordinates.x && coords.y === coordinates.y;
      }).isHit = true;

      const ship = getShipAt(coordinates, shipsArray);
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
    resetBoard() {
      shipsArray.length = 0;
      missedAttacks.length = 0;
    },
    getPlayerId() {
      return _player.id;
    },
  };
};

export default Gameboard;
