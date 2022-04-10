import { createHTMLElement } from "../utils";

const ShipView = (id, classes, isVertical, isDraggable, length) => {
  const shipContainer = createHTMLElement({ id, classes });
  shipContainer.dataset.isVertical = isVertical;
  shipContainer.draggable = isDraggable;
  shipContainer.dataset.length = length;

  for (let i = 0; i < length; i++) {
    shipContainer.append(createHTMLElement());
  }

  return {
    getView() {
      return shipContainer;
    },
    addClass(classToAdd) {
      shipContainer.classList.add(classToAdd);
    },
    removeClass(classToRemove) {
      shipContainer.classList.remove(classToRemove);
    },
    setIsVertical(isVertical) {
      shipContainer.dataset.isVertical = isVertical;
    },
  };
};

export default ShipView;
