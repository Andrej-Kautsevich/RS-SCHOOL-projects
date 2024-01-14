class Hangman {
  render() {
    return `
      <div class="hangman">
        <img class="hangman__gallows" src="assets/gallows.jpg" alt="" />
        <div class="hangman__man">
          <img class="hangman__head" src="assets/head.svg" alt="" />
          <img class="hangman__body" src="assets/body.svg" alt="" />
          <img class="hangman__hand-left" src="assets/hand-left.svg" alt="" />
          <img class="hangman__hand-right" src="assets/hand-right.svg" alt="" />
          <img class="hangman__leg-left" src="assets/leg-left.svg" alt="" />
          <img class="hangman__leg-right" src="assets/leg-right.svg" alt="" />
        </div>
      </div>
    `
  }
}

export default Hangman;