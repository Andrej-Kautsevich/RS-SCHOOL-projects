import { Callback } from '../../types/index';
import { assertIsDefined, assertIsInstanceOf } from '../../types/helpers';
import AppLoader from './appLoader';

class AppController extends AppLoader {
    public getSources<T>(callback: Callback<T>) {
        super.getResp(
            {
                endpoint: 'sources',
            },
            callback
        );
    }

    public getNews<T>(e: Event, callback: Callback<T>) {
        let target = e.target;
        assertIsInstanceOf(target, HTMLElement);
        const newsContainer = e.currentTarget;
        assertIsInstanceOf(newsContainer, HTMLElement);

        while (target && target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const sourceId = target.getAttribute('data-source-id');
                assertIsDefined(sourceId);
                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
                    super.getResp(
                        {
                            endpoint: 'everything',
                            options: {
                                sources: sourceId,
                            },
                        },
                        callback
                    );
                }
                return;
            }
            target = target.parentNode;
            assertIsInstanceOf(target, HTMLElement);
        }
    }
}

export default AppController;
