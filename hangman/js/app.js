import Hangman from "./hangman.js";
import Keyboard from "./keyboard.js";


class App {
  constructor() {
    this.hangman = new Hangman();
    this.keyboard = new Keyboard();
  }

  start() {
    const container = document.querySelector(".container");
    
    const quiz = document.createElement("div");
    quiz.classList.add("quiz");

    const keyboard = document.createElement("div");
    keyboard.classList.add("quiz__keyboard");
    
    //render hangman
    const hangman = this.hangman.render();
    container.innerHTML = hangman;
    //render keyboard
    this.keyboard.init(keyboard);

    quiz.append(keyboard);
    container.append(quiz);
  }
}

export default App;