const Player = function ({ name, id } = {}) {
  return Object.assign(
    {},
    {
      get name() {
        return name;
      },
      get id() {
        return id;
      },
    }
  );
};

const AIPlayer = function ({ player, nextMoves, playFunction }) {
  return Object.assign({}, player, {
    nextMoves,
    play: playFunction,
  });
};

export default Player;
export { AIPlayer };
