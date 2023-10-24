import React, { useState } from 'react';
import {
  Input,
  Row,
  Col,
  Button,
  Card,
  Form,
  Upload,
  Divider,
  Layout,
  Space,
  Typography,
  Modal,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudUpload,
  faPlus,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ValidationRules } from '../../constants/validation';
import {
  ActionIconProps,
  DefaultButtonProps,
  NormalInputProps,
  ActionButtonProps,
  NormalButtonProps,
} from '../ui/ElementProps';
import Logo from '../ui/Logo';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../redux/customer/actions';
import { useParams } from 'react-router-dom';

const Field = ({ field, onRemove, initialFiles }) => {
  return (
    <React.Fragment key={field.key}>
      <Row justify="space-between" align="middle">
        <Col span={20}>
          <Form.Item
            label="Vedlegg"
            valuePropName="file"
            name={[field.name, 'file']}
            rules={ValidationRules.uploader}
          >
            <Upload.Dragger
              name="file"
              accept="image/png, image/jpeg, application/pdf"
              multiple={false}
              maxCount={1}
              action="/api/upload"
              defaultFileList={initialFiles}
            >
              <p className="ant-upload-drag-icon">
                <FontAwesomeIcon
                  icon={faCloudUpload}
                  style={{ fontSize: 26, color: '#0293d9' }}
                />
              </p>
              <p className="ant-upload-text">
                Klikk eller dra filer til dette området for å laste opp
              </p>
            </Upload.Dragger>
          </Form.Item>
          <Row>
            <Col lg={{ span: 12, offset: 4 }} md={24} xs={24} sm={24}>
              <Form.Item
                label="Vedleggsbeskrivelse"
                name={[field.name, 'description']}
                rules={ValidationRules.input}
              >
                <Input {...NormalInputProps} />
              </Form.Item>
            </Col>
            <Col lg={8} md={24} xs={24} sm={24}>
              <Form.Item label="Beløp" name={[field.name, 'cost']}>
                <Input {...NormalInputProps} />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          <FontAwesomeIcon
            icon={faTimesCircle}
            {...ActionIconProps}
            onClick={() => onRemove(field.name)}
          />
        </Col>
      </Row>
      <Divider />
    </React.Fragment>
  );
};

const { Content } = Layout;

export default function PetOwner() {
  const { token } = useParams();
  const { isUploadingPetOwnerFiles } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const onSend = () => {
    form.validateFields().then(() => {
      setModalOpen(true);
    });
  };

  const onSubmit = () => {
    setModalOpen(false);
    dispatch({
      type: actions.UPLOAD_PET_OWNER_FILES,
      payload: {
        token: token,
        ...form.getFieldsValue(),
      },
    });
  };

  return (
    <Layout className="pet-owner-layout">
      <Content>
        <Row gutter={[32, 32]}>
          <Col span={24} align="center">
            <Space align="center" direction="vertical" size="large">
              <Logo />
              <Typography.Title level={3}>
                Last opp nødvendig dokumentasjon.
              </Typography.Title>
              <Typography.Text>
                Hvis du har hatt egne utgifter i skadesaken i tillegg til
                utgiftene for veterinærbesøket, kan du laste opp
                dokumentasjonen. Dette kan være skjermbilder eller lignende.
              </Typography.Text>
            </Space>
          </Col>
          <Col span={24}>
            <Card
              loading={isUploadingPetOwnerFiles}
              title="Last opp vedlegg"
              actions={[
                <Button {...NormalButtonProps} onClick={onSend}>
                  SEND INN
                </Button>,
              ]}
            >
              <Form
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ attachments: [{ file: '', description: '' }] }}
              >
                <Row justify="space-between" align="middle">
                  <Col span={20}>
                    <Form.Item
                      name="bank_account_number"
                      label="Kontonummer for utbetaling"
                    >
                      <Input {...NormalInputProps} />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Form.List name="attachments">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => {
                        return (
                          <Field
                            key={field.key}
                            field={field}
                            onRemove={remove}
                          />
                        );
                      })}

                      <Form.Item wrapperCol={{ span: 24 }}>
                        <Button
                          icon={
                            <FontAwesomeIcon
                              icon={faPlus}
                              style={{ marginRight: 5 }}
                            />
                          }
                          {...DefaultButtonProps}
                          {...ActionButtonProps}
                          onClick={() => add()}
                        >
                          NYTT VEDLEGG
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form>
            </Card>
            <Modal centered open={modalOpen} closable={false} footer={false}>
              <Space
                align="center"
                direction="vertical"
                size="large"
                style={{ width: '100%' }}
              >
                <Typography.Title level={4}>Vennligst bekreft</Typography.Title>
                <Typography.Text>
                  Er du ferdig med å laste opp dokumentasjon?
                </Typography.Text>
                <Space>
                  <Button size="middle" onClick={() => setModalOpen(false)}>
                    Nei
                  </Button>
                  <Button type="primary" size="middle" onClick={onSubmit}>
                    Ja, send inn
                  </Button>
                </Space>
              </Space>
            </Modal>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
