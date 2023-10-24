import React, { useEffect } from 'react';
import CustomerLayout from '../../layouts/CustomerLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../redux/customer/actions';
import CaseHeading from '../partials/CaseHeading';
import { Button, Card, Form, Input } from 'antd';
import { ValidationRules } from '../../../constants/validation';
import StepWizardHeading from '../../ui/StepWizardHeading';
import { SubmitButtonProps } from '../../ui/ElementProps';

export default function Refusal() {
  const { treat, isRejectTreat } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch({
        type: actions.GET_TREAT,
        payload: { id },
      });
    }
  }, [id]);

  const onFinish = (values) => {
    dispatch({
      type: actions.REJECT_TREAT,
      payload: {
        treat_id: id,
        description: values.description,
      },
    });
    if (!isRejectTreat) navigate(-1);
  };

  return (
    <CustomerLayout>
      <CaseHeading noAction />
      <Form layout="vertical" className="refusal-form" onFinish={onFinish}>
        <StepWizardHeading
          title="Fyll ut avslagsbeskrivelse"
          description={`Fyll ut beskrivelse pa hvorfor ${treat?.insurance_company.company_name} gir avslag pa saken.`}
        />
        <Card title="Avslagsbeskrivelse">
          <Form.Item
            name="description"
            label="Beskrivelse pa avslag"
            rules={ValidationRules.input}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button loading={isRejectTreat} {...SubmitButtonProps}>
              FULLFØR
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </CustomerLayout>
  );
}
