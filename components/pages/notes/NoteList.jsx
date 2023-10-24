import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import actions from '../../../redux/customer/actions';
import { Button, Card, Input, List, Popconfirm, Space, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSave,
  faTimes,
  faTrashAlt,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import View from '../../ui/View';
import dayjs from 'dayjs';

export default function NoteList() {
  const {
    notes,
    isCreatingNote,
    isFetchingNotes,
    isUpdatingNote,
    isDeletingNote,
  } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isAddable, setIsAddable] = useState(false);
  const [note, setNote] = useState(null);

  const onSaveNote = () => {
    dispatch({
      type: actions.CREATE_NOTE,
      payload: { treatId: id, data: { note } },
    });
    setIsAddable(false);
    setNote(null);
  };

  const onUpdateNote = (val, id) => {
    if (val !== '') {
      dispatch({
        type: actions.UPDATE_NOTE,
        payload: { id, data: { note: val } },
      });
    }
  };

  const onDeleteNote = (id) => {
    dispatch({
      type: actions.DELETE_NOTE,
      payload: { id },
    });
  };

  return (
    <div>
      <Card className="note-content">
        <View style={{ width: '100%', textAlign: 'right' }}>
          {!isAddable ? (
            <Button
              icon={
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} />
              }
              onClick={() => setIsAddable(true)}
            >
              Skriv en notat
            </Button>
          ) : (
            <Space>
              <Button
                loading={isCreatingNote}
                icon={
                  <FontAwesomeIcon icon={faSave} style={{ marginRight: 5 }} />
                }
                onClick={onSaveNote}
              >
                Lagre notat
              </Button>
              <Button
                icon={
                  <FontAwesomeIcon icon={faTimes} style={{ marginRight: 5 }} />
                }
                onClick={() => setIsAddable(false)}
              >
                Avbryt notat
              </Button>
            </Space>
          )}
        </View>
        <View style={{ margin: '0.5rem 0' }}>
          {isAddable && (
            <Input.TextArea
              value={note}
              onChange={(evt) => setNote(evt.target.value)}
            />
          )}
        </View>
        <List
          loading={
            isFetchingNotes ||
            isCreatingNote ||
            isUpdatingNote ||
            isDeletingNote
          }
          dataSource={notes}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={
                  <Popconfirm
                    title="Slett dette notatet"
                    description="Er du sikker på at du ønsker å slette?"
                    icon={
                      <FontAwesomeIcon
                        color="orange"
                        icon={faExclamationTriangle}
                      />
                    }
                    okText="Ja"
                    cancelText="Nei"
                    onConfirm={() => onDeleteNote(item.id)}
                  >
                    <Button size="small" type="link">
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </Popconfirm>
                }
                title={
                  <Typography.Text
                    editable={{
                      onChange: (val) => onUpdateNote(val, item.id),
                    }}
                  >
                    {item.note}
                  </Typography.Text>
                }
                description={dayjs(item.updated_at).format(
                  'DD.MM.YYYY hh:mm:ss'
                )}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
