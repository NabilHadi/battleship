import { createHTMLElement } from "../utils";

const ButtonView = ({ id, classes, textContent, clickHandler }) => {
  const button = createHTMLElement({ id, classes, textContent });

  return {
    getView() {
      return button;
    },
    disableBtn() {
      button.removeEventListener("click", clickHandler);
      button.setAttribute("disabled", "");
    },
    enableBtn() {
      button.addEventListener("click", clickHandler);
      button.removeAttribute("disabled");
    },
  };
};

export default ButtonView;
