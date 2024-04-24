import { User } from '../../../../core/socket/types';
import { BaseComponent } from '../../../../utils/BaseComponent';
import { div, li, span, ul } from '../../../../utils/tags';
import styles from './ContactsView.module.scss';

export default class ContactsView {
  private contacts: BaseComponent;

  private userList: BaseComponent<HTMLUListElement>;

  constructor() {
    this.userList = ul({ className: styles.contacts__users });
    this.contacts = div({ className: styles.contacts }, this.userList);
  }

  public getContacts() {
    return this.contacts;
  }

  public drawUser(user: User, unreadMessagesCount?: number) {
    const userItem = li({ className: styles.contacts__user, txt: user.login });
    const userStatusClass = user.isLogined ? styles.contacts__user_active : styles.contacts__user_inactive;
    userItem.addClasses([userStatusClass]);

    if (unreadMessagesCount) {
      const counter = span({ className: styles.contacts__count, txt: `${unreadMessagesCount}` });
      userItem.append(counter);
    }

    this.userList.append(userItem);
    return userItem;
  }

  public clearList() {
    this.userList.destroyChildren();
  }
}
