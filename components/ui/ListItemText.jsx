import { Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { ListItemContentProps } from './ElementProps';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../redux/customer/actions';

export default function ListItemText({ text, isEditable, field }) {
  const { isUpdatingTreat } = useSelector((state) => state.customer);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  const onChange = (value) => {
    dispatch({
      type: actions.UPDATE_TREAT_NUMBER,
      payload: {
        id: id,
        field: field,
        value: value,
      },
    });
  };

  useEffect(() => {
    if (!isUpdatingTreat) setIsEditing(false);
  }, [isUpdatingTreat]);

  if (isEditable) {
    return (
      <Spin spinning={isUpdatingTreat && isEditing}>
        <Typography.Text
          {...ListItemContentProps}
          editable={
            isEditable && {
              onChange: onChange,
              onStart: () => setIsEditing(true),
            }
          }
        >
          {text}
        </Typography.Text>
      </Spin>
    );
  }

  return <Typography.Text {...ListItemContentProps}>{text}</Typography.Text>;
}
