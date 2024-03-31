import { CarInterface } from '../../api/types/types';
import { BaseComponent } from '../../helpers/BaseComponent';
import { div } from '../../helpers/tags';
import createSVGUse from '../../helpers/createSVGUse';
import styles from './car.module.scss';

export default class Car implements CarInterface {
  public name: string;

  public color: string;

  public id: number;

  private carNode: BaseComponent;

  constructor(carData: CarInterface) {
    this.name = carData.name;
    this.color = carData.color;
    this.id = carData.id;
    const carIMG = createSVGUse('sport_car');
    carIMG.setAttribute('fill', this.color.toString());

    this.carNode = div({ classNames: [styles.car] });
    this.carNode.getNode().append(carIMG);
  }

  public getNode() {
    return this.carNode.getNode();
  }
}
