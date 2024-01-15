import data from "../question.json" assert { type: "json" };

class Quiz {
  constructor(hangman) {
    this.question = null;
    this.guessNumber = 0;
    this.hangman = hangman;
  }

  setNewQuestion() {
    const questionId = Math.floor(Math.random() * data.length);
    this.question = data[questionId];
    console.log(this.question);
  }

  renderAnswer() {
    return new Array(this.question.answer.length).fill(null).map(() => {
      const li = document.createElement('li');
      li.className = "quiz__letter";
      return li;
    });
  }

  renderHint() {
    const hint = this.question.hint;
    const p = document.createElement("p");
    p.className = "quiz__hint";
    p.innerText = hint;
    return p;
  }

  renderGuessCount() {
    const p = document.createElement("p");
    p.className = "quiz__guess-counter";

    const span = document.createElement("span");
    span.className = "quiz__guess-count"
    span.innerText = `${this.guessNumber} / 6`;

    p.append("Incorrect guesses: ", span);
    return p;
  }

  render(container) {
    const wordHTML = document.createElement("ul");
    wordHTML.classList.add("quiz__word");

    const letterElements = this.renderAnswer();
    letterElements.forEach(letterElement => wordHTML.appendChild(letterElement));

    const hint = this.renderHint();
    const guessCounter = this.renderGuessCount();

    container.append(wordHTML, hint, guessCounter);
  }

  setListeners() {
    this.keyboard = document.querySelector('.keyboard');
    this.keyboardKeys = Array.from(this.keyboard.children)
    this.keyboardKeys.forEach((keyButton) => {
      keyButton.addEventListener('click', () => this.handleKeyPress(keyButton))
    })
  }

  // A method to handle the key press event when a key is clicked
  handleKeyPress(keyButton) {
    const key = keyButton.dataset.key;

    if (this.question.answer.toLowerCase().includes(key)) {
      this.revealLetter(key);
    } else {
      this.hangman.drawPart(this.guessNumber++);
      this.updateGuessCounter();
    }

    keyButton.disabled = true;
  }

  revealLetter(letter) {
    const letterElements = document.querySelectorAll('.quiz__letter');
    this.question.answer.split('').forEach((answerLetter, index) => {
      if (answerLetter.toLowerCase() === letter.toLowerCase()) {
        letterElements[index].textContent = answerLetter.toUpperCase();
      }
    });
  }

  updateGuessCounter() {
    const counter = document.querySelector(".quiz__guess-count");
    counter.innerText = `${this.guessNumber} / 6`;
  }
}

export default Quiz;