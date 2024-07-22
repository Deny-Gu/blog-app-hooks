import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import { message } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useEffect } from 'react';
import { clearSuccess } from '../../store/slices/articlesSlice';

const LayoutRoute: React.FC = () => {
  const dispatch = useAppDispatch();
  const { success, error } = useAppSelector((state) => state.articles);
  const [messageApi, contextHolder] = message.useMessage();

  const successModal = () => {
    messageApi.open({
      type: 'success',
      content: 'Success.',
    });
  };

  const errorModal = () => {
    messageApi.open({
      type: 'error',
      content: error?.message,
    });
  };

  useEffect(() => {
    if (success) {
      successModal();
      dispatch(clearSuccess());
    }
    if (error) {
      errorModal();
    }
  }, [success, error]);

  return (
    <>
      {contextHolder}
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default LayoutRoute;
