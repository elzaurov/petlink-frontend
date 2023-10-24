import { Form, Typography, Button, Input } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import actions from '../../redux/auth/actions';
import AuthLayout from '../layouts/AuthLayout';
import { LINK_FORGOT_PASSWORD, LINK_LOGIN } from '../../constants/links';
import { lang } from '../../constants/lang';
import { ValidationRules } from '../../constants/validation';
import { NormalInputProps, SubmitButtonProps } from '../ui/ElementProps';

export default function ResetPassword() {
  const { resetPasswordLoader, isResetPasswordSucceed, forgotPasswordEmail } =
    useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, token } = useParams();

  useEffect(() => {
    if (!token || !email) navigate(LINK_FORGOT_PASSWORD);
  }, [token, email]);

  useEffect(() => {
    if (isResetPasswordSucceed) navigate(LINK_LOGIN);
  }, [isResetPasswordSucceed]);

  const onFinish = (values) => {
    dispatch({
      type: actions.RESET_PASSWORD,
      payload: {
        email: decodeURI(email),
        token: token,
        password: values.password,
      },
    });
  };

  return (
    <AuthLayout>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item>
          <Typography.Title level={4}>Set new password</Typography.Title>
        </Form.Item>
        <Form.Item
          name="password"
          label={lang.admin.newPassword}
          rules={ValidationRules.password}
        >
          <Input.Password {...NormalInputProps} />
        </Form.Item>
        <Form.Item
          name="password_confirmation"
          label={lang.admin.repeatPassword}
          rules={ValidationRules.passwordMatch}
        >
          <Input.Password {...NormalInputProps} />
        </Form.Item>
        <Form.Item>
          <Button
            loading={resetPasswordLoader}
            {...SubmitButtonProps}
            block={true}
          >
            Set password
          </Button>
          <Link to={LINK_LOGIN}>Back</Link>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
}
