import '../sass/style.scss';
import App from './App';
import templates from './templates';

const container = document.createElement('div');
container.classList.add('page-wrapper');
document.body.append(container);

const app = new App(templates[0].template);

app.start(container);
