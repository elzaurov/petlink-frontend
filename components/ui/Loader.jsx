import React from 'react';
import { Modal, Space, Spin } from 'antd';
import { lang } from '../../constants/lang';

function Loader() {
  return (
    <Space className="page-loader">
      <Spin tip={lang.app.loading} />
    </Space>
  );
}

export default Loader;
