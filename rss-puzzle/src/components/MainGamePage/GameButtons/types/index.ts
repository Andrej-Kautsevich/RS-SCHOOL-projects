import { BaseComponent } from '../../../BaseComponent';

export type GameButton = BaseComponent<HTMLButtonElement>;

enum ButtonName {
  continue = 'Continue',
  check = 'Check',

  complete = 'Complete',

  statistics = 'Statistics',
}

export default ButtonName;
