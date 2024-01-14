import App from "./app.js"

window.addEventListener("DOMContentLoaded", function () {
  const container = document.createElement("div");
  container.classList.add("container");
  document.body.append(container);

  const quiz = new App();
  quiz.start();
});