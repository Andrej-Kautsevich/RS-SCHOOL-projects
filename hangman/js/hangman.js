class Hangman {

  constructor() {
    this.parts = [];
  }

  render(container) {

    const hangman = document.createElement("div");
    hangman.classList.add("hangman");

    hangman.innerHTML = `
      <div class="hangman__wrapper">
        <img class="hangman__gallows" src="assets/gallows.jpg" alt="" />
        <div class="hangman__man">
          <img class="hangman__part hangman__part--head" src="assets/head.svg" alt="" />
          <img class="hangman__part hangman__part--body" src="assets/body.svg" alt="" />
          <img class="hangman__part hangman__part--hand-left" src="assets/hand-left.svg" alt="" />
          <img class="hangman__part hangman__part--hand-right" src="assets/hand-right.svg" alt="" />
          <img class="hangman__part hangman__part--leg-left" src="assets/leg-left.svg" alt="" />
          <img class="hangman__part hangman__part--leg-right" src="assets/leg-right.svg" alt="" />
        </div>
      </div>
    `

    container.append(hangman);
    this.parts = Array.from(document.querySelectorAll('.hangman__part'));
  }

  drawPart(guessNumber) {
    this.hangman = document.querySelector('.hangman__man');
    this.parts = this.hangman.children;

    if (guessNumber >= 0 && guessNumber < this.parts.length) {
      this.parts[guessNumber].classList.add('hangman__part_visible');
    }
  }
}

export default Hangman;