import { BaseComponent } from '../../../../utils/BaseComponent';
import { div, span } from '../../../../utils/tags';
import styles from './ConnectionWaiter.module.scss';

export default class ConnectionWaiterView {
  private modal: BaseComponent;

  private overlay: BaseComponent;

  constructor() {
    this.modal = div({ className: styles.modal });
    this.overlay = this.createOverlay();
  }

  public getOverlay() {
    this.overlay = this.createOverlay();
    return this.overlay;
  }

  public removeOverlay() {
    this.overlay?.destroy();
  }

  private createOverlay() {
    const content = span({ className: styles.modal__content, txt: 'Connection to server...' });
    this.modal.append(content);
    return div({ classNames: [styles.overlay] }, this.modal);
  }
}
