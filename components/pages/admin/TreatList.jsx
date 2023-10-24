import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Col, Row, Select, Table, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faCommentDots,
  faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';
import AdminLayout from '../../layouts/AdminLayout';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../redux/admin/actions';
import { lang } from '../../../constants/lang';
import { SelectProps } from '../../ui/ElementProps';
import { statusOptions } from '../../../constants/treat';
import Heading from '../../ui/Heading';

export default function TreatList() {
  const { vets, isFetchingVets, treats, isFetchingTreats } = useSelector(
    (state) => state.admin
  );
  const [filter, setFilter] = useState({
    vet: 0,
    status: 'Aktiv',
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: actions.GET_TREATS,
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: actions.GET_VETS,
    });
  }, []);

  const filteredTreats = useMemo(() => {
    if (filter.vet === 0) {
      return treats.filter((treat) => treat.status === filter.status);
    }
    return treats.filter(
      (treat) => treat.status === filter.status && treat.vet.id === filter.vet
    );
  }, [treats, filter]);

  const columns = [
    {
      title: lang.treat.treatNo,
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (text) => `#${text}`,
    },
    {
      title: 'DYRETSNAVN',
      dataIndex: 'pet_name',
      key: 'pet_name',
      ellipsis: true,
      render: (text) => `${text}`,
    },
    {
      title: lang.treat.treatCaseNo,
      dataIndex: 'case_no',
      key: 'case_no',
      ellipsis: true,
      responsive: ['xl'],
      render: (text) => `${text ? text : 'N/A'}`,
    },
    {
      title: lang.treat.treatClaimNo,
      dataIndex: 'claim_no',
      key: 'claim_no',
      ellipsis: true,
      responsive: ['xl'],
      render: (text) => `${text ? text : 'N/A'}`,
    },
    {
      title: lang.treat.treatName,
      key: 'insuranceCompanyName',
      ellipsis: true,
      responsive: ['sm'],
      render: (record) => `${record.insurance_company.company_name}`,
    },
    {
      title: lang.treat.treatConversation,
      dataIndex: 'messages',
      key: 'messages',
      align: 'center',
      responsive: ['sm'],
      render: (messages) => {
        if (messages.length === 0) {
          return (
            <FontAwesomeIcon
              icon={faCommentDots}
              style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.5)' }}
            />
          );
        } else {
          return (
            <Badge
              size="small"
              color="#0293d9"
              count={messages.length}
              overflowCount={999}
            >
              <FontAwesomeIcon
                icon={faCommentDots}
                style={{ fontSize: 18, color: '#0293d9' }}
              />
            </Badge>
          );
        }
      },
      ellipsis: true,
    },
    {
      title: 'UTGIFTER',
      dataIndex: 'files',
      key: 'files',
      align: 'center',
      responsive: ['sm'],
      render: (files) => {
        if (files.length > 0) {
          return (
            <Badge size="small" color="#0293d9" count={files.length}>
              <FontAwesomeIcon
                icon={faBook}
                style={{ fontSize: 18, color: '#0293d9' }}
              />
            </Badge>
          );
        } else {
          return (
            <FontAwesomeIcon
              icon={faBook}
              style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.5)' }}
            />
          );
        }
      },
      ellipsis: true,
    },
    {
      title: lang.treat.treatFiles,
      dataIndex: 'files',
      key: 'files',
      align: 'center',
      responsive: ['sm'],
      render: (files) => {
        if (files.length > 0) {
          return (
            <Badge size="small" color="#0293d9" count={files.length}>
              <FontAwesomeIcon
                icon={faFolderOpen}
                style={{ fontSize: 18, color: '#0293d9' }}
              />
            </Badge>
          );
        } else {
          return (
            <FontAwesomeIcon
              icon={faFolderOpen}
              style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.5)' }}
            />
          );
        }
      },
      ellipsis: true,
    },
    {
      title: lang.treat.treatStatus,
      key: 'status',
      dataIndex: 'status',
      ellipsis: true,
      align: 'right',
      render: (item) => {
        const activeStatus = statusOptions.find(
          (status) => status.value === item
        );
        return (
          <Tag color={activeStatus.color} key={item}>
            {item.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <Row className="header-box" justify="space-between" wrap>
        <Col xl={12} xs={24}>
          <Heading text={lang.treat.treat} size={2} />
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
          <Heading text={lang.treat.clinic} size={5} />
          <Select
            {...SelectProps}
            value={filter.vet}
            onChange={(value) => setFilter({ ...filter, vet: value })}
          >
            <Select.Option value={0}>{lang.treat.all}</Select.Option>
            {vets.map((vet) => (
              <Select.Option key={vet.id} value={vet.id}>
                {vet.company_name}
              </Select.Option>
            ))}
          </Select>
          <Heading text={lang.treat.status} size={5} />
          <Select
            {...SelectProps}
            value={filter.status}
            onChange={(value) => setFilter({ ...filter, status: value })}
            options={statusOptions}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            loading={isFetchingVets || isFetchingTreats}
            columns={columns}
            dataSource={filteredTreats}
            rowKey={'id'}
          />
        </Col>
      </Row>
    </AdminLayout>
  );
}
