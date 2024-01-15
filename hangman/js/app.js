import Hangman from "./hangman.js";
import Keyboard from "./keyboard.js";
import Quiz from "./quiz.js";

class App {
  constructor() {
    this.container = null;
    this.hangman = new Hangman();
    this.keyboard = new Keyboard();
    this.quiz = new Quiz(this.hangman);
  }

  start() {
    this.container = document.querySelector(".container");

    const quizContainer = document.createElement("div");
    quizContainer.classList.add("quiz");

    const keyboardContainer = document.createElement("div");
    keyboardContainer.classList.add("quiz__keyboard");

    // Prepare hangman
    this.hangman.render(this.container);
    //render keyboard
    this.keyboard.init(keyboardContainer);

    // Set up a new quiz question
    this.quiz.setNewQuestion();

    this.quiz.render(quizContainer);

    // Assemble UI
    quizContainer.append(keyboardContainer);
    this.container.append(quizContainer);

    this.quiz.setListeners()
  }

  clear() {
    this.container.innerHTML = "";
  }
}

export default App;