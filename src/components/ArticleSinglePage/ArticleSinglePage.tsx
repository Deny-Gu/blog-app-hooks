import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ArticleSinglePage.module.scss";
import heartSvg from "../../assets/icon/heart.svg";
import heartActiveSvg from "../../assets/icon/heart-active.svg";
import { format } from "date-fns";
import Loader from "../Loader/Loader";
import Markdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { Button, Popconfirm } from "antd";
import ErrorBlock from "../ErrorBlock/ErrorBlock";
import { useAuth } from "../AuthProvider/AuthProvider";
import {
  deleteArticle,
  favoriteArticle,
  getArticle,
  unfavoriteArticle,
} from "../../services/articlesAPI";
import { Article } from "../../types/Article";

function ArticleSinglePage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [heartActive, setHeartActive] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const { slug } = useParams();
  const { isAuth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      getArticle(slug)
        .then((res) => {
          setArticle(res);
          setHeartActive(res.favorited);
          setIsFavorited(res.favorited);
          setCount(res.favoritesCount);
          setIsLoading(false);
        })
        .catch((error) => setError(error));
    }
  }, [slug]);

  useEffect(() => {
    if (success) {
      navigate("/");
    }
  }, [navigate, success]);

  const handleDelete = () => {
    if (slug) {
      deleteArticle(slug)
        .then(() => {
          setSuccess(true);
        })
        .catch((error) => setError(error));
    }
  };

  const handleFavorite = () => {
    if (slug) favoriteArticle(slug);
    setHeartActive(true);
    setIsFavorited(true);
    setCount((prevState) => prevState + 1);
  };

  const handleUnfavorite = () => {
    if (slug) unfavoriteArticle(slug);
    setHeartActive(false);
    setIsFavorited(false);
    setCount((prevState) => prevState - 1);
  };

  // const handleFavorite = () => {
  //   if (slug) favoriteArticle(slug);
  // };

  // const handleUnfavorite = () => {
  //   if (slug) unfavoriteArticle(slug);
  // };

  if (error) {
    return <ErrorBlock />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.articleSinglePageWrapper}>
      <div className={styles.article}>
        <div className={styles.articleLeftBlock}>
          <div className={styles.articleLeftBlockHeader}>
            <span className={styles.articleTitle}>{article?.title}</span>
            <span className={styles.articleLikes}>
              <button
                className={styles.articleBtnLike}
                disabled={!isAuth && true}
              >
                <img
                  className={styles.articleLikesImg}
                  onClick={isFavorited ? handleUnfavorite : handleFavorite}
                  src={heartActive ? heartActiveSvg : heartSvg}
                  alt="avatar"
                />
              </button>
              {count}
            </span>
          </div>
          <div className={styles.articleTags}>
            {article?.tagList.map((tag, i) => <span key={i}>{tag}</span>)}
          </div>
          <div className={styles.articleDescription}>
            <p>{article?.description}</p>
          </div>
        </div>
        <div className={styles.articleRightBlock}>
          <div className={styles.articleUserInformation}>
            <div className={styles.articleUsername}>
              <p>{article?.author.username}</p>
              <span>{article && format(article.updatedAt, "PP")}</span>
            </div>
            <div className={styles.articleUserAvatar}>
              <img
                className={styles.articleLikesImg}
                src={article?.author.image}
                alt="like"
              />
            </div>
            {article?.author.username === user?.username && (
              <div className={styles.articleEdit}>
                <Popconfirm
                  placement="rightBottom"
                  title={null}
                  description={"Are you sure to delete this article?"}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={handleDelete}
                >
                  <Button className={styles.btnDelete}>Delete</Button>
                </Popconfirm>
                <button
                  className={styles.btnEdit}
                  onClick={() => navigate(`/articles/${slug}/edit`)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.articleBody}>
        <Markdown remarkPlugins={[remarkBreaks]}>
          {article?.body.replace(/\\n/gi, "\n")}
        </Markdown>
      </div>
    </div>
  );
}

export default ArticleSinglePage;
