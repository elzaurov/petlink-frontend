import React from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import actions from '../../redux/auth/actions';

import { ValidationRules } from '../../constants/validation';
import {
  EmailInputProps,
  PasswordInputProps,
  SubmitButtonProps,
} from '../ui/ElementProps';
import { LINK_FORGOT_PASSWORD } from '../../constants/links';

import { Form, Input, Button, Checkbox } from 'antd';
import AuthLayout from '../layouts/AuthLayout';
import { lang } from '../../constants/lang';

function Login() {
  const { loginLoader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch({
      type: actions.LOGIN,
      payload: {
        email: values.email,
        password: values.password,
        remember: values.remember,
      },
    });
  };

  const InitialValues = {
    remeber: true,
  };

  return (
    <AuthLayout>
      <Form name="login" initialValues={InitialValues} onFinish={onFinish}>
        <Form.Item name="email" rules={ValidationRules.email}>
          <Input {...EmailInputProps} />
        </Form.Item>
        <Form.Item name="password" rules={ValidationRules.password}>
          <Input.Password {...PasswordInputProps} />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>{lang.login.remember}</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button loading={loginLoader} {...SubmitButtonProps} block={true}>
            {lang.login.login}
          </Button>
          <Link to={LINK_FORGOT_PASSWORD}>{lang.login.forgotPassword}</Link>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
}

export default Login;
