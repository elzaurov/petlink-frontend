import React, { useEffect, useState, useMemo } from 'react';
import { Button, Col, Input, Row, Table } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { lang } from '../../../constants/lang';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../redux/admin/actions';
import { NormalButtonProps, SearchInputProps } from '../../ui/ElementProps';
import { LINK_ADMIN_INSURANCE_COMPANY_CREATION } from '../../../constants/links';
import Heading from '../../ui/Heading';

export default function InsuranceCompanyList() {
  const { isFetchingInsuranceCompanies, insuranceCompanies } = useSelector(
    (state) => state.admin
  );
  const [filter, setFilter] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filteredInsuranceCompanies = useMemo(() => {
    const lowercaseFilter = filter.toLowerCase();
    return insuranceCompanies.filter(
      (ic) =>
        ic.company_number.toLowerCase().includes(lowercaseFilter) ||
        ic.company_name.toLowerCase().includes(lowercaseFilter) ||
        ic.name.toLowerCase().includes(lowercaseFilter) ||
        ic.email.toLowerCase().includes(lowercaseFilter) ||
        ic.phone.toLowerCase().includes(lowercaseFilter)
    );
  }, [insuranceCompanies, filter]);

  useEffect(() => {
    dispatch({
      type: actions.GET_INSURANCE_COMPANIES,
    });
  }, []);

  const columns = [
    {
      title: lang.admin.orgNumberShort,
      dataIndex: 'company_number',
      key: 'company_number',
    },
    {
      title: lang.admin.company,
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: lang.admin.contact,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: lang.admin.email,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: lang.admin.phone,
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: lang.admin.action,
      key: 'id',
      dataIndex: 'id',
      align: 'end',
      render: (_, record) => (
        <Link to={`/admin/insurance-company/${record.id}/edit`}>
          <FontAwesomeIcon icon={faEdit} style={{ fontSize: 20 }} />
        </Link>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Row className="header-box" justify="space-between" wrap>
        <Col xl={12} xs={24}>
          <Heading text={lang.admin.insuranceCompanies} size={2} />
        </Col>
        <Col
          xs={24}
          xl={12}
          flex="none"
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Input
            placeholder={lang.admin.searchInsuranceCompanies}
            {...SearchInputProps}
            onChange={(evt) => setFilter(evt.target.value)}
          />
          <Button
            {...NormalButtonProps}
            onClick={() => navigate(LINK_ADMIN_INSURANCE_COMPANY_CREATION)}
          >
            {lang.admin.createInsuranceCompany}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            loading={isFetchingInsuranceCompanies}
            columns={columns}
            dataSource={filteredInsuranceCompanies}
            rowKey={'id'}
          />
        </Col>
      </Row>
    </AdminLayout>
  );
}
