import Gameboard from "../gameboard";

describe("Gameboard Object", () => {
  test("returns correct board size", () => {
    expect(Gameboard(9).size).toBe(9);
  });

  test("returns correct board state", () => {
    const gameboard = Gameboard(2);
    expect(gameboard.getBoard()[0]).toMatchObject({
      x: 0,
      y: 0,
    });
    gameboard.placeShipAt({ x: 1, y: 1 });
    expect(gameboard.getBoard()[3]).toMatchObject({
      x: 1,
      y: 1,
    });
  });

  test("getShips function returns correct values", () => {
    const gameboard = Gameboard(5);
    expect(gameboard.getShips().length).toBe(0);
    gameboard.placeShipAt({ x: 1, y: 1 });
    const shipsArray = gameboard.getShips();
    expect(shipsArray.length).toBe(1);
    expect(shipsArray[0].getCoordinates()).toContainEqual({
      x: 1,
      y: 1,
    });
  });

  test("placeShipAt function only accepts correct positions", () => {
    const gameboard = Gameboard(5);
    expect(gameboard.placeShipAt({ x: 0, y: 0 })).toMatchObject({
      canPlaceShip: true,
    });
    expect(gameboard.placeShipAt({ x: 5, y: 5 })).toMatchObject({
      canPlaceShip: false,
    });
    expect(gameboard.placeShipAt({ x: 3, y: 3 })).toMatchObject({
      canPlaceShip: true,
    });
    expect(gameboard.placeShipAt({ x: -1, y: 0 })).toMatchObject({
      canPlaceShip: false,
    });
    expect(gameboard.placeShipAt({ x: 4, y: -1 })).toMatchObject({
      canPlaceShip: false,
    });
  });

  test("placeShipAt function returns false if coordinates already have a ship there", () => {
    const gameboard = Gameboard(5);
    expect(gameboard.placeShipAt({ x: 0, y: 0 })).toMatchObject({
      canPlaceShip: true,
    });
    expect(gameboard.placeShipAt({ x: 0, y: 0 })).toMatchObject({
      canPlaceShip: false,
    });
    expect(gameboard.placeShipAt({ x: 3, y: 3 })).toMatchObject({
      canPlaceShip: true,
    });
    expect(gameboard.placeShipAt({ x: 3, y: 3 })).toMatchObject({
      canPlaceShip: false,
    });
  });

  test("placeShipAt function works correctly", () => {
    const gameboard = Gameboard(5);
    gameboard.placeShipAt({ x: 4, y: 3 });
    expect(gameboard.getShips().length).toBe(1);
    gameboard.placeShipAt({ x: 4, y: 3 });
    expect(gameboard.getShips().length).toBe(1);
    gameboard.placeShipAt({ x: 3, y: 3 });
    expect(gameboard.getShips().length).toBe(2);
  });

  test("receiveAttack function works with no ships", () => {
    const gameboard = Gameboard(5);
    gameboard.receiveAttack({ x: 1, y: 1 });
  });

  test("receiveAttack function accepts only valid coordinates", () => {
    const gameboard = Gameboard(5);
    gameboard.placeShipAt({ x: 0, y: 0 }, { x: 1, y: 1 });
    expect(gameboard.receiveAttack({ x: 1, y: 1 })).toMatchObject({
      canAttack: true,
    });
    expect(gameboard.receiveAttack({ x: 5, y: 10 })).toMatchObject({
      canAttack: false,
    });
    expect(gameboard.receiveAttack({ x: 0, y: 0 })).toMatchObject({
      canAttack: true,
    });
  });

  test("receiveAttack function reports correct missed attack", () => {
    const gameboard = Gameboard(5);
    gameboard.placeShipAt({ x: 1, y: 1 });
    expect(gameboard.receiveAttack({ x: 2, y: 1 })).toMatchObject({
      isMissedShot: true,
    });
    expect(gameboard.receiveAttack({ x: 1, y: 2 })).toMatchObject({
      isMissedShot: true,
    });
    expect(gameboard.receiveAttack({ x: 1, y: 1 })).toMatchObject({
      isMissedShot: false,
    });
  });

  test("receiveAttack function reports correct hit attack", () => {
    const gameboard = Gameboard(5);
    gameboard.placeShipAt({ x: 1, y: 1 }, { x: 2, y: 1 });
    expect(gameboard.receiveAttack({ x: 1, y: 1 })).toMatchObject({
      isMissedShot: false,
      canAttack: true,
    });
    expect(gameboard.receiveAttack({ x: 2, y: 1 })).toMatchObject({
      isMissedShot: false,
      canAttack: true,
    });
    expect(gameboard.receiveAttack({ x: 2, y: 1 })).toMatchObject({
      canAttack: false,
    });
  });

  test("receiveAttack function reports if coordinates is already hit", () => {
    const gameboard = Gameboard(5);
    gameboard.placeShipAt({ x: 1, y: 1 }, { x: 2, y: 1 });
    expect(gameboard.receiveAttack({ x: 0, y: 0 })).toMatchObject({
      canAttack: true,
      isMissedShot: true,
    });
    expect(gameboard.receiveAttack({ x: 0, y: 0 })).toMatchObject({
      canAttack: false,
    });
    expect(gameboard.receiveAttack({ x: 2, y: 1 })).toMatchObject({
      canAttack: true,
    });
    expect(gameboard.receiveAttack({ x: 2, y: 1 })).toMatchObject({
      canAttack: false,
    });
  });

  test("isAllShipsSunk returns correct value", () => {
    const gameboard = Gameboard(2);
    gameboard.placeShipAt({ x: 0, y: 0 });
    gameboard.placeShipAt({ x: 0, y: 1 });
    gameboard.placeShipAt({ x: 1, y: 1 });
    expect(gameboard.isAllShipsSunk()).toBe(false);
    gameboard.receiveAttack({ x: 0, y: 0 });
    expect(gameboard.isAllShipsSunk()).toBe(false);
    gameboard.receiveAttack({ x: 0, y: 1 });
    expect(gameboard.isAllShipsSunk()).toBe(false);
    gameboard.receiveAttack({ x: 1, y: 1 });
    expect(gameboard.isAllShipsSunk()).toBe(true);

    const gameboard2 = Gameboard(2);
    gameboard2.placeShipAt({ x: 0, y: 0 }, { x: 0, y: 1 });
    expect(gameboard2.isAllShipsSunk()).toBe(false);
    gameboard2.receiveAttack({ x: 0, y: 0 });
    expect(gameboard2.isAllShipsSunk()).toBe(false);
    gameboard2.receiveAttack({ x: 0, y: 1 });
    expect(gameboard2.isAllShipsSunk()).toBe(true);
  });

  test("resetBoard resets the board", () => {
    const gameboard = Gameboard(2);
    gameboard.placeShipAt({ x: 0, y: 0 }, { x: 0, y: 1 });
    expect(gameboard.getShips().length).toBe(1);
    gameboard.resetBoard();
    expect(gameboard.getShips().length).toBe(0);
  });
});
