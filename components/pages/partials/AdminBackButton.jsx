import React from 'react';
import Heading from '../../ui/Heading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Space } from 'antd';

export default function AdminBackButton({ title, onClick }) {
  return (
    <Space
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        lineHeight: 0,
      }}
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={faChevronLeft}
        style={{ fontSize: 20, marginRight: 5 }}
      />
      <Heading text={title} size={2} />
    </Space>
  );
}
