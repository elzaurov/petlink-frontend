import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Card, Form, Input, Button, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { NormalInputProps, SubmitButtonProps } from '../../ui/ElementProps';
import { useParams, useNavigate } from 'react-router-dom';
import { lang } from '../../../constants/lang';
import { ValidationRules } from '../../../constants/validation';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../redux/admin/actions';
import { LINK_ADMIN_INSURANCE_COMPANY_LIST } from '../../../constants/links';
import AdminBackButton from '../partials/AdminBackButton';
import { downloadLogoFile } from '../../../utils/file';

export default function InsuranceCompanyForm() {
  const {
    isAddingInsuranceCompany,
    insuranceCompany,
    isFetchingInsuranceCompany,
  } = useSelector((state) => state.admin);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [fileList, setFileList] = useState([]);
  const [isFileDownloading, setIsFileDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch({
        type: actions.GET_INSURANCE_COMPANY,
        payload: { id },
      });
    }
  }, [id]);

  useEffect(() => {
    async function fetchLogo() {
      if (insuranceCompany) {
        if (insuranceCompany.logo) {
          setIsFileDownloading(true);
          const logoPath = insuranceCompany.logo;
          const file = await downloadLogoFile(logoPath);
          setFileList([file]);
          form.setFieldsValue({ logo: [file] });
          setIsFileDownloading(false);
        }
      }
    }
    form.setFieldsValue(insuranceCompany);
    fetchLogo();
  }, [insuranceCompany, form]);

  const onChange = ({ fileList }) => {
    setFileList(fileList);
    form.setFieldsValue({ logo: fileList });
    form.validateFields(['logo']);
  };

  const onRemove = () => {
    setFileList([]);
    form.setFieldsValue({ logo: [] });
  };

  const onPreview = async () => {
    let src;
    if (fileList.length > 0) {
      src = URL.createObjectURL(fileList[0]);
    } else {
      return;
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onSubmit = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === 'logo') {
        formData.append(key, values[key][0]['originFileObj']);
      } else {
        formData.append(key, values[key]);
      }
    });

    if (id) {
      formData.append('_method', 'PUT');
      dispatch({
        type: actions.UPDATE_INSURANCE_COMPANY,
        payload: { id, data: formData },
      });
    } else {
      dispatch({
        type: actions.ADD_INSURANCE_COMPANY,
        payload: formData,
      });
      form.resetFields();
      setFileList([]);
    }
  };

  return (
    <AdminLayout>
      <AdminBackButton
        title={lang.admin.newInsuranceCompany}
        onClick={() => navigate(LINK_ADMIN_INSURANCE_COMPANY_LIST)}
      />
      <Form
        form={form}
        className="form"
        layout="vertical"
        name="insurance-company-creation"
        onFinish={onSubmit}
      >
        <Card
          loading={isFetchingInsuranceCompany || isFileDownloading}
          title={lang.admin.contactInfo}
        >
          <Form.Item
            name="logo"
            valuePropName="fileList"
            label="Logo"
            rules={ValidationRules.input}
          >
            <ImgCrop rotationSlider>
              <Upload
                fileList={fileList}
                name="logo"
                listType="picture-card"
                beforeUpload={() => false}
                onChange={onChange}
                onPreview={onPreview}
                onRemove={onRemove}
              >
                {fileList.length < 1 && '+ Last opp'}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item
            name="company_name"
            label={lang.admin.companyName}
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
        </Card>
        <Card
          loading={isFetchingInsuranceCompany || isFileDownloading}
          title={lang.admin.createPassword}
        >
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
          <Button loading={isAddingInsuranceCompany} {...SubmitButtonProps}>
            {lang.admin.create}
          </Button>
        </Form.Item>
      </Form>
    </AdminLayout>
  );
}
