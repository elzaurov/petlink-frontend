import React from 'react';
import { lang } from '../../../constants/lang';
import { Button, Space, Typography } from 'antd';
import { DescriptionProps } from '../../ui/ElementProps';
import { useNavigate, useParams } from 'react-router-dom';

export default function Conclude() {
  const { id } = useParams();
  const words = lang.treat.detail;
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <Space direction="vertical">
        <Typography.Text strong>{words.completeTitle}</Typography.Text>
        <Typography.Text {...DescriptionProps}>
          {words.completeContent}
        </Typography.Text>
        <Button
          className="complete-button"
          size="large"
          onClick={() => navigate(`/case/${id}/dekningstilsagn`)}
        >
          {words.completeButton}
        </Button>
      </Space>
      <Space direction="vertical">
        <Typography.Text strong>{words.rejectTitle}</Typography.Text>
        <Typography.Text {...DescriptionProps}>
          {words.rejectContent}
        </Typography.Text>
        <Button
          className="reject-button"
          size="large"
          onClick={() => navigate(`/case/${id}/refusal`)}
        >
          {words.rejectButton}
        </Button>
      </Space>
    </React.Fragment>
  );
}
