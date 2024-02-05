import Cross from './Cross/Cross';
import Timer from './components/Timer';
import GameButtons from './components/GameButtons';
import Modal from './layout/Modal';
import Theme from './layout/Theme';
import nonograms from './nonograms';
// import ScoreModal from './layout/ScoreModal';

export default class App {
  constructor(/* template */) {
    this.timer = new Timer();
    this.cross = new Cross(/* template, */ this.timer);
    this.modal = new Modal();
    // this.winModal = new ScoreModal();
    this.theme = new Theme();
    this.gameButtons = new GameButtons(this.cross, this.modal, this.theme);
  }

  start(container) {
    const crossNode = this.cross.getCross();
    const timerNode = this.timer.getTimer();
    const gameButtons = this.gameButtons.getGameButtons();
    const menuBar = this.gameButtons.getMenuBar();

    container.append(crossNode, timerNode, gameButtons, menuBar);

    this.cross.startNewGame(nonograms[0]);
  }
}
