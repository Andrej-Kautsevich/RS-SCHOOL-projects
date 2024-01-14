import Hangman from "./hangman.js";
import Keyboard from "./keyboard.js";
import Quiz from "./quiz.js";

class App {
  constructor() {
    this.hangman = new Hangman();
    this.keyboard = new Keyboard();
    this.quiz = new Quiz();
  }

  start() {
    const container = document.querySelector(".container");

    const quizContainer = document.createElement("div");
    quizContainer.classList.add("quiz");

    const keyboardContainer = document.createElement("div");
    keyboardContainer.classList.add("quiz__keyboard");

    // Prepare hangman
    this.hangman.render(container);
    //render keyboard
    this.keyboard.init(keyboardContainer);

    // Set up a new quiz question
    this.quiz.setNewQuestion();

    this.quiz.render(quizContainer);

    // Assemble UI
    quizContainer.append(keyboardContainer);
    container.append(quizContainer);
  }
}

export default App;