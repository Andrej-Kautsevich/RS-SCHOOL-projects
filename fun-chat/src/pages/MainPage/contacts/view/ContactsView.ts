import { User } from '../../../../core/socket/types';
import { BaseComponent } from '../../../../utils/BaseComponent';
import { div, input, li, span, ul } from '../../../../utils/tags';
import styles from './ContactsView.module.scss';

export default class ContactsView {
  private contacts: BaseComponent;

  private userList: BaseComponent<HTMLUListElement>;

  private searchInput: BaseComponent<HTMLInputElement>;

  constructor() {
    this.userList = ul({ className: styles.contacts__users });
    this.searchInput = input({ className: styles.contacts__search, type: 'search', placeholder: 'Search...' });
    this.contacts = div({ className: styles.contacts }, this.searchInput, this.userList);
  }

  public getContacts() {
    return this.contacts;
  }

  public getSearchInput() {
    return this.searchInput;
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
