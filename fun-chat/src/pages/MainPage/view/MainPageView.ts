import { BaseComponent } from '../../../utils/BaseComponent';
import { div, main } from '../../../utils/tags';
import styles from './MainPageView.module.scss';

export default class MainPageView {
  private page: BaseComponent;

  private header: BaseComponent;

  private footer: BaseComponent;

  private userList: BaseComponent;

  private dialogWindow: BaseComponent;

  constructor(header: BaseComponent, footer: BaseComponent, userList: BaseComponent, dialogWindow: BaseComponent) {
    this.header = header;
    this.footer = footer;
    this.userList = userList;
    this.dialogWindow = dialogWindow;
    const mainComponent = main({ className: styles.content });
    mainComponent.appendChildren([this.userList.getNode(), this.dialogWindow.getNode()]);

    this.page = div({ classNames: [styles.mainPage] });
    this.page.appendChildren([this.header.getNode(), mainComponent, this.footer.getNode()]);
  }

  public getPage() {
    return this.page.getNode();
  }
}
