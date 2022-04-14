import Ship from "../ship";

describe("Ship Object", () => {
  test("returns ship with name", () => {
    const ship = Ship({
      name: "Hello",
      coordinates: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
    });
    expect(ship.name).toBe("Hello");

    const ship2 = Ship({
      name: "Hello2222",
      coordinates: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
    });
    expect(ship2.name).toBe("Hello2222");
  });

  test("returns correct length", () => {
    const ship = Ship({
      coordinates: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
      ],
    });
    expect(ship.length).toBe(3);
    const ship2 = Ship({
      coordinates: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ],
    });
    expect(ship2.length).toBe(6);
  });

  test("hit function works correctly", () => {
    const ship = Ship({
      coordinates: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
      ],
    });
    ship.hit({ x: 0, y: 0 });
    expect(ship.isHitAt({ x: 0, y: 0 })).toBe(true);
    expect(ship.isHitAt({ x: 0, y: 1 })).toBe(false);
    expect(ship.isHitAt({ x: 0, y: 2 })).toBe(false);
  });

  test("isHitAt function works correctly", () => {
    const ship = Ship({
      coordinates: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
      ],
    });
    expect(ship.isHitAt({ x: 0, y: 0 })).toBe(false);
    expect(ship.isHitAt({ x: 0, y: 1 })).toBe(false);
    ship.hit({ x: 0, y: 2 });
    expect(ship.isHitAt({ x: 0, y: 2 })).toBe(true);
  });

  test("isSunk function returns correct value", () => {
    const ship = Ship({
      coordinates: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
    });
    ship.hit({ x: 1, y: 0 });
    expect(ship.isSunk()).toBe(false);
    ship.hit({ x: 1, y: 1 });
    expect(ship.isSunk()).toBe(false);
    ship.hit({ x: 1, y: 2 });
    expect(ship.isSunk()).toBe(true);
  });

  test("returns correct hit coordinates", () => {
    const ship = Ship({
      coordinates: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
    });
    ship.hit({ x: 1, y: 1 });
    expect(
      ship.getHitCoordinates().every((value) => {
        if (value.x !== 1 || value.y !== 1) {
          return false;
        }
        return value.isHit;
      })
    ).toBe(true);
    const ship2 = Ship({
      coordinates: [
        { x: 5, y: 0 },
        { x: 5, y: 1 },
        { x: 5, y: 2 },
      ],
    });
    expect(ship2.getHitCoordinates().length === 0).toBe(true);
    ship2.hit({ x: 5, y: 1 });
    expect(ship2.getHitCoordinates().length === 0).toBe(false);
    expect(ship2.getHitCoordinates().length === 1).toBe(true);
    ship2.hit({ x: 5, y: 2 });
    expect(ship2.getHitCoordinates().length === 2).toBe(true);
  });
});
