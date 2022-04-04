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

export default Ship;
