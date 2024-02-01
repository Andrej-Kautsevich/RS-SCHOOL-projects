import Cross from './Cross/Cross';
import Timer from './components/Timer';
import GameButtons from './components/GameButtons';
import createMenuBar from './layout/menubar';

export default class App {
  constructor(template) {
    this.timer = new Timer();
    this.gameButtons = new GameButtons();
    this.cross = new Cross(template, this.timer);
  }

  start(container) {
    const cross = this.cross.getCross();
    const timer = this.timer.getTimer();
    const gameButtons = this.gameButtons.getGameButtons();
    const menuBar = createMenuBar();

    container.append(cross, timer, gameButtons, menuBar);
  }
}
