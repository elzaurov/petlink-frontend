import React, { useEffect } from 'react';
import {
  Input,
  Row,
  Col,
  Button,
  Radio,
  Card,
  Form,
  Upload,
  Divider,
  DatePicker,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudUpload,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { ValidationRules } from '../../../constants/validation';
import StepWizardHeading from '../../ui/StepWizardHeading';
import {
  ActionIconProps,
  DefaultButtonProps,
  ActionButtonProps,
  DatePickerProps,
} from '../../ui/ElementProps';
import { lang } from '../../../constants/lang';
import AddableSelect from '../../ui/AddableSelect';

const Field = ({ field, onRemove, onFieldValueChange, initialFiles }) => {
  return (
    <React.Fragment key={field.key}>
      <Row justify="space-between" align="middle">
        <Col span={23}>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={14}>
              <Form.Item
                label="Vedlegg"
                valuePropName="file"
                name={[field.name, 'file']}
                rules={[
                  ...ValidationRules.input,
                  {
                    validator: (_, value) => {
                      if (value.file.status !== 'removed') {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(lang.validation.required)
                      );
                    },
                  },
                ]}
              >
                <Upload.Dragger
                  name="file"
                  accept="image/png, image/jpeg, application/pdf"
                  onChange={(file) =>
                    onFieldValueChange(field.name, 'file', file)
                  }
                  action="/api/upload"
                  multiple={false}
                  maxCount={1}
                  defaultFileList={initialFiles}
                >
                  <div className="upload-dragger">
                    <p className="ant-upload-drag-icon">
                      <FontAwesomeIcon
                        icon={faCloudUpload}
                        style={{ fontSize: 26, color: '#0293d9' }}
                      />
                    </p>
                    <p className="ant-upload-text">
                      Klikk eller dra filer til dette området for å laste opp
                    </p>
                  </div>
                </Upload.Dragger>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={10}>
              <Form.Item
                label="Vedleggsbeskrivelse"
                name={[field.name, 'description']}
                rules={ValidationRules.input}
              >
                <AddableSelect
                  onChange={(value) =>
                    onFieldValueChange(field.name, 'description', value)
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col span={1} style={{ textAlign: 'right' }}>
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

export default function Injury({ formRef, newTreat, setNewTreat }) {
  useEffect(() => {
    formRef.current?.setFieldsValue(newTreat.injury);
    if (newTreat.injury.attachments.length === 0) {
      formRef.current?.setFieldValue('attachments', [
        { file: '', description: '' },
      ]);
    }
  }, [newTreat.petInfo, newTreat.currentStep]);

  const onChangeFormField = (field, value) => {
    setNewTreat({
      ...newTreat,
      injury: {
        ...newTreat.injury,
        [field]: value,
      },
    });
  };

  const onAttachmentFieldValueChange = (idx, field, value) => {
    let attachments = newTreat.injury.attachments;
    if (attachments.length - 1 < idx) {
      attachments = [...newTreat.injury.attachments, {}];
    }

    const updatedAttachments = attachments.map((attachment, index) => {
      if (index === idx) {
        return {
          ...attachment,
          [field]: value,
        };
      }
      return attachment;
    });
    onChangeFormField('attachments', updatedAttachments);
  };

  const onRemoveAttachment = (idx) => {
    const updatedAttachments = newTreat.injury.attachments.filter(
      (attachment, index) => index !== idx
    );
    onChangeFormField('attachments', updatedAttachments);
  };

  return (
    <React.Fragment>
      <StepWizardHeading
        title="Hund"
        description="Fyll ut informasjon om skaden som har oppstått."
      />
      <Card title="Last opp vedlegg">
        <Form.List name="attachments">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => {
                return (
                  <Field
                    key={field.key}
                    field={field}
                    onRemove={(props) => {
                      remove(props);
                      onRemoveAttachment(field.name);
                    }}
                    initialFiles={
                      newTreat.injury.attachments[index]?.file?.fileList
                    }
                    onFieldValueChange={onAttachmentFieldValueChange}
                  />
                );
              })}

              <Form.Item>
                <Button
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
      </Card>
      <Card title="Informasjon om skaden">
        <Form.Item name="description" label="Kommentar">
          <Input.TextArea
            rows={4}
            onChange={(evt) =>
              onChangeFormField('description', evt.target.value)
            }
          />
        </Form.Item>
        <Form.Item
          name="injury_date"
          label="Dato skade/symptom"
          tooltip="Angi datoen da skaden/ulykken inntraff eller da symptomene først viste seg. Dersom dyreeier er usikker på dato, angi en omtrentlig dato."
          rules={ValidationRules.input}
        >
          <DatePicker
            {...DatePickerProps}
            format="YYYY-MM-DD"
            onChange={(value) => onChangeFormField({ injury_date: value })}
          />
        </Form.Item>
        <Form.Item
          name="has_treated"
          label="Antas pasienten å være ferdig behandlet?"
          rules={ValidationRules.radio}
        >
          <Radio.Group
            onChange={(evt) =>
              onChangeFormField('has_treated', evt.target.value)
            }
          >
            <Radio value={1}>Ja</Radio>
            <Radio value={0}>Nei</Radio>
          </Radio.Group>
        </Form.Item>
      </Card>
    </React.Fragment>
  );
}
