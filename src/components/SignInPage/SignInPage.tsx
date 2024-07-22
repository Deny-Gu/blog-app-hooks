import { Link, useNavigate } from 'react-router-dom';
import styles from './SignInPage.module.scss';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { logUser } from '../../store/services/userAPI';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useEffect } from 'react';
import { message } from 'antd';
import { clearError, clearSuccess } from '../../store/slices/userSlice';
import { useAuth } from '../AuthProvider/AuthProvider';
import { ISignInForm } from '../../types/ISignInForm';

const schema: yup.ObjectSchema<ISignInForm> = yup
  .object({
    email: yup.string().email('Please enter a valid email').required('No email provided.'),
    password: yup.string().required('No password provided.'),
  })
  .required();

const SignInPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.user);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { isAuth, loginAuth } = useAuth();

  const errorModal = async () => {
    await messageApi.open({
      type: 'error',
      content: error?.logUser?.message,
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = (data: ISignInForm) => {
    dispatch(logUser(data));
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, []);

  useEffect(() => {
    if (isAuth) {
      navigate('/', { replace: true });
    }
    if (user) {
      loginAuth();
      dispatch(clearSuccess());
      navigate('/', { replace: true });
    }
    if (error?.logUser) {
      errorModal();
    }
  }, [isAuth, error, user]);

  return (
    <>
      {contextHolder}
      <div className={styles.signInWrapper}>
        <form
          className={styles.signInForm}
          onSubmit={handleSubmit((data) => handleSubmitForm(data))}
        >
          <h3>Sign In</h3>
          <span>
            <label htmlFor="email">Email address</label>
            <input
              className={
                errors.email || error?.logUser?.fields?.includes('email or password')
                  ? styles.error
                  : null
              }
              id="email"
              placeholder="Email address"
              {...register('email', { required: true })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </span>
          <span>
            <label htmlFor="password">Password</label>
            <input
              className={
                errors.password || error?.logUser?.fields?.includes('email or password')
                  ? styles.error
                  : null
              }
              type="password"
              id="password"
              placeholder="Password"
              {...register('password', { required: true })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </span>
          <span className={styles.signUp}>
            <input type="submit" value={isLoading ? 'Загрузка...' : 'Login'} />
            Don’t have an account?
            <Link to="/sign-up"> Sign Up</Link>.
          </span>
        </form>
      </div>
    </>
  );
};

export default SignInPage;
