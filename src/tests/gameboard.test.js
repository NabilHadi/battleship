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
  });

  test("placeShipAt function updates ships array", () => {
    const gameboard = Gameboard(5);
    expect(gameboard.getShips().length).toBe(0);
    gameboard.placeShipAt({ x: 0, y: 0 });
    expect(gameboard.getShips().length).toBe(1);
    gameboard.placeShipAt({ x: 3, y: 3 });
    expect(gameboard.getShips().length).toBe(2);
  });

  test("placeShipAt function returns false if coordinates already have a ship", () => {
    const gameboard = Gameboard(5);
    expect(gameboard.placeShipAt({ x: 0, y: 0 })).toBe(true);
    expect(gameboard.placeShipAt({ x: 0, y: 0 })).toBe(false);
    expect(gameboard.placeShipAt({ x: 3, y: 3 })).toBe(true);
    expect(gameboard.placeShipAt({ x: 3, y: 3 })).toBe(false);
  });

  test("receiveAttack function works with no ships on board", () => {
    const gameboard = Gameboard(5);
    expect(gameboard.receiveAttack({ x: 1, y: 1 })).toBe(true);
    expect(gameboard.receiveAttack({ x: 3, y: 4 })).toBe(true);
  });

  test("receiveAttack returns false for already hit coordinates", () => {
    const gameboard = Gameboard(5);
    expect(gameboard.receiveAttack({ x: 1, y: 1 })).toBe(true);
    expect(gameboard.receiveAttack({ x: 1, y: 1 })).toBe(false);
    expect(gameboard.receiveAttack({ x: 3, y: 1 })).toBe(true);
    expect(gameboard.receiveAttack({ x: 3, y: 1 })).toBe(false);
  });

  test("receiveAttack updates missedAttacks Array", () => {
    const gameboard = Gameboard(5);
    expect(gameboard.getMissedAttacks().length).toBe(0);
    gameboard.receiveAttack({ x: 2, y: 1 });
    expect(gameboard.getMissedAttacks().length).toBe(1);
    gameboard.receiveAttack({ x: 2, y: 2 });
    expect(gameboard.getMissedAttacks().length).toBe(2);

    gameboard.placeShipAt({ x: 0, y: 0 });
    gameboard.receiveAttack({ x: 0, y: 0 });
    expect(gameboard.getMissedAttacks().length).toBe(2);
  });

  test("receiveAttack updated ship state on successful attack", () => {
    const gameboard = Gameboard(5);
    gameboard.placeShipAt({ x: 1, y: 1 }, { x: 2, y: 1 });
    gameboard.receiveAttack({ x: 1, y: 1 });
    expect(gameboard.getShips()[0].isSunk()).toBe(false);
    gameboard.receiveAttack({ x: 2, y: 1 });
    expect(gameboard.getShips()[0].isSunk()).toBe(true);
  });

  test("isAllShipsSunk returns correct value", () => {
    const gameboard = Gameboard(2);
    gameboard.placeShipAt({ x: 0, y: 0 }, { x: 0, y: 1 });
    gameboard.placeShipAt({ x: 1, y: 1 });

    expect(gameboard.isAllShipsSunk()).toBe(false);

    gameboard.receiveAttack({ x: 0, y: 0 });
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

    gameboard.receiveAttack({ x: 0, y: 0 });
    expect(gameboard.getMissedAttacks().length).toBe(1);
    gameboard.resetBoard();
    expect(gameboard.getMissedAttacks().length).toBe(0);
  });

  test("hasShip returns correct value", () => {
    const gameboard = Gameboard(9);
    gameboard.placeShipAt({ x: 0, y: 5 });
    expect(gameboard.hasShipAt({ x: 0, y: 5 })).toBe(true);
    expect(gameboard.hasShipAt({ x: 5, y: 0 })).toBe(false);
    expect(gameboard.hasShipAt({ x: 4, y: 5 })).toBe(false);
  });
});
