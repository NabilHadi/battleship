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

  return {
    ...playerObj,
    play() {
      let coordinates = getRandomCoordinates(enmeyGamebaord.size);
      let response = enmeyGamebaord.receiveAttack(coordinates);
      while (!response) {
        coordinates = getRandomCoordinates(enmeyGamebaord.size);
        response = enmeyGamebaord.receiveAttack(coordinates);
      }
      return {
        coordinates,
        response,
      };
    },
  };
};

export default Player;
