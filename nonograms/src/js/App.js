import Cross from './Cross/Cross';

export default class App {
  constructor(template) {
    this.cross = new Cross(template);
  }

  start(container) {
    container.appendChild(this.cross.getCross());
  }
}
