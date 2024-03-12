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
    source: Pick<SourceItem, 'id' | 'name'>;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export interface SourcesList {
    status: RequestStatus;
    sources: SourceItem[];
}

export interface NewsList {
    status: RequestStatus;
    totalResults: number;
    articles: NewsItem[];
}

enum RequestStatus {
    Ok = 'ok',
    Error = 'error',
}

export enum HttpStatus {
    Unauthorized = 401,
    NotFound = 404,
}

export interface View<T> {
    draw(data: T[]): void;
}

export interface EndpointRequest {
    endpoint: Endpoint;
    options?: EndpointOptions;
}

export enum Categories {
    Business = 'business',
    Entertainment = 'entertainment',
    General = 'general',
    Health = 'health',
    Science = 'science',
    Sports = 'sports',
    Technology = 'technology',
}

export type EndpointOptions = {
    apiKey?: string;
    category?: Categories;
    sources?: string;
} & {
    [K in keyof typeof Categories]?: string;
};

export type Endpoint = 'sources' | 'top-headlines' | 'everything';

export type Callback<T> = (data?: T) => void;
