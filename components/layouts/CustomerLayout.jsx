import React, { useEffect, useMemo } from 'react';
import {
  Layout,
  Typography,
  Image,
  Badge,
  Button,
  Space,
  Dropdown,
  Empty,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { lang } from '../../constants/lang';
import { LogoImageProps } from '../ui/ElementProps';
import Menu from './partial/Menu';
import View from '../ui/View';
import { BellOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import actions from '../../redux/auth/actions';

const { Header, Footer, Content } = Layout;

export default function CustomerLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const channelName = `notifications.${user.id}`;
    Echo.private(channelName).notification((data) => {
      dispatch({
        type: actions.NEW_NOTIFICATION,
        payload: data,
      });
    });

    return () => {
      window.Echo.leave(channelName);
    };
  }, []);

  const onReadNotification = (notification_id, treat_id) => {
    dispatch({
      type: actions.READ_NOTIFICATION,
      payload: {
        id: notification_id,
      },
    });
    navigate(`/case/${treat_id}`);
  };

  const unreadNotifications = useMemo(() => {
    return user.notifications.filter((notification) => !notification.read_at);
  }, [user]);

  const items = useMemo(() => {
    if (unreadNotifications.length > 0) {
      return unreadNotifications.map((notification) => {
        return {
          key: notification.id,
          label: (
            <div className="notification-item">
              <Typography.Text>{notification.data.message}</Typography.Text>
              <Typography.Text className="datetime" type="secondary">
                {dayjs(notification.data.timestamp).format(
                  'DD/MM/YYYY HH:mm:ss'
                )}
              </Typography.Text>
            </div>
          ),
          onClick: () =>
            onReadNotification(notification.id, notification.data.treat_id),
        };
      });
    }
    return [
      {
        key: '0',
        label: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />,
      },
    ];
  }, [unreadNotifications]);

  return (
    <Layout className="layout">
      <Header>
        <View className="wrapper">
          <Image {...LogoImageProps} onClick={() => navigate('/')} />
          <Space size="large">
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              trigger={['click']}
              overlayClassName="notifications"
            >
              <Badge color="#0293d9" count={unreadNotifications.length}>
                <Button shape="circle" icon={<BellOutlined />} size="middle" />
              </Badge>
            </Dropdown>
            <Menu />
          </Space>
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
