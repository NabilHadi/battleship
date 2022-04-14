const Player = function ({ name, id } = {}) {
  return {
    get name() {
      return name;
    },
    get id() {
      return id;
    },
  };
};

const AIPlayer = function ({ player, nextMoves, playFunction }) {
  return {
    ...player,
    nextMoves,
    play: playFunction,
  };
};

export default Player;
export { AIPlayer };
