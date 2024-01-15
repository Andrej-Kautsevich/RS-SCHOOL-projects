import { quiz } from "./main.js";

class Modal {
  constructor() {
    this.overlay = null;
  }

  openModal(resultText, answerText) {
    this.overlay = document.createElement("div");
    this.overlay.className = "overlay";

    const modal = document.createElement("div");
    modal.className = "modal";

    const result = document.createElement("p");
    result.className = "modal__result";
    result.innerText = resultText;

    const answer = document.createElement("p");
    answer.className = "modal__answer";
    answer.innerText = `Correct answer is ${answerText}`

    const button = document.createElement("button");
    button.className = "button modal__button";
    button.innerText = "Play again";
    button.addEventListener("click", () => this.closeModal())

    modal.append(result, answer, button);
    this.overlay.append(modal);

    document.body.append(this.overlay);
  }

  closeModal() {
    this.overlay.remove();
    quiz.clear();
    quiz.start();
  }
}

export default Modal