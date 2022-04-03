const randomObject = {
  length: 100,
  name: "random",
  health: 55.5,
};

const randomObject2 = {
  ...randomObject,
  age: 26,
  length: 200,
};

console.log(randomObject);
console.log(randomObject2);

export { randomObject };
