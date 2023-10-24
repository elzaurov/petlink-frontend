import { Typography } from 'antd';
import React from 'react';

export default function StepWizardHeading({ title, description }) {
  return (
    <React.Fragment>
      <Typography.Title level={2}>{title}</Typography.Title>
      <Typography.Text>{description}</Typography.Text>
    </React.Fragment>
  );
}
