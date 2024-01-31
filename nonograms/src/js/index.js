import '../sass/style.scss';
import App from './App';
import templates from './templates';
import createMenuBar from './layout/menubar';

const mainContainer = document.createElement('main');
mainContainer.classList.add('page-wrapper');
document.body.append(mainContainer);

const app = new App(templates[2].template);
const menuBar = createMenuBar();
mainContainer.append(menuBar);

app.start(mainContainer);
