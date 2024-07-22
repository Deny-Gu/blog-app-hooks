export interface ICreateArticleForm {
  title: string;
  description: string;
  body: string;
  tagList?: string[] | undefined;
}
