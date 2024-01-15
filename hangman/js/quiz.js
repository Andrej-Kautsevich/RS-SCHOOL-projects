import data from "../question.json" assert { type: "json" };
import Modal from "./modal.js";

class Quiz {
  constructor(hangman) {
    this.question = null;
    this.guessNumber = 0;
    this.hangman = hangman;
    this.modal = new Modal();
  }

  setNewQuestion() {
    this.guessNumber = 0;
    let questionId;

    let usedQuestions = JSON.parse(localStorage.getItem("usedQuestions")) || [];
    const availableQuestions = data.filter((_, index) => !usedQuestions.includes(index));

    if (availableQuestions.length === 0) {
      localStorage.removeItem("usedQuestions"); // Reset used questions
      usedQuestions = [];
      questionId = Math.floor(Math.random() * data.length);
    } else {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      questionId = availableQuestions[randomIndex].id;
    }
    
    this.question = data[questionId];

    usedQuestions.push(questionId);
    localStorage.setItem("usedQuestions", JSON.stringify(usedQuestions));

    console.info(`Current answer is -> %c${this.question.answer}`, "color: red");
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
    // Check for game completion after each guess
    this.checkGameEnd();
  }

  // A method to handle the physical keyboard key press
  handlePhysicalKeyPress() {
    window.addEventListener('keypress', (e) => {
      const pressedKey = e.key.toLowerCase();

      if (pressedKey.length === 1 && pressedKey >= 'a' && pressedKey <= 'z') {
        e.preventDefault();
        const keyButton = Array.from(this.keyboard.children)
          .find((keyEl) => keyEl.dataset.key === pressedKey && !keyEl.disabled);

        if (keyButton) {
          this.handleKeyPress(keyButton);
        }
      }
    });
  }

  checkGameEnd() {
    const letterElements = document.querySelectorAll('.quiz__letter');
    // Checking if every letter element has a non-empty textContent
    const allGuessed = Array.from(letterElements).every((element) => element.textContent.trim() !== '');
    if (allGuessed) this.modal.openModal("You win!", this.question.answer);
    if (this.guessNumber > 5) this.modal.openModal("You lost!", this.question.answer);
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