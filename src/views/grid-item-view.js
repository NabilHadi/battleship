const GridItemView = (classes, x, y, playerId) => {
  const view = document.createElement("div");
  view.classList.add(...classes);
  view.dataset.x = x;
  view.dataset.y = y;
  view.dataset.player = playerId;

  return {
    addHasShip() {
      view.dataset.hasShip = true;
    },
    addIsHit() {
      view.dataset.isHit = true;
    },
    removeHasShip() {
      view.dataset.hasShip = false;
    },
    removeIsHit() {
      view.dataset.isHit = false;
    },
    getView() {
      return view;
    },
  };
};

export default GridItemView;
