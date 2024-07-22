import React from 'react';
import styles from './ArticleSinglePage.module.scss';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  deleteArticle,
  favoriteArticle,
  fetchArticle,
  unfavoriteArticle,
} from '../../store/services/articlesAPI';
import heartSvg from '../../assets/icon/heart.svg';
import heartActiveSvg from '../../assets/icon/heart-active.svg';
import { format } from 'date-fns';
import Loader from '../Loader/Loader';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { Button, Popconfirm } from 'antd';
import ErrorBlock from '../ErrorBlock/ErrorBlock';
import { useAuth } from '../AuthProvider/AuthProvider';

const ArticleSinglePage: React.FC = () => {
  const { slug } = useParams();
  const { article, success, error } = useAppSelector((state) => state.articles);
  const { user } = useAppSelector((state) => state.user);
  const { isAuth } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      dispatch(fetchArticle(slug));
    }
  }, [slug]);

  useEffect(() => {
    if (success) {
      navigate('/');
    }
  }, [success]);

  const handleDelete = () => {
    if (slug) dispatch(deleteArticle(slug));
  };

  const handleFavorite = () => {
    if (slug) dispatch(favoriteArticle(slug));
  };

  const handleUnfavorite = () => {
    if (slug) dispatch(unfavoriteArticle(slug));
  };

  if (error) {
    return <ErrorBlock />;
  }

  if (!article) {
    return <Loader />;
  }

  return (
    <div className={styles.articleSinglePageWrapper}>
      <div className={styles.article}>
        <div className={styles.articleLeftBlock}>
          <div className={styles.articleLeftBlockHeader}>
            <span className={styles.articleTitle}>{article.title}</span>
            <span className={styles.articleLikes}>
              <button className={styles.articleBtnLike} disabled={!isAuth && true}>
                <img
                  className={styles.articleLikesImg}
                  onClick={article.favorited ? handleUnfavorite : handleFavorite}
                  src={article.favorited ? heartActiveSvg : heartSvg}
                  alt="avatar"
                />
              </button>
              {article.favoritesCount}
            </span>
          </div>
          <div className={styles.articleTags}>
            {article?.tagList.map((tag, i) => <span key={i}>{tag}</span>)}
          </div>
          <div className={styles.articleDescription}>
            <p>{article.description}</p>
          </div>
        </div>
        <div className={styles.articleRightBlock}>
          <div className={styles.articleUserInformation}>
            <div className={styles.articleUsername}>
              <p>{article.author.username}</p>
              <span>{format(article.updatedAt, 'PP')}</span>
            </div>
            <div className={styles.articleUserAvatar}>
              <img className={styles.articleLikesImg} src={article.author.image} alt="like" />
            </div>
            {article.author.username === user?.username && (
              <div className={styles.articleEdit}>
                <Popconfirm
                  placement="rightBottom"
                  title={null}
                  description={'Are you sure to delete this article?'}
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
        <Markdown remarkPlugins={[remarkBreaks]}>{article.body.replace(/\\n/gi, '\n')}</Markdown>
      </div>
    </div>
  );
};

export default ArticleSinglePage;
