import React from 'react';
import { Layout, Typography, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { lang } from '../../constants/lang';
import { LogoImageProps } from '../ui/ElementProps';
import Menu from './partial/Menu';
import Navbar from './partial/Navbar';
import View from '../ui/View';

const { Header, Footer, Content } = Layout;

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  return (
    <Layout className="layout">
      <Header>
        <View className="wrapper">
          <Image {...LogoImageProps} onClick={() => navigate('/')} />
          <Navbar />
          <Menu />
        </View>
      </Header>
      <Content>
        <View className="container">{children}</View>
      </Content>
      <Footer>
        <View className="wrapper">
          <Image {...LogoImageProps} />
          <Typography.Text strong>{lang.footer.copyright}</Typography.Text>
        </View>
      </Footer>
    </Layout>
  );
}
