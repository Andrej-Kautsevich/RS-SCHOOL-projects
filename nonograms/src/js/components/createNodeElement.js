function createElement(tag, className, textContent) {
  const element = document.createElement(tag);
  if (className) element.classList.add(...className.split(' '));
  if (textContent) element.textContent = textContent;
  return element;
}

function createButton(className, textContent, clickHandler) {
  const button = createElement('button', className, textContent);
  button.addEventListener('click', clickHandler);
  return button;
}

function createMenuItem(itemClass, textContent, clickHandler, link) {
  const item = createElement('li', itemClass);
  let button;
  if (link) {
    button = createElement('a', 'button button_link', textContent);
    button.setAttribute('href', link);
    button.setAttribute('target', '_blank');
  } else {
    button = createElement('button', 'button', textContent);
    button.addEventListener('click', clickHandler);
  }
  item.append(button);
  return item;
}

export {
  createElement,
  createButton,
  createMenuItem,
};
