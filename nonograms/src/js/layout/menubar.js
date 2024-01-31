function createMenuBar() {
  const menuBar = document.createElement('aside');
  menuBar.classList.add('menu-bar');

  const menuBarLinks = document.createElement('ul');
  menuBarLinks.classList.add('menu-bar__navigation', 'navigation');

  menuBarLinks.innerHTML = `
    <li class="navigation__item">
      <button class="button">Start new game</button>
    </li>
    <li class="navigation__item">
      <button class="button">Score table</button>  
    </li>
    <li class="navigation__item">
      <button class="button">Random</button>
    </li>
    <li class="navigation__item">
      <a
        class="button button_link"
        href="https://nonograms-katana.fandom.com/wiki/Tips_for_solving"
        target="_blank"
        >How to solve?</a
      >
    </li>
  `;

  const settings = document.createElement('div');
  settings.classList.add('menu-bar__settings');
  settings.innerHTML = '<button type="button" class="button button_has-icon"><span class="icon icon_theme-light"></span>Theme</button>';

  menuBar.append(menuBarLinks, settings);

  return menuBar;
}

export default createMenuBar;
