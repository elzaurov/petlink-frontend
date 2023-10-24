import React from 'react';
import { Image, Space } from 'antd';
import { ASSET_LOGO } from '../../constants/links';

export default function Logo() {
  const spaceProps = {
    align: 'center',
    block: 'true',
    style: { justifyContent: 'center', width: '100%', cursor: 'pointer' },
  };

  const imageProps = {
    src: ASSET_LOGO,
    height: 35,
    alt: 'Petlink',
    preview: false,
  };

  return (
    <Space {...spaceProps}>
      <Image {...imageProps} />
    </Space>
  );
}
