import React from 'react';
import styles from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/userSlice';
import { useAuth } from '../AuthProvider/AuthProvider';

const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuth, logoutAuth } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    logoutAuth();
    navigate('/', { replace: true });
  };

  const Authorized = () => {
    return (
      <div className={styles.headerAuth}>
        <button className={styles.btnCreateArticle} onClick={() => navigate('/new-article')}>
          Create article
        </button>
        <div className={styles.userProfile} onClick={() => navigate('/profile')}>
          <p>{user?.username}</p>
          <img className={styles.userAvatar} src={user?.image} alt="avatar" />
        </div>
        <button className={styles.btnLogOut} onClick={() => handleLogout()}>
          Log Out
        </button>
      </div>
    );
  };

  const NotAuthorized = () => {
    return (
      <div className={styles.headerAuth}>
        <button className={styles.btnSignIn} onClick={() => navigate('/sign-in')}>
          Sign In
        </button>
        <button className={styles.btnSignUp} onClick={() => navigate('/sign-up')}>
          Sign Up
        </button>
      </div>
    );
  };

  return (
    <header>
      <div className={styles.headerWrapper}>
        <div className={styles.title}>
          <Link to="/">Realworld Blog</Link>
        </div>
        <div className={styles.headerAuth}>{isAuth ? <Authorized /> : <NotAuthorized />}</div>
      </div>
    </header>
  );
};

export default Header;
