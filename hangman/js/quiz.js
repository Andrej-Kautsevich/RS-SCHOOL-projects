import data from "../question.json" assert { type: "json" };

class Quiz {
  constructor() {
    this.question;
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

  render(container) {
    const wordHTML = document.createElement("ul");
    wordHTML.classList.add("quiz__word");

    const letterElements = this.renderAnswer();
    letterElements.forEach(letterElement => wordHTML.appendChild(letterElement));

    const hint = this.renderHint();

    container.appendChild(wordHTML);
    container.appendChild(hint);
  }
}

export default Quiz;