import React from "react";
import ArticleItem from "../ArticleItem/ArticleItem";
import { Pagination } from "antd";
import styles from "./ArticlesListPage.module.scss";
import { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import ErrorBlock from "../ErrorBlock/ErrorBlock";
import { getArticles } from "../../services/articlesAPI";
import { Article } from "../../types/Article";
import { useAuth } from "../AuthProvider/AuthProvider";

function ArticleList() {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [articlesCount, setArticlesCount] = useState<number>(0);
  const [pagination, setPagination] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuth } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    getArticles(pagination * 5 - 5).then((res) => {
      if (res.articles) {
        setArticles(res.articles);
        setArticlesCount(res.articlesCount);
        setIsLoading(false);
      }
      if (res.message) {
        setError(res.message);
        setIsLoading(false);
      }
    });
  }, [pagination, isAuth]);

  const articleItems =
    articles &&
    articles.map((item) => <ArticleItem key={item.slug} {...item} />);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorBlock />;
  }

  return (
    <>
      <div className={styles.articleList}>{articleItems}</div>
      <div className={styles.articlePagination}>
        <Pagination
          current={pagination}
          defaultPageSize={5}
          total={articlesCount}
          showSizeChanger={false}
          onChange={(page) => setPagination(page)}
        />
      </div>
    </>
  );
}

export default ArticleList;
