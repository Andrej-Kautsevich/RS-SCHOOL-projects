import { button, div, form, input, label } from '../tags';
import styles from './userNameEntry.module.scss';
import buttonStyles from '../../styles/button.module.scss';

const UserNameEntry = () => {
  return div(
    [styles.userEntry],
    form(
      [styles.userEntryForm, styles.form],
      label([styles.formLabel], 'First Name:', input([styles.formInput], 'text', 'userFirstName', { required: true })),
      label([styles.formLabel], 'Surname:', input([styles.formInput], 'text', 'userSurname', { required: true })),
      button([styles.formButton, buttonStyles.button], 'Submit', 'submit', { disabled: true }),
    ),
  );
};

export default UserNameEntry;
