function createElement(tag, className, ...content) {
  const element = document.createElement(tag);
  if (className) element.classList.add(...className.split(' '));
  if (typeof content === 'string' || typeof content === 'number') {
    element.textContent = content;
  } else if (content) element.append(...content);
  return element;
}

function createButton(className, textContent, clickHandler) {
  let button;
  if (textContent) {
    button = createElement('button', className, textContent);
  } else {
    button = createElement('button', className);
  }
  button.addEventListener('click', clickHandler);
  return button;
}

function createMenuItem(className, textContent, clickHandler, link) {
  const item = createElement('li', className);
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

function createScoreTableItem(className, number, templateName, time) {
  const row = createElement('tr', `${className}__score`);
  const itemNumber = createElement('td', `${className}__number`, number);
  const name = createElement('td', `${className}__name`, templateName);
  const score = createElement('td', `${className}__time`, time);

  row.append(itemNumber, name, score);
  return row;
}

export {
  createElement,
  createButton,
  createMenuItem,
  createScoreTableItem,
};
