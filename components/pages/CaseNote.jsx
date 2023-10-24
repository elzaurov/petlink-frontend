import React, { useEffect } from 'react';
import CustomerLayout from '../layouts/CustomerLayout';
import CaseHeading from './partials/CaseHeading';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import actions from '../../redux/customer/actions';
import { Col, Row } from 'antd';
import FileViewer from './notes/FileViewer';
import NoteList from './notes/NoteList';

export default function CaseNote() {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch({
        type: actions.GET_NOTES,
        payload: { treatId: id },
      });
    }
  }, [id]);

  return (
    <CustomerLayout>
      <CaseHeading />
      <Row gutter={16}>
        <Col sm={24} xs={24} md={9}>
          <NoteList />
        </Col>
        <Col sm={24} xs={24} md={15}>
          <FileViewer />
        </Col>
      </Row>
    </CustomerLayout>
  );
}
