import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import { Layout } from 'antd';
import {
  LINK_ADMIN_VET_LIST,
  LINK_CUSTOMER_CASE_LIST,
} from '../../constants/links';

export default function AuthLayout({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === 'Admin') {
        navigate(LINK_ADMIN_VET_LIST);
      } else {
        navigate(LINK_CUSTOMER_CASE_LIST);
      }
    }
  }, [isAuthenticated, user]);

  return (
    <Layout className="auth-layout">
      <Layout.Header>
        <Logo />
      </Layout.Header>
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
}
