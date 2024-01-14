class Hangman {
  render(container) {
    const hangman = document.createElement("div");
    hangman.classList.add("hangman");

    hangman.innerHTML = `
      <img class="hangman__gallows" src="assets/gallows.jpg" alt="" />
      <div class="hangman__man">
        <img class="hangman__part hangman__part--head" src="assets/head.svg" alt="" />
        <img class="hangman__part hangman__part--body" src="assets/body.svg" alt="" />
        <img class="hangman__part hangman__part--hand-left" src="assets/hand-left.svg" alt="" />
        <img class="hangman__part hangman__part--hand-right" src="assets/hand-right.svg" alt="" />
        <img class="hangman__part hangman__part--leg-left" src="assets/leg-left.svg" alt="" />
        <img class="hangman__part hangman__part--leg-right" src="assets/leg-right.svg" alt="" />
      </div>
    `

    container.append(hangman);
  }
}

export default Hangman;