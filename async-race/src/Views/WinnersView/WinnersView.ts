import { BaseComponent } from '../../helpers/BaseComponent';
import { button, div, h, span, table, tbody, td, thead, tr } from '../../helpers/tags';
import { Winner, WinnersQueryParams, WinnersQueryParamsOrder, WinnersQueryParamsSort } from '../../types/types';
import styles from './winnersView.module.scss';
import buttonStyles from '../../styles/button.module.scss';
import createSVGUse from '../../helpers/createSVGUse';
import Observer from '../../helpers/Observer';

export default class WinnersView {
  private winnersPage: BaseComponent;

  private table: BaseComponent;

  private title: BaseComponent<HTMLHeadingElement>;

  private pagination: BaseComponent;

  public nextButton: BaseComponent<HTMLButtonElement>;

  public prevButton: BaseComponent<HTMLButtonElement>;

  public observer: Observer<unknown> = Observer.getInstance();

  constructor() {
    this.winnersPage = div({ classNames: [styles.winners, styles.hidden] });
    this.title = h(2, { className: styles.winners__title, txt: 'Winners' });
    this.table = table({ classNames: [styles.winners__table, styles.table] });

    this.pagination = div({ classNames: [styles.garage__pagination, styles.pagination] });
    this.prevButton = button({ classNames: [buttonStyles.button], txt: 'Prev' });
    this.nextButton = button({ classNames: [buttonStyles.button], txt: 'Next' });

    this.winnersPage.appendChildren([this.title, this.table]);
  }

  public getPage() {
    return this.winnersPage.getNode();
  }

  public toggleVisibility() {
    this.winnersPage.toggleClass(styles.hidden);
  }

  public drawTable(winners: Winner[], params: WinnersQueryParams) {
    this.table.destroyChildren();

    const winsTd = td({
      classNames: [styles.table__td, styles.table__td_sortable],
      id: 'winsTd',
      txt: 'Wins',
      onclick: () => {
        this.observer.notify('sortWins', '');
      },
    });
    if (params?.sort === WinnersQueryParamsSort.wins) {
      if (params.order === WinnersQueryParamsOrder.DESC) {
        winsTd.addClasses([styles.table__td_sort_desc]);
      } else {
        winsTd.addClasses([styles.table__td_sort_asc]);
      }
    }

    const timeTd = td({
      classNames: [styles.table__td, styles.table__td_sortable],
      id: 'timeTd',
      txt: 'Time',
      onclick: () => {
        this.observer.notify('sortTime', '');
      },
    });
    if (params?.sort === WinnersQueryParamsSort.time) {
      if (params.order === WinnersQueryParamsOrder.DESC) {
        timeTd.addClasses([styles.table__td_sort_desc]);
      } else {
        timeTd.addClasses([styles.table__td_sort_asc]);
      }
    }

    const tableHead = thead(
      { className: styles.table__head },
      tr(
        { className: styles.table__tr },
        td({ className: styles.table__td, txt: 'ID' }),
        td({ className: styles.table__td, txt: 'Car' }),
        td({ className: styles.table__td, txt: 'Name' }),
        winsTd,
        timeTd,
      ),
    );
    this.table.append(tableHead);

    const tableBody = tbody({ className: styles.table__body });
    winners.forEach((winner) => {
      const carIMG = createSVGUse('car');
      carIMG.setAttribute('fill', winner.color?.toString());
      carIMG.classList.add(styles.table__car);

      const row = tr(
        { className: styles.table__tr },
        td({ className: styles.table__td, txt: winner.id.toString() }),
        td({ className: styles.table__td }, div({ className: styles.table__car }, carIMG)),
        td({ className: styles.table__td, txt: winner.name }),
        td({ className: styles.table__td, txt: winner.wins.toString() }),
        td({ className: styles.table__td, txt: winner.time.toFixed(2).toString() }),
      );
      tableBody.append(row);
    });
    this.table.append(tableBody);
  }

  public drawTitle(totalWinners: number) {
    this.title.setTextContent(`Winners (${totalWinners})`);
  }

  public drawPagination(page: number, totalPages: number) {
    this.pagination?.destroyChildren();

    const paginationText = span({ classNames: [styles.pagination__text], txt: `Page: ${page} / ${totalPages}` });
    this.prevButton.getNode().disabled = page === 1;
    this.nextButton.getNode().disabled = page === totalPages;

    this.pagination.appendChildren([paginationText, this.prevButton, this.nextButton]);
    this.winnersPage.append(this.pagination);
  }

  public renderPage(winners: Winner[], currentPage: number, total: number, params: WinnersQueryParams) {
    this.drawTable(winners, params);
    this.drawTitle(total);
    let totalPages = 1;
    if (total) {
      totalPages = Math.ceil(total / 10);
    }
    this.drawPagination(currentPage, totalPages);
  }
}
