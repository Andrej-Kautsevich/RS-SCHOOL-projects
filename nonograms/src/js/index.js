import '../sass/style.scss';
import App from './App';
import templates from './templates';
import createMenuBar from './layout/menubar';
import Timer from './components/Timer';

const mainContainer = document.createElement('main');
mainContainer.classList.add('page-wrapper');
document.body.append(mainContainer);

const timer = new Timer();
const timerContainer = timer.getTimer();

const app = new App(templates[1].template, timer);
const menuBar = createMenuBar();

mainContainer.append(menuBar, timerContainer);

app.start(mainContainer);
