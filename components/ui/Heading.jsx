import { Typography } from 'antd';
import React from 'react';

export default function Heading({ text, size }) {
  const style = {
    fontFamily: 'Petlink-Bold, sans-serif',
  };
  return (
    <Typography.Title level={size} style={style}>
      {text}
    </Typography.Title>
  );
}
