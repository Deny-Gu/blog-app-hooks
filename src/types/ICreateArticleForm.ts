export interface ICreateArticleForm {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export interface IEditArticleForm {
  title?: string;
  description?: string;
  body?: string;
  tagList?: string[];
}
