class Modal {
  openModal(resultText, answerText) {
    const overlay = document.createElement("div");
    overlay.className = "overlay";

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

    modal.append(result, answer, button);
    overlay.append(modal);

    document.body.append(overlay);
  }
}

export default Modal