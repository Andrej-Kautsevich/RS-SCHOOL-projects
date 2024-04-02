import WinnersModel from '../Models/WinnersModel';
import { WinnersQueryParams } from '../types/types';
import WinnersView from '../Views/WinnersView/WinnersView';

export default class WinnersController {
  private winnersModel: WinnersModel;

  private winnersView: WinnersView;

  public currentPage: number = 1;

  constructor() {
    this.winnersModel = new WinnersModel();
    this.winnersView = new WinnersView();
    this.init();
  }

  private setPaginationListeners() {
    this.winnersView.prevButton.addListener('click', () => {
      this.currentPage -= 1;
      this.renderPage();
    });
    this.winnersView.nextButton.addListener('click', () => {
      this.currentPage += 1;
      this.renderPage();
    });
  }

  public getPage() {
    return this.winnersView.getPage();
  }

  public toggleVisibility() {
    this.winnersView.toggleVisibility();
  }

  private async getWinners(params: WinnersQueryParams) {
    const { winners, total } = await this.winnersModel.getWinners(params);
    const updatedWinners = await Promise.all(
      winners.winners.map(async (winner) => {
        const { name, color } = await this.winnersModel.getWinnerCar(winner.id);
        return { ...winner, name, color };
      }),
    );
    return { winners: updatedWinners, total };
  }

  public async renderPage() {
    const params: WinnersQueryParams = { page: this.currentPage, limit: 10, sort: 'id', order: 'DESC' };
    const { winners, total } = await this.getWinners(params);
    this.winnersView.renderPage(winners, this.currentPage, total);
  }

  private async init() {
    await this.renderPage();
    this.setPaginationListeners();
  }
}
