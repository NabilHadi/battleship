const Ship = function ({ name, coordinates = [] }) {
  const shipCoordinates = coordinates.map((coords) => {
    return {
      ...coords,
      isHit: false,
    };
  });

  return {
    get name() {
      return name;
    },
    get length() {
      return shipCoordinates.length;
    },
    hit(coords) {
      const fCoords = shipCoordinates.find((value) => {
        return value.x === coords.x && value.y === coords.y;
      });
      return fCoords && (fCoords.isHit = true);
    },
    isHitAt(coords) {
      const hitCoords = shipCoordinates.find((value) => {
        return value.x === coords.x && value.y === coords.y;
      });
      return hitCoords && hitCoords.isHit;
    },
    isSunk() {
      return shipCoordinates.every((value) => {
        return value.isHit === true;
      });
    },
    getHitCoordinates() {
      return shipCoordinates.filter((value) => {
        return value.isHit === true;
      });
    },
    getCoordinates() {
      return shipCoordinates;
    },
  };
};

export default Ship;
