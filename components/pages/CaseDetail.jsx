import React, { useEffect } from 'react';
import CustomerLayout from '../layouts/CustomerLayout';
import { Row, Col, Collapse, Spin } from 'antd';
import CaseInfoBox from './partials/CaseInfoBox';
import ChatBox from './partials/ChatBox';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../redux/customer/actions';
import CaseHeading from './partials/CaseHeading';
import View from '../ui/View';

export default function CaseDetail() {
  const { isRejectTreat, isCompleteTreat, isDeleteTreat, isReopenTreat } =
    useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch({
        type: actions.GET_TREAT,
        payload: { id },
      });
    }
  }, [id]);

  return (
    <CustomerLayout>
      <Spin
        spinning={
          isRejectTreat || isCompleteTreat || isDeleteTreat || isReopenTreat
        }
      >
        <CaseHeading />
        <View style={{ marginLeft: '-8px', marginRight: '-8px' }}>
          <Row gutter={[16, 16]}>
            <Col xl={16} sm={24} xs={24}>
              <ChatBox />
            </Col>
            <Col xl={8} sm={24} xs={24}>
              <Collapse
                className="case-info-collapse"
                accordion
                defaultActiveKey={['case-info']}
                expandIconPosition="start"
              >
                <Collapse.Panel header="Saksoversikt" key="case-info">
                  <CaseInfoBox />
                </Collapse.Panel>
              </Collapse>
            </Col>
          </Row>
        </View>
      </Spin>
    </CustomerLayout>
  );
}
