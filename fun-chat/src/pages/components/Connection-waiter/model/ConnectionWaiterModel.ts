import ConnectionWaiterView from '../view/ConnectionWaiterView';

export default class ConnectionWaiterModel {
  private root: HTMLElement;

  private view = new ConnectionWaiterView();

  constructor(root: HTMLElement) {
    this.root = root;
  }

  public showWaiter() {
    this.view.removeOverlay();
    this.root.append(this.view.getOverlay().getNode());
  }

  public hideWaiter() {
    this.view.removeOverlay();
  }
}
