import Cross from './Cross/Cross';

export default class App {
  constructor(template, timer) {
    this.cross = new Cross(template, timer);
  }

  start(container) {
    container.appendChild(this.cross.getCross());
  }
}
