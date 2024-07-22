import { Article } from './Article';

export type ArticlesSuccess = {
  articles: Article[];
  articlesCount: number;
};

export type ArticlesError = {
  errors: {
    body: string[];
  };
};
