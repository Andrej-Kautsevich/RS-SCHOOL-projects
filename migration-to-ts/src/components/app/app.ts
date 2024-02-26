import { NewsList, SourcesList, queryElement } from '../../types/index';
import AppController from '../controller/controller';
import { AppView } from '../view/appView';

class App {
    private controller: AppController;
    private view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start() {
        queryElement(document, HTMLElement, '.sources').addEventListener('click', (e) =>
            this.controller.getNews(e, (data?: NewsList) => {
                if (data) {
                    this.view.drawNews(data);
                }
            })
        );
        this.controller.getSources((data?: SourcesList) => {
            if (data) {
                this.view.drawSources(data);
            }
        });
    }
}

export default App;
