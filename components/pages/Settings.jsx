import React from 'react';
import CustomerLayout from '../layouts/CustomerLayout';
import Heading from '../ui/Heading';
import { Button, Card, List, Space, Switch, Typography } from 'antd';

export default function Settings() {
  const items = [
    {
      id: 'NEW_CASE',
      title: 'Ny sak',
      description: 'Lorem Ipsum dolor sit amet consectetur ipsum',
      isChecked: true,
      isVisible: true,
    },
    {
      id: 'UPDATE_CASE',
      title: 'Ny sak',
      description: 'Lorem Ipsum dolor sit amet consectetur ipsum',
      isChecked: true,
      isVisible: true,
    },
  ];
  return (
    <CustomerLayout>
      <Heading text="Innstillinger" size={2} />
      <Card className="setting-notification-box" title="Varslinger">
        <List
          className="setting-list-box"
          itemLayout="horizontal"
          dataSource={items}
          renderItem={(item) => {
            if (item.isVisible) {
              return (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                  <Space align="end" direction="vertical">
                    <Switch onChange={() => console.log(item)} />
                  </Space>
                </List.Item>
              );
            }
            return null;
          }}
        />
        <Space className="btn-group" align="end" direction="horizontal">
          <Button size="large">SKRU AV ALLE</Button>
          <Button type="primary" size="large">
            LAGRE
          </Button>
        </Space>
      </Card>
    </CustomerLayout>
  );
}
