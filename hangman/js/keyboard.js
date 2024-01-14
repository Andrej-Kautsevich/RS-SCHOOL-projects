class Keyboard {
  init(container) {
    const keyboard = document.createElement("div");

    keyboard.classList.add("keyboard");
    keyboard.append(this.createKeys());
    container.append(keyboard);
  };

  createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayout = [
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
      "a", "s", "d", "f", "g", "h", "j", "k", "l",
      "z", "x", "c", "v", "b", "n", "m",
    ];

    keyLayout.forEach(key => {
      const button = document.createElement("button");
      const lineBreak = ["p", "l",].indexOf(key) !== -1;

      button.setAttribute("data-key", key);
      button.classList.add("keyboard__key");

      button.textContent = key.toUpperCase();

      fragment.append(button);

      if (lineBreak) {
        fragment.append(document.createElement("br"));
      }
    });

    return fragment;
  };

};

export default Keyboard;