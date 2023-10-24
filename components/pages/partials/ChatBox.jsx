import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Space,
  Typography,
  Empty,
  Skeleton,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import View from '../../ui/View';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../redux/customer/actions';
import { getAbbreviation } from '../../../utils/helpers';
import dayjs from 'dayjs';
import 'dayjs/locale/nb';
import { useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function ChatBox() {
  const dispatch = useDispatch();
  const { isSendingMessage, treat, isFetchingTreat } = useSelector(
    (state) => state.customer
  );
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const { id } = useParams();
  const messageBoxRef = useRef(null);

  useEffect(() => {
    const channelName = `chat-${id}`;
    const channel = Echo.private(channelName);

    channel.listen('.NewMessage', function (data) {
      dispatch({
        type: actions.NEW_MESSAGE,
        payload: data.message,
      });
    });

    return () => {
      window.Echo.leave(channelName);
    };
  }, [id]);

  useEffect(() => {
    // Scroll to the bottom of the message box
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [treat]);

  const onSendMessage = () => {
    dispatch({
      type: actions.SEND_MESSAGE,
      payload: {
        treat_id: id,
        message: message,
      },
    });
    setMessage('');
  };

  const groupedMessages = useMemo(() => {
    if (!treat || treat.messages.length === 0) {
      return {};
    }
    return treat.messages.reduce((result, message) => {
      const date = dayjs(message.created_at)
        .locale('nb')
        .format('dddd, D. MMMM');

      if (!result[date]) {
        result[date] = [];
      }
      result[date].push(message);
      return result;
    }, {});
  }, [treat]);

  const renderListItem = (item) => {
    const isOwnMessage = item.user_id === user.id;
    let userName = '';
    if (user.isVet) {
      userName = isOwnMessage ? treat.vet.name : treat.insurance_company.name;
    } else {
      userName = isOwnMessage ? treat.insurance_company.name : treat.vet.name;
    }

    return (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar size={50}>{getAbbreviation(userName)}</Avatar>}
          title={
            <Space>
              <Typography.Text>{userName}</Typography.Text>
              <Typography.Text className="time">
                {dayjs(item.created_at).format('HH:mm')}
              </Typography.Text>
            </Space>
          }
          description={
            <div dangerouslySetInnerHTML={{ __html: item.message }} />
          }
        />
      </List.Item>
    );
  };

  return (
    <Card className="chat-box">
      <div
        style={{ overflowY: 'auto', height: '750px', marginBottom: 90 }}
        ref={messageBoxRef}
      >
        {isFetchingTreat ? (
          <Skeleton active avatar style={{ padding: 20 }} />
        ) : Object.entries(groupedMessages).length > 0 ? (
          Object.entries(groupedMessages).map(([date, messages]) => {
            return (
              <React.Fragment key={date}>
                <Divider style={{ color: '#ccced1' }}>{date}</Divider>
                <List
                  itemLayout="horizontal"
                  dataSource={messages}
                  renderItem={renderListItem}
                />
              </React.Fragment>
            );
          })
        ) : (
          <Empty description="Ingen meldinger" style={{ marginTop: '100px' }} />
        )}
      </div>
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          padding: 10,
        }}
      >
        <CKEditor
          editor={ClassicEditor}
          config={{
            toolbar: ['bold', 'italic', 'bulletedList', 'numberedList'],
          }}
          data={message}
          onChange={(event, editor) => {
            const data = editor.getData();
            setMessage(data);
          }}
        />
      </View>
      <View
        style={{
          height: 40,
          position: 'absolute',
          right: 10,
          bottom: 10,
          zIndex: 99,
        }}
      >
        <Button
          loading={isSendingMessage}
          size="large"
          type="link"
          style={{ height: 40 }}
          onClick={onSendMessage}
        >
          <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: 20 }} />
        </Button>
      </View>
    </Card>
  );
}
