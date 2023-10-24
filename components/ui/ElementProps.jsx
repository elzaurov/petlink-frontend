import React from 'react';
import { UserOutlined, LockOutlined, SearchOutlined } from '@ant-design/icons';
import { lang } from '../../constants/lang';
import { ASSET_LOGO } from '../../constants/links';

export const NormalInputProps = {
  size: 'large',
};

export const EmailInputProps = {
  size: 'large',
  prefix: <UserOutlined />,
  placeholder: lang.element.email,
};

export const PasswordInputProps = {
  size: 'large',
  prefix: <LockOutlined />,
  type: 'password',
  placeholder: lang.element.password,
};

export const SubmitButtonProps = {
  htmlType: 'submit',
  type: 'primary',
  size: 'large',
  style: {
    float: 'right',
  },
};

export const EditButtonProps = {
  type: 'primary',
  size: 'middle',
  style: {
    float: 'right',
    width: 100,
  },
};

export const SearchInputProps = {
  prefix: <SearchOutlined />,
  size: 'large',
};

export const NormalButtonProps = {
  type: 'primary',
  size: 'large',
};

export const FullWidthButtonProps = {
  type: 'primary',
  size: 'large',
  style: {
    width: '100%',
    margin: '10px 0',
  },
};

export const LinkButtonProps = {
  type: 'link',
  size: 'large',
};

export const DefaultButtonProps = {
  type: 'default',
};

export const ActionButtonProps = {
  style: { float: 'right' },
};

export const LogoImageProps = {
  src: ASSET_LOGO,
  alt: 'Petlink',
  preview: false,
  style: { cursor: 'pointer', height: 35 },
};

export const DefaultSelectProps = {
  size: 'large',
};

export const SelectProps = {
  size: 'large',
  style: { width: '180px' },
};

export const DatePickerProps = {
  size: 'large',
  style: { width: '100%' },
};

export const ActionIconProps = {
  style: { fontSize: '18px', cursor: 'pointer', color: 'rgba(0, 0, 0, 0.5)' },
};

export const ListItemContentProps = {
  style: { fontSize: 14 },
  type: 'secondary',
};

export const ListItemLinkContentProps = {
  style: {
    fontSize: 14,
    color: '#0293d9',
    cursor: 'pointer',
    fontWeight: 300,
  },
  underline: true,
};

export const DescriptionProps = {
  style: {
    fontSize: 14,
    color: '#6b6b6b',
    fontWeight: 300,
  },
};
