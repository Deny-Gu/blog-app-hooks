import React, { useState } from 'react';
import styles from './ArticleItem.module.scss';
import heartSvg from '../../assets/icon/heart.svg';
import heartActiveSvg from '../../assets/icon/heart-active.svg';
import { Article } from '../../types/Article';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { favoriteArticle, unfavoriteArticle } from '../../store/services/articlesAPI';
import { useAuth } from '../AuthProvider/AuthProvider';

const ArticleItem: React.FC<Article> = ({
  slug,
  title,
  description,
  tagList,
  favorited,
  favoritesCount,
  author,
  updatedAt,
}) => {
  const [heartActive, setHeartActive] = useState(favorited);
  const [count, setCount] = useState(favoritesCount);
  const { isAuth } = useAuth();
  const dispatch = useAppDispatch();

  const shortenText = (str: string, maxLen: number, separator = ' ') => {
    if (str.length <= maxLen) {
      return str;
    }
    return str.substr(0, str.lastIndexOf(separator, maxLen)) + ' ...';
  };

  const handleFavorite = () => {
    dispatch(favoriteArticle(slug));
    setHeartActive(true);
    setCount((prevState) => prevState + 1);
  };

  const handleUnfavorite = () => {
    dispatch(unfavoriteArticle(slug));
    setHeartActive(false);
    setCount((prevState) => prevState - 1);
  };

  return (
    <div className={styles.article}>
      <div className={styles.articleLeftBlock}>
        <div className={styles.articleLeftBlockHeader}>
          <span className={styles.articleTitle}>
            <Link to={`/articles/${slug}`}>{shortenText(title, 56)}</Link>
          </span>
          <span className={styles.articleLikes}>
            <button className={styles.articleBtnLike} disabled={!isAuth && true}>
              <img
                className={styles.articleLikesImg}
                onClick={favorited ? handleUnfavorite : handleFavorite}
                src={heartActive ? heartActiveSvg : heartSvg}
                alt="like"
              />
            </button>
            {count}
          </span>
        </div>
        <div className={styles.articleTags}>
          {tagList.map((tag, i) => (
            <span key={i}>{tag}</span>
          ))}
        </div>
        <div className={styles.articleDescription}>
          <p>{shortenText(description, 300)}</p>
        </div>
      </div>
      <div className={styles.articleRightBlock}>
        <div className={styles.articleUserInformation}>
          <div className={styles.articleUsername}>
            <p>{author.username}</p>
            <span>{format(updatedAt, 'PP')}</span>
          </div>
          <div className={styles.articleUserAvatar}>
            <img className={styles.articleAvatarImg} src={author.image} alt="avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleItem;
