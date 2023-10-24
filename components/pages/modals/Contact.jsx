import { List, Typography } from 'antd';
import React, { useMemo } from 'react';
import ListItemText from '../../ui/ListItemText';
import { useSelector } from 'react-redux';

export default function Contact() {
  const { caretaker } = useSelector((state) => state.customer.treat);

  const data = useMemo(() => {
    return [
      {
        title: 'Navn',
        value: <ListItemText text={caretaker.name} />,
      },
      {
        title: 'Adresse',
        value: <ListItemText text={caretaker.address} />,
      },
      {
        title: 'Postnummer',
        value: <ListItemText text={caretaker.postal_code} />,
      },
      {
        title: 'Poststed',
        value: <ListItemText text={caretaker.post_area} />,
      },
      {
        title: 'E-postadresse',
        value: <ListItemText text={caretaker.email} />,
      },
      {
        title: 'Mobilnummer',
        value: <ListItemText text={caretaker.phone} />,
      },
      {
        title: 'Polisenummer',
        value: (
          <ListItemText
            text={caretaker.policy_number ? caretaker.policy_number : 'N/A'}
          />
        ),
      },
    ];
  }, [caretaker]);

  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta title={item.title} />
          <Typography.Text>{item.value}</Typography.Text>
        </List.Item>
      )}
    />
  );
}
