import { Link, useNavigate } from 'react-router-dom';
import styles from './SignUpPage.module.scss';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { regUser } from '../../store/services/userAPI';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { message } from 'antd';
import { useEffect } from 'react';
import { clearError, clearSuccess } from '../../store/slices/userSlice';
import { useAuth } from '../AuthProvider/AuthProvider';
import { ISignUpForm } from '../../types/ISignUpForm';

const schema: yup.ObjectSchema<ISignUpForm> = yup
  .object({
    username: yup
      .string()
      .required('No email provided.')
      .min(3, 'Username is too short - should be 3 chars minimum.')
      .max(20, 'Username is too short - should be 20 chars maximum.'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .matches(/^\S+@\S+\.\S+$/, 'Please enter a valid email')
      .required('No email provided.'),
    password: yup
      .string()
      .required('No password provided.')
      .min(6, 'Password is too short - should be 6 chars minimum.')
      .max(40, 'Password is too short - should be 40 chars maximum.'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), ''], 'Passwords must match')
      .required('No confirm password provided.'),
    checkbox: yup
      .boolean()
      .default(false)
      .oneOf([true], 'Confirm your consent to the processing of information'),
  })
  .required();

const SignUpPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { success, isLoading, error } = useAppSelector((state) => state.user);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const successModal = async () => {
    await messageApi.open({
      type: 'success',
      content: `You have successfully registered. Log in to the system.`,
    });
    navigate('/sign-in');
  };

  const errorModal = async () => {
    await messageApi.open({
      type: 'error',
      content: error?.regUser?.message,
    });
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, []);

  useEffect(() => {
    if (isAuth) {
      navigate('/');
    }
    if (success) {
      successModal();
      reset();
    }
    if (error?.regUser) {
      errorModal();
    }
  }, [isAuth, success, error]);

  return (
    <>
      {contextHolder}
      <div className={styles.signUpWrapper}>
        <form
          className={styles.signUpForm}
          onSubmit={handleSubmit((data) => dispatch(regUser(data)))}
        >
          <h3>Create new account</h3>
          <span>
            <label htmlFor="username">Username</label>
            <input
              className={
                errors.username || error?.regUser?.fields?.includes('username')
                  ? styles.error
                  : null
              }
              type="text"
              id="username"
              placeholder="Username"
              {...register('username')}
            />
            {errors.username && <p>{errors.username.message}</p>}
          </span>
          <span>
            <label htmlFor="email">Email address</label>
            <input
              className={
                errors.email || error?.regUser?.fields?.includes('email') ? styles.error : null
              }
              id="email"
              placeholder="Email address"
              {...register('email')}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </span>
          <span>
            <label htmlFor="password">Password</label>
            <input
              className={errors.password ? styles.error : null}
              type="password"
              id="password"
              placeholder="Password"
              {...register('password')}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </span>
          <span>
            <label htmlFor="confirmPassword">Repeat password</label>
            <input
              className={errors.confirmPassword ? styles.error : null}
              type="password"
              id="confirmPassword"
              placeholder="Password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </span>
          <div className={styles.personInfo}>
            <input type="checkbox" {...register('checkbox')} />
            <label>I agree to the processing of my personal information</label>
          </div>
          <span>{errors.checkbox && <p>{errors.checkbox.message}</p>}</span>
          <span className={styles.signIn}>
            <input type="submit" value={isLoading ? 'Загрузка...' : 'Create'} />
            Already have an account?
            <Link to="/sign-in"> Sign In</Link>.
          </span>
        </form>
      </div>
    </>
  );
};

export default SignUpPage;
