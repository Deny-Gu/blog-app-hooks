import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.scss';
import ArticlesListPage from './components/ArticlesListPage/ArticlesListPage';
import ArticleSinglePage from './components/ArticleSinglePage/ArticleSinglePage';
import SignUpPage from './components/SignUpPage/SignUpPage';
import LayoutRoute from './components/LayotRoute/LayoutRoute';
import SignInPage from './components/SignInPage/SignInPage';
import EditProfilePage from './components/EditProfilePage/EditProfilePage';
import ArticleCreatePage from './components/ArticleCreatePage/ArticleCreatePage';
import { AuthProvider } from './components/AuthProvider/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import ArticleEditPage from './components/ArticleEditPage/ArticleEditPage';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutRoute />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <ArticlesListPage />,
      },
      {
        path: '/articles',
        element: <ArticlesListPage />,
      },
      {
        path: '/articles/:slug',
        element: <ArticleSinglePage />,
      },
      {
        path: '/articles/:slug/edit',
        element: (
          <ProtectedRoute>
            <ArticleEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/new-article',
        element: (
          <ProtectedRoute>
            <ArticleCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/sign-up',
        element: <SignUpPage />,
      },
      {
        path: '/sign-in',
        element: <SignInPage />,
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const App: React.FC = () => {
  return (
    <div className="App">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
};

export default App;
