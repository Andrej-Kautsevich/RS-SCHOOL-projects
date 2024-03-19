import { Observer } from '../../../../utils/Observer';
import { BaseComponent } from '../../../BaseComponent';
import { div, option, select } from '../../../tags';
import styles from './levelSwitch.module.scss';

export default class LevelSwitch extends BaseComponent {
  private levelSwitch: BaseComponent;

  private levelSwitchInput: BaseComponent<HTMLSelectElement>;

  public levelsObserver = new Observer<number>();

  private roundSwitch: BaseComponent;

  private roundSwitchInput: BaseComponent<HTMLSelectElement>;

  public roundsObserver = new Observer<number>();

  constructor() {
    super({ classNames: [styles.switcher] });

    this.levelSwitch = div({ classNames: [styles.switcher__level, styles.level] });
    this.levelSwitchInput = select(
      {
        classNames: [styles.switcher__level, styles.level__input],
        name: 'level-select',
        id: 'level-select',
        onchange: this.handleSelectLevel.bind(this),
      },
      option({ value: '0', txt: 'level 1' }),
      option({ value: '1', txt: 'level 2' }),
      option({ value: '2', txt: 'level 3' }),
      option({ value: '3', txt: 'level 4' }),
      option({ value: '4', txt: 'level 5' }),
      option({ value: '5', txt: 'level 6' }),
    );
    this.levelSwitch.append(this.levelSwitchInput);

    this.roundSwitch = div({ classNames: [styles.switcher__round, styles.round] });
    this.roundSwitchInput = select({
      classNames: [styles.switcher__round, styles.round__input],
      name: 'round-select',
      id: 'round-select',
      onchange: this.handleSelectRound.bind(this),
    });

    this.roundSwitch.append(this.roundSwitchInput);

    this.appendChildren([this.levelSwitch, this.roundSwitch]);
  }

  private handleSelectLevel() {
    const valueNumber = +this.levelSwitchInput.getNode().value;
    this.levelsObserver.notify(valueNumber);
  }

  private handleSelectRound() {
    const valueNumber = +this.roundSwitchInput.getNode().value;
    this.roundsObserver.notify(valueNumber);
  }

  public renderRoundOptions(roundsNumber: number) {
    this.roundSwitchInput.destroyChildren();
    for (let i = 0; i < roundsNumber; i += 1) {
      const roundOption = option({ value: `${i}`, txt: `round ${i + 1}` });
      this.roundSwitchInput.append(roundOption);
    }
  }
}
