import React from 'react';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <div className="error-block">
          <p>404 Error - Not Found.</p>
          <Link to="/">Go to the main page</Link>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;
