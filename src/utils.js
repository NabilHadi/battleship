const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};

export const getRandomCoordinates = (boardSize) => {
  return {
    x: getRandomNumber(boardSize),
    y: getRandomNumber(boardSize),
  };
};

export const getRandomAdjacentXCoordinates = (length, boardSize) => {
  let x1 = getRandomNumber(boardSize);
  let y = getRandomNumber(boardSize);

  while (boardSize < x1 + length && boardSize > x1 - length) {
    x1 = getRandomNumber(boardSize);
  }

  const coordinates = [];
  if (boardSize > x1 + length) {
    for (let i = 0; i < length; i++) {
      coordinates.push({ x: x1 + i, y });
    }
  } else if (boardSize < x1 - length) {
    for (let i = 0; i < length; i++) {
      coordinates.push({ x: x1 - i, y });
    }
  }

  return coordinates;
};

export const getRandomAdjacentYCoordinates = (length, boardSize) => {
  let y1 = getRandomNumber(boardSize);
  let x = getRandomNumber(boardSize);

  while (boardSize <= y1 + length && boardSize >= y1 - length) {
    y1 = getRandomNumber(boardSize);
  }

  const coordinates = [];
  if (boardSize > y1 + length) {
    for (let i = 0; i < length; i++) {
      coordinates.push({ x, y: y1 + i });
    }
  } else if (boardSize < y1 - length) {
    for (let i = 0; i < length; i++) {
      coordinates.push({ x, y: y1 - i });
    }
  }

  return coordinates;
};

export const createHTMLElement = ({
  type = "div",
  id = "",
  classes = [],
  textContent = "",
} = {}) => {
  const e = document.createElement(type);
  e.id = id;
  e.classList.add(...classes);
  e.textContent = textContent;
  return e;
};
