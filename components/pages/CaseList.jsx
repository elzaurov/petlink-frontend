import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Select,
  Row,
  Col,
  Table,
  Tag,
  Input,
  Space,
  Popconfirm,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { statusOptions } from '../../constants/treat';
import {
  NormalButtonProps,
  SearchInputProps,
  SelectProps,
} from '../ui/ElementProps';
import { lang } from '../../constants/lang';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../redux/customer/actions';
import { LINK_CUSTOMER_NEW_CASE } from '../../constants/links';

import CustomerLayout from '../layouts/CustomerLayout';
import Heading from '../ui/Heading';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faEye,
  faTrash,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

export default function CaseList() {
  const { treats, isFetchingTreats, isDraftingSuccess } = useSelector(
    (state) => state.customer
  );
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({
    keyword: '',
    status: 'All',
  });

  useEffect(() => {
    dispatch({
      type: actions.GET_MY_TREATS,
    });
  }, []);

  useEffect(() => {
    const draftData = localStorage.getItem('draftCaseData');
    if (draftData) {
      const data = JSON.parse(draftData);
      if (data.petInfo.pet_name) {
        dispatch({
          type: actions.DRAFT_TREAT,
          payload: {
            treat_id: data.treat_id,
            step: data.currentStep,
            ...data.petInfo,
            ...data.contactInfo,
            invoices: data.invoices,
            ...data.injury,
          },
        });
      }
    }
  }, []);

  useEffect(() => {
    if (isDraftingSuccess) {
      localStorage.removeItem('draftCaseData');
    }
  }, [isDraftingSuccess]);

  const filteredTreats = useMemo(() => {
    const lowercaseKeyword = filter.keyword.toLowerCase();
    return treats.filter(
      (treat) =>
        ('#' + treat.id == lowercaseKeyword ||
          treat.caretaker?.name?.toLowerCase().includes(lowercaseKeyword) ||
          treat.pet_name.toLowerCase().includes(lowercaseKeyword) ||
          treat.insurance_company?.company_name
            .toLowerCase()
            .includes(lowercaseKeyword) ||
          treat.case_no?.toLowerCase().includes(lowercaseKeyword) ||
          treat.claim_no?.toLowerCase().includes(lowercaseKeyword)) &&
        (filter.status === 'All' || treat.status === filter.status)
    );
  }, [treats, filter]);

  const onDelete = (id) => {
    dispatch({
      type: actions.DELETE_TREAT,
      payload: { id },
    });
  };

  const columns = [
    {
      title: lang.treat.treatNo,
      dataIndex: 'display_id',
      key: 'display_id',
      width: 70,
      render: (text) => `${text}`,
    },
    {
      title: 'DATO',
      dataIndex: 'created_at',
      key: 'created_at',
      ellipsis: true,
      render: (date) => `${dayjs(date).format('DD.MM.YYYY')}`,
    },
    {
      title: 'DYREEIER',
      key: 'caretaker',
      ellipsis: true,
      render: (record) =>
        `${
          record.caretaker && record.caretaker.name
            ? record.caretaker.name
            : 'N/A'
        }`,
    },
    {
      title: 'PASIENT',
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
      render: (text) => `${text ? text : 'N/A'}`,
      responsive: ['xl'],
    },
    {
      title: lang.treat.treatClaimNo,
      dataIndex: 'claim_no',
      key: 'claim_no',
      ellipsis: true,
      render: (text) => `${text ? text : 'N/A'}`,
      responsive: ['xl'],
    },
    {
      title: lang.treat.treatName,
      key: 'insuranceCompanyName',
      ellipsis: true,
      render: (record) => `${record.insurance_company?.company_name || 'N/A'}`,
      responsive: ['sm'],
    },
    {
      title: lang.treat.treatStatus,
      key: 'status',
      dataIndex: 'status',
      ellipsis: true,
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
    {
      title: 'HANDLING',
      align: 'right',
      render: (record) => {
        if (record.isDrafted) {
          return (
            <Space>
              <Button
                size="small"
                type="link"
                onClick={() => navigate(`/case/${record.id}/edit`)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Popconfirm
                title="Slett denne saken"
                description="Er du sikker på at du ønsker å slette?"
                icon={
                  <FontAwesomeIcon
                    color="orange"
                    icon={faExclamationTriangle}
                  />
                }
                okText="Ja"
                cancelText="Nei"
                onConfirm={() => onDelete(record.id)}
              >
                <Button size="small" type="link">
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </Popconfirm>
            </Space>
          );
        }
        return (
          <Button
            size="small"
            type="link"
            onClick={() => navigate(`/case/${record.id}`)}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
        );
      },
    },
  ];

  return (
    <CustomerLayout>
      <Row
        gutter={[16, 16]}
        className="header-box"
        justify="space-between"
        wrap
      >
        <Col xl={12} xs={24}>
          <Heading text={lang.treat.myTreats} size={2} />
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
            placeholder="Søk etter ID, Dyretsnavn, Saksnummer, Skadenummer"
            {...SearchInputProps}
            onChange={(evt) =>
              setFilter({ ...filter, keyword: evt.target.value })
            }
          />
          <Select
            {...SelectProps}
            value={filter.status}
            onChange={(value) => setFilter({ ...filter, status: value })}
          >
            <Select.Option value="All">{lang.treat.all}</Select.Option>
            {statusOptions.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
          {user.isVet && (
            <Button
              {...NormalButtonProps}
              onClick={() => navigate(LINK_CUSTOMER_NEW_CASE)}
            >
              {lang.treat.createNewTreat}
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={filteredTreats}
            loading={isFetchingTreats}
            rowKey={'id'}
          />
        </Col>
      </Row>
    </CustomerLayout>
  );
}
