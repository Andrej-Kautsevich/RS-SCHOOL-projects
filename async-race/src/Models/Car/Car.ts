/* eslint-disable class-methods-use-this */
import { CarInterface } from '../../types/types';
import { BaseComponent } from '../../helpers/BaseComponent';
import { div } from '../../helpers/tags';
import createSVGUse from '../../helpers/createSVGUse';
import styles from './car.module.scss';
import Engine from '../../api/Engine';
import EngineButtonsView from '../../Views/EngineButtonsView';
import Observer from '../../helpers/Observer';

export default class Car implements CarInterface {
  public name: string;

  public color: string;

  public id: number;

  private carWidth: number = 0;

  private carNode: BaseComponent;

  public engineButtons: EngineButtonsView = new EngineButtonsView();

  private roadTrack: BaseComponent | null = null;

  public observer: Observer<unknown> = Observer.getInstance();

  private animation: Animation | null = null;

  constructor(carData: CarInterface) {
    this.name = carData.name;
    this.color = carData.color;
    this.id = carData.id;
    const carIMG = createSVGUse('car');
    carIMG.setAttribute('fill', this.color.toString());

    this.carNode = div({ classNames: [styles.car] });
    this.carNode.getNode().append(carIMG);

    this.setEngineListeners();
  }

  public getNode() {
    return this.carNode.getNode();
  }

  public setRoad(roadTrack: BaseComponent) {
    this.roadTrack = roadTrack;
  }

  public setCarWidth(carWidth: number) {
    this.carWidth = carWidth;
  }

  private setEngineListeners() {
    this.engineButtons.startButton.addListener('click', () => {
      this.engineButtons.startButton.getNode().disabled = true;
      this.observer.notify('start', this);
    });
    this.engineButtons.stopButton.addListener('click', () => {
      this.engineButtons.startButton.getNode().disabled = false;
      this.engineButtons.stopButton.getNode().disabled = true;
      this.observer.notify('stop', this);
    });
  }

  public async startEngine() {
    const response = await Engine.startStopCarEngine({ id: this.id }, 'started');
    this.engineButtons.stopButton.getNode().disabled = false;
    return response;
  }

  public async drive(duration: number) {
    this.animation = this.setAnimation(duration);
    try {
      await Engine.switchToDriveCarEngine({ id: this.id });
    } catch (error) {
      this.animation.pause();
    }
  }

  public async stop() {
    this.animation?.cancel();
    await Engine.startStopCarEngine({ id: this.id }, 'stopped');
  }

  private setAnimation(duration: number): Animation {
    const roadWidth = this.roadTrack?.getNode().clientWidth;
    if (roadWidth) {
      return this.carNode
        .getNode()
        .animate([{ transform: `translateX(0)` }, { transform: `translateX(${roadWidth - this.carWidth}px)` }], {
          duration,
          fill: 'forwards',
        });
    }
    throw new Error('road is not defined!');
  }
}
