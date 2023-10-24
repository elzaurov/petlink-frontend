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
import { LINK_ADMIN_VET_CREATION } from '../../../constants/links';
import Heading from '../../ui/Heading';

export default function VetList() {
  const { isFetchingVets, vets } = useSelector((state) => state.admin);
  const [filter, setFilter] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filteredVets = useMemo(() => {
    const lowercaseFilter = filter.toLowerCase();
    return vets.filter(
      (vet) =>
        vet.company_number.toLowerCase().includes(lowercaseFilter) ||
        vet.company_name.toLowerCase().includes(lowercaseFilter) ||
        vet.name.toLowerCase().includes(lowercaseFilter) ||
        vet.email.toLowerCase().includes(lowercaseFilter) ||
        vet.phone.toLowerCase().includes(lowercaseFilter)
    );
  }, [vets, filter]);

  useEffect(() => {
    dispatch({
      type: actions.GET_VETS,
    });
  }, []);

  const columns = [
    {
      title: lang.admin.orgNumberShort,
      dataIndex: 'company_number',
      key: 'company_number',
    },
    {
      title: lang.admin.clinlic,
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
        <Link to={`/admin/vet/${record.id}/edit`}>
          <FontAwesomeIcon icon={faEdit} style={{ fontSize: 20 }} />
        </Link>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Row className="header-box" justify="space-between" wrap>
        <Col xl={12} xs={24}>
          <Heading text={lang.admin.vets} size={2} />
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
            placeholder={lang.admin.searchVets}
            {...SearchInputProps}
            onChange={(evt) => setFilter(evt.target.value)}
          />
          <Button
            {...NormalButtonProps}
            onClick={() => navigate(LINK_ADMIN_VET_CREATION)}
          >
            {lang.admin.createVet}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            loading={isFetchingVets}
            columns={columns}
            dataSource={filteredVets}
            rowKey={'id'}
          />
        </Col>
      </Row>
    </AdminLayout>
  );
}
