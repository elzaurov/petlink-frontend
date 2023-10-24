import React from 'react';
import { Space, Typography, Dropdown } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faGear,
  faList,
  faSignOut,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../redux/auth/actions';
import { lang } from '../../../constants/lang';
import Heading from '../../ui/Heading';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch({ type: actions.LOGOUT });
  };

  const items = [
    {
      key: '1',
      label: lang.menu.cases,
      icon: <FontAwesomeIcon icon={faList} />,
      onClick: () => navigate('/cases'),
    },
    {
      key: '2',
      label: lang.menu.settings,
      icon: <FontAwesomeIcon icon={faGear} />,
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: lang.menu.logout,
      onClick: onLogout,
      icon: <FontAwesomeIcon icon={faSignOut} />,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <div className="user-info">
        <Space.Compact direction="vertical" align="end">
          <Typography.Text>{user.companyName}</Typography.Text>
          <Heading text={user?.name} size={5} />
        </Space.Compact>
        <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 14 }} />
      </div>
    </Dropdown>
  );
}
