import Player, { AIPlayer } from "../player";

describe("Player factory", () => {
  test("Returns object with id and name", () => {
    const player = Player({ name: "Hello", id: "52" });
    expect(player.name).toBe("Hello");
    expect(player.id).toBe("52");

    const player2 = Player({ name: "world", id: "42" });
    expect(player2.name).toBe("world");
    expect(player2.id).toBe("42");
  });
});

describe("AIPlayer factory", () => {
  test("Returns object with id and name", () => {
    const aiPlayer = AIPlayer({ player: Player({ name: "Hello", id: "52" }) });
    expect(aiPlayer.name).toBe("Hello");
    expect(aiPlayer.id).toBe("52");

    const aiPlayer2 = AIPlayer({ player: Player({ name: "world", id: "42" }) });
    expect(aiPlayer2.name).toBe("world");
    expect(aiPlayer2.id).toBe("42");
  });

  test("calls play function", () => {
    let isCalled = false;
    const mockPlay = function () {
      isCalled = true;
    };

    const aiPlayer = AIPlayer({
      player: Player({ name: "test", id: "42" }),
      nextMoves: [],
      playFunction: mockPlay,
    });

    aiPlayer.play();

    expect(isCalled).toBe(true);
  });

  test("play function updates nextMoves", () => {
    const mockPlay = function () {
      this.nextMoves.push("test");
    };

    const aiPlayer = AIPlayer({
      player: Player({ name: "test", id: "42" }),
      nextMoves: [],
      playFunction: mockPlay,
    });

    aiPlayer.play();

    expect(aiPlayer.nextMoves[0]).toBe("test");
    expect(aiPlayer.nextMoves.length).toBe(1);
  });
});
