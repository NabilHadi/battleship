const Player = function ({ name: _name } = {}) {
  return {
    get name() {
      return _name;
    },
  };
};

export default Player;
