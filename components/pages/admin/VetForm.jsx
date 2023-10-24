import React, { useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Card, Form, Input, Button } from 'antd';
import { NormalInputProps, SubmitButtonProps } from '../../ui/ElementProps';
import { useParams, useNavigate } from 'react-router-dom';
import { lang } from '../../../constants/lang';
import { ValidationRules } from '../../../constants/validation';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../redux/admin/actions';
import { LINK_ADMIN_VET_LIST } from '../../../constants/links';
import AdminBackButton from '../partials/AdminBackButton';

export default function VetForm() {
  const { isAddingVet, vet, isFetchingVet } = useSelector(
    (state) => state.admin
  );
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      dispatch({
        type: actions.GET_VET,
        payload: { id },
      });
    }
  }, [id]);

  useEffect(() => {
    if (vet) {
      form.setFieldsValue(vet);
    }
  }, [vet, form]);

  const onSubmit = (values) => {
    if (id) {
      dispatch({
        type: actions.UPDATE_VET,
        payload: { id, ...values },
      });
    } else {
      dispatch({
        type: actions.ADD_VET,
        payload: values,
      });
      form.resetFields();
    }
  };

  return (
    <AdminLayout>
      <AdminBackButton
        title={lang.admin.newVet}
        onClick={() => navigate(LINK_ADMIN_VET_LIST)}
      />
      <Form
        form={form}
        className="form"
        layout="vertical"
        name="vet-creation"
        onFinish={onSubmit}
      >
        <Card loading={isFetchingVet} title={lang.admin.contactInfo}>
          <Form.Item
            name="company_name"
            label={lang.admin.clinlicName}
            rules={ValidationRules.input}
          >
            <Input {...NormalInputProps} />
          </Form.Item>
          <Form.Item
            name="company_number"
            label={lang.admin.orgNumber}
            rules={ValidationRules.input}
          >
            <Input {...NormalInputProps} />
          </Form.Item>
          <Form.Item
            name="name"
            label={lang.admin.personName}
            rules={ValidationRules.input}
          >
            <Input {...NormalInputProps} />
          </Form.Item>
          <Form.Item
            name="email"
            label={lang.admin.email}
            rules={ValidationRules.input}
          >
            <Input {...NormalInputProps} disabled={id} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={lang.admin.phone}
            rules={ValidationRules.input}
          >
            <Input {...NormalInputProps} />
          </Form.Item>
          <Form.Item
            name="address"
            label={lang.admin.address}
            rules={ValidationRules.input}
          >
            <Input {...NormalInputProps} />
          </Form.Item>
        </Card>
        <Card loading={isFetchingVet} title={lang.admin.bankInfo}>
          <Form.Item
            name="bank_account_number"
            label={lang.admin.bankAccountNumber}
            rules={ValidationRules.input}
          >
            <Input {...NormalInputProps} />
          </Form.Item>
        </Card>
        <Card loading={isFetchingVet} title={lang.admin.createPassword}>
          <Form.Item
            name="password"
            label={lang.admin.newPassword}
            rules={ValidationRules.password}
            initialValue={id ? 'petlink' : ''}
          >
            <Input.Password {...NormalInputProps} disabled={id} />
          </Form.Item>
          <Form.Item
            name="password_confirmation"
            label={lang.admin.repeatPassword}
            rules={ValidationRules.passwordMatch}
            initialValue={id ? 'petlink' : ''}
          >
            <Input.Password {...NormalInputProps} disabled={id} />
          </Form.Item>
        </Card>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button loading={isAddingVet} {...SubmitButtonProps}>
            {lang.admin.create}
          </Button>
        </Form.Item>
      </Form>
    </AdminLayout>
  );
}
