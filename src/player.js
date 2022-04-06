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

export default Player;
