import { randomObject } from "../index.js";

test("Random Object is defined", () => {
  expect(randomObject).toBeDefined();
});

test("Random Object has length property", () => {
  expect(randomObject.length).toBeDefined();
});
