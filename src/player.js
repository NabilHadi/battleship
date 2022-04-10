import { getRandomCoordinates } from "./utils";

const Player = function ({ name: _name, id: _id } = {}) {
  return {
    get name() {
      return _name;
    },
    get id() {
      return _id;
    },
  };
};

export const AIPlayer = function (name, id, enmeyGamebaord) {
  const playerObj = Player({ name, id });
  const nextMoves = [];

  return {
    ...playerObj,
    play() {
      let coordinates = nextMoves.pop();
      if (!coordinates) {
        coordinates = getRandomCoordinates(enmeyGamebaord.size);
      }
      let response = enmeyGamebaord.receiveAttack(coordinates);
      while (!response) {
        coordinates = nextMoves.pop();
        if (!coordinates) {
          coordinates = getRandomCoordinates(enmeyGamebaord.size);
        }
        response = enmeyGamebaord.receiveAttack(coordinates);
      }

      if (!response.isMissedAttack) {
        nextMoves.push({ x: coordinates.x + 1, y: coordinates.y });
        nextMoves.push({ x: coordinates.x - 1, y: coordinates.y });
        nextMoves.push({ x: coordinates.x, y: coordinates.y + 1 });
        nextMoves.push({ x: coordinates.x, y: coordinates.y - 1 });
      }

      return {
        coordinates,
        response,
      };
    },
  };
};

export default Player;
