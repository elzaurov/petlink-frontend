import { Button } from 'antd';
import React from 'react';

export default function CircleIconButton({ icon, ...rest }) {
  return (
    <Button type="primary" shape="circle" size="large" {...rest}>
      {icon}
    </Button>
  );
}
