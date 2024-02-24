interface Source {
    id: string;
    name: string;
}

export interface SourceItem {
    name: string;
    id: number;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

export interface NewsItem {
    source: Source;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export interface View<T> {
    draw(data: T[]): void;
}

export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error(`${value} is not defined`);
    }
}

export function assertIsInstanceOf<T>(element: unknown, type: { new (...args: unknown[]): T }): asserts element is T {
    if (!(element instanceof type)) {
        throw new Error(`${element} is not an instance of ${type.name}`);
    }
}
