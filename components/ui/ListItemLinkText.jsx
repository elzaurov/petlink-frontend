import { Typography } from 'antd';
import React from 'react';
import { ListItemLinkContentProps } from './ElementProps';

export default function ListItemLinkText({ text, onClick }) {
  return (
    <Typography.Text {...ListItemLinkContentProps} onClick={onClick}>
      {text}
    </Typography.Text>
  );
}
