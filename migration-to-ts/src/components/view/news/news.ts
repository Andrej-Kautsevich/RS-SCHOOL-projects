import { NewsItem, View, assertIsDefined, assertIsInstanceOf, queryElement } from '../../../types/index';
import './news.css';

class News implements View<NewsItem> {
    public draw(data: NewsItem[]): void {
        const news = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

        const fragment = document.createDocumentFragment();
        const newsItemTemp = document.querySelector('#newsItemTemp');
        assertIsInstanceOf(newsItemTemp, HTMLTemplateElement);

        news.forEach((item, idx) => {
            const newsClone = newsItemTemp.content.cloneNode(true);
            assertIsInstanceOf(newsClone, DocumentFragment);
            assertIsDefined(newsClone);

            if (idx % 2) queryElement(newsClone, Element, '.news__item').classList.add('alt');

            queryElement(newsClone, HTMLElement, '.news__meta-photo').style.backgroundImage = `url(${
                item.urlToImage || 'img/news_placeholder.jpg'
            })`;
            queryElement(newsClone, HTMLElement, '.news__meta-author').textContent = item.author || item.source.name;
            queryElement(newsClone, HTMLElement, '.news__meta-date').textContent = item.publishedAt
                .slice(0, 10)
                .split('-')
                .reverse()
                .join('-');

            queryElement(newsClone, HTMLElement, '.news__description-title').textContent = item.title;
            queryElement(newsClone, HTMLElement, '.news__description-source').textContent = item.source.name;
            queryElement(newsClone, HTMLElement, '.news__description-content').textContent = item.description;
            queryElement(newsClone, HTMLElement, '.news__read-more a').setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        queryElement(document, Element, '.news').innerHTML = '';
        queryElement(document, Element, '.news').appendChild(fragment);
    }
}

export default News;
