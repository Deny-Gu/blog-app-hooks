import React from 'react';
import { Flex, Spin } from 'antd';

const contentStyle: React.CSSProperties = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

const Loader: React.FC = () => (
  <div className="loader">
    <Flex gap="small">
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    </Flex>
  </div>
);

export default Loader;
