import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentMenuItem, setCurrentMenuItem] = useState('');

  useEffect(() => {
    if (location.pathname.includes('vet')) {
      setCurrentMenuItem('vets');
    }
    if (location.pathname.includes('insurance')) {
      setCurrentMenuItem('insurance-companies');
    }
    if (location.pathname.includes('treat')) {
      setCurrentMenuItem('treats');
    }
  }, [location.pathname]);

  const items = [
    {
      key: 'vets',
      label: 'Veterinærer',
      onClick: () => navigate('/admin/vets'),
    },
    {
      key: 'insurance-companies',
      label: 'Forsikringsselskaper',
      onClick: () => navigate('/admin/insurance-companies'),
    },
    {
      key: 'treats',
      label: 'Saker',
      onClick: () => navigate('/admin/treats'),
    },
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[currentMenuItem]}
      items={items}
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        flex: 1,
      }}
    />
  );
};

export default Navbar;
