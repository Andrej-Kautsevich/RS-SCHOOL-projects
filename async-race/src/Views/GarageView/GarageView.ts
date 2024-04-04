import { BaseComponent } from '../../helpers/BaseComponent';
import createSVGUse from '../../helpers/createSVGUse';
import { button, div, h, span } from '../../helpers/tags';
import Car from '../../Models/Car/Car';
import styles from './garageView.module.scss';
import buttonStyles from '../../styles/button.module.scss';
import CreateCarView from './manageCarView/CreateCarView';
import Observer from '../../helpers/Observer';
import UpdateCarView from './manageCarView/updateCarView';
import GarageButtonsView from './garageButtonsVIew/GarageButtonsView';
import { CarInterface } from '../../types/types';
import { ObserverEvents, WINNER_TIME_DISPLAY } from '../../types/enums';

export default class GarageView {
  private garagePage: BaseComponent;

  private garageItems: BaseComponent;

  private title: BaseComponent<HTMLHeadingElement>;

  private pagination: BaseComponent;

  public nextButton: BaseComponent<HTMLButtonElement>;

  public prevButton: BaseComponent<HTMLButtonElement>;

  public garageButtons: GarageButtonsView;

  public createCarForm: CreateCarView;

  public updateCarForm: UpdateCarView;

  public observer: Observer<unknown> = Observer.getInstance();

  constructor() {
    this.garagePage = div({ className: styles.garage });
    this.createCarForm = new CreateCarView();
    this.updateCarForm = new UpdateCarView();
    this.garageButtons = new GarageButtonsView();
    const garageForms = div(
      { classNames: [styles.garage__forms] },
      this.createCarForm.getForm(),
      this.updateCarForm.getForm(),
    );

    this.title = h(2, { className: styles.garage__title, txt: 'Garage' });
    this.garageItems = div({ classNames: [styles.garage__items] });

    this.pagination = div({ classNames: [styles.garage__pagination, styles.pagination] });
    this.prevButton = button({ classNames: [buttonStyles.button], txt: 'Prev' });
    this.nextButton = button({ classNames: [buttonStyles.button], txt: 'Next' });

    this.garagePage.appendChildren([garageForms, this.garageButtons.getNode(), this.title, this.garageItems]);
  }

  private drawCars(cars: Car[]): Car[] {
    this.garageItems.destroyChildren();
    cars.forEach((car) => {
      const garageItem = div({ classNames: [styles.garage__item, styles.car] });
      const info = car.getManageButtons();
      car.manageButtons.deleteBtn.addListener('click', () => {
        this.observer.notify(ObserverEvents.delete, car.id);
      });
      car.manageButtons.selectBtn.addListener('click', () => {
        this.updateCarForm.submitButton.getNode().disabled = false;
        this.observer.notify(ObserverEvents.select, car.id);
      });
      info.append(span({ txt: car.name }));
      const road = div({ className: styles.car__road }, car.getNode(), createSVGUse('flag', [styles.car__flag]));
      garageItem.appendChildren([info, car.engineButtons.getNode(), road]);
      this.garageItems.append(garageItem);

      const carWidth = car.getNode().clientWidth;
      car.setRoad(road);
      car.setCarWidth(carWidth);
    });
    return cars;
  }

  private drawPagination(page: number, totalPages: number): void {
    this.pagination?.destroyChildren();

    const paginationText = span({ classNames: [styles.pagination__text], txt: `Page: ${page} / ${totalPages}` });
    this.prevButton.getNode().disabled = page === 1;
    this.nextButton.getNode().disabled = page === totalPages;

    this.pagination.appendChildren([paginationText, this.prevButton, this.nextButton]);
    this.garagePage.append(this.pagination);
  }

  private drawTitle(totalCars: number): void {
    this.title.setTextContent(`Garage (${totalCars})`);
  }

  public showWinner(car: CarInterface, time: number): void {
    const winnerWrapper = div({ classNames: [styles.garage__winner], txt: `${car.name} wins in time: ${time}s` });
    this.garagePage.append(winnerWrapper);
    setTimeout(() => {
      winnerWrapper.destroy();
    }, WINNER_TIME_DISPLAY);
  }

  public getPage(): HTMLElement {
    return this.garagePage.getNode();
  }

  public renderPage(cars: Car[], currentPage: number, total?: number): Car[] {
    const renderedCars = this.drawCars(cars);
    let totalPages = 1;
    if (total) totalPages = Math.ceil(total / 7);
    this.drawTitle(total ?? 0);
    this.drawPagination(currentPage, totalPages);
    return renderedCars;
  }

  public disableButtons(cars: Car[]): void {
    cars.forEach((car) => {
      car.manageButtons.disableButtons(true);
    });
    this.garageButtons.generateCarsButton.getNode().disabled = true;
    this.garageButtons.startRaceButton.getNode().disabled = true;
    this.createCarForm.submitButton.getNode().disabled = true;
    this.updateCarForm.submitButton.getNode().disabled = true;
  }

  public enableButtons(cars: Car[]): void {
    this.garageButtons.generateCarsButton.getNode().disabled = false;
    cars.forEach((car) => {
      car.manageButtons.disableButtons(false);
      car.engineButtons.resetButtons();
    });
  }

  public toggleVisibility(): void {
    this.garagePage.toggleClass(styles.hidden);
  }
}
