import React from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import actions from '../../redux/auth/actions';

import { ValidationRules } from '../../constants/validation';
import { EmailInputProps, SubmitButtonProps } from '../ui/ElementProps';
import { LINK_LOGIN } from '../../constants/links';

import { Form, Input, Button, Typography } from 'antd';
import AuthLayout from '../layouts/AuthLayout';
import { lang } from '../../constants/lang';

function ForgotPassword() {
  const { forgotPasswordLoader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch({
      type: actions.FORGOT_PASSWORD,
      payload: {
        email: values.email,
      },
    });
  };

  return (
    <AuthLayout>
      <Form name="forgot-password" onFinish={onFinish}>
        <Form.Item>
          <Typography.Title level={4}>
            {lang.forgotPassword.reset}
          </Typography.Title>
          <Typography.Text>{lang.forgotPassword.caption}</Typography.Text>
        </Form.Item>
        <Form.Item name="email" rules={ValidationRules.email}>
          <Input {...EmailInputProps} />
        </Form.Item>
        <Form.Item>
          <Button
            loading={forgotPasswordLoader}
            {...SubmitButtonProps}
            block={true}
          >
            {lang.forgotPassword.reset}
          </Button>
          <Link to={LINK_LOGIN}>{lang.forgotPassword.back}</Link>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
}

export default ForgotPassword;
