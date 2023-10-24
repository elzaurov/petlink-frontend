import React, { useEffect, useMemo } from 'react';
import {
  Button,
  Row,
  Col,
  Table,
  Upload,
  Form,
  Input,
  Card,
  Spin,
  Divider,
  Typography,
  Space,
  Popconfirm,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faChevronLeft,
  faEye,
  faTrash,
  faUpload,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import StepWizardHeading from '../../ui/StepWizardHeading';
import { useDispatch, useSelector } from 'react-redux';
import PDFViewer from '../../ui/PDFViewer';
import actions from '../../../redux/customer/actions';
import { ValidationRules } from '../../../constants/validation';
import { NormalInputProps } from '../../ui/ElementProps';
import View from '../../ui/View';
import { formatPrice } from '../../../utils/helpers';

export default function Cost({ formRef, newTreat, setNewTreat }) {
  const dispatch = useDispatch();
  const {
    isUploadingInvoice,
    isSuccessInvoiceProcess,
    invoice,
    isDeleteInvoice,
  } = useSelector((state) => state.customer);

  const columns = [
    {
      title: 'Filnavn',
      render: (record) => record.file.original_name,
    },
    {
      title: 'Handling',
      align: 'right',
      render: (record) => [
        <Button
          key={`invoice-${record.id}-view-button`}
          type="link"
          size="small"
          onClick={() => {
            setNewTreat({
              ...newTreat,
              obInvoice: newTreat.invoices.find(
                (invoice) => invoice.id === record.id
              ),
            });
          }}
        >
          <FontAwesomeIcon icon={faEye} />
        </Button>,
        <Button
          key={`invoice-${record.id}-delete-button`}
          loading={isDeleteInvoice}
          type="link"
          size="small"
          onClick={() => {
            dispatch({ type: actions.DELETE_INVOICE, payload: record.id });
            setNewTreat({
              ...newTreat,
              invoices: newTreat.invoices.filter(
                (invoice) => invoice.id !== record.id
              ),
            });
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>,
      ],
    },
  ];

  const onUploadInvoice = ({ file }) => {
    dispatch({
      type: actions.UPLOAD_INVOICE,
      payload: { file },
    });
  };

  useEffect(() => {
    if (isSuccessInvoiceProcess) {
      setNewTreat({
        ...newTreat,
        invoices: [...newTreat.invoices, invoice],
        obInvoice: invoice,
      });
    }
  }, [isSuccessInvoiceProcess]);

  const totalCost = useMemo(() => {
    if (!newTreat.obInvoice) return 0;
    return newTreat.obInvoice.items.reduce(
      (acc, item) => acc + parseFloat(item.beløp),
      0
    );
  }, [newTreat.obInvoice]);

  useEffect(() => {
    if (newTreat.obInvoice) {
      formRef.current.setFieldsValue(newTreat.obInvoice);
      setNewTreat({
        ...newTreat,
        invoices: newTreat.invoices.map((invoice) => {
          if (invoice.id === newTreat.obInvoice.id) {
            return newTreat.obInvoice;
          } else {
            return invoice;
          }
        }),
      });
    }
  }, [newTreat.obInvoice]);

  const onChangeItem = (itemIndex, field, value) => {
    const updatedNewTreat = {
      ...newTreat,
      invoices: newTreat.invoices.map((invoice) => {
        if (invoice.id === newTreat.obInvoice.id) {
          return {
            ...invoice,
            items: invoice.items.map((item, index) => {
              if (itemIndex === index) {
                return { ...item, [field]: value };
              } else {
                return item;
              }
            }),
          };
        } else {
          return invoice;
        }
      }),
      obInvoice: {
        ...newTreat.obInvoice,
        items: newTreat.obInvoice.items.map((item, index) => {
          if (itemIndex === index) {
            return { ...item, [field]: value };
          } else {
            return item;
          }
        }),
      },
    };
    setNewTreat(updatedNewTreat);
  };

  const onChangeKID = (evt) => {
    setNewTreat({
      ...newTreat,
      invoices: newTreat.invoices.map((invoice) => {
        if (invoice.id === newTreat.obInvoice.id) {
          return { ...invoice, KID: evt.target.value };
        } else {
          return invoice;
        }
      }),
      obInvoice: { ...newTreat.obInvoice, KID: evt.target.value },
    });
  };

  const onDeleteItem = (invoiceId, itemIdx) => {
    const updatedNewTreat = {
      ...newTreat,
      invoices: newTreat.invoices.map((invoice) => {
        if (invoice.id === invoiceId) {
          return {
            ...invoice,
            items: invoice.items.filter((_, index) => index !== itemIdx),
          };
        } else {
          return invoice;
        }
      }),
      obInvoice: {
        ...newTreat.obInvoice,
        items: newTreat.obInvoice.items.filter((_, index) => index !== itemIdx),
      },
    };
    setNewTreat(updatedNewTreat);
  };

  const onAddItem = (invoiceId) => {
    const defaultItem = {
      beløp: 0,
      tekst: 'Ny elementet',
    };
    const updatedNewTreat = {
      ...newTreat,
      invoices: newTreat.invoices.map((invoice) => {
        if (invoice.id === invoiceId) {
          return {
            ...invoice,
            items: [...invoice.items, defaultItem],
          };
        } else {
          return invoice;
        }
      }),
      obInvoice: {
        ...newTreat.obInvoice,
        items: [...newTreat.obInvoice.items, defaultItem],
      },
    };
    setNewTreat(updatedNewTreat);
  };

  return (
    <React.Fragment>
      <StepWizardHeading
        title="Legg inn kostnader"
        description="Legg inn alle utgifter som har oppstått ved denne saken."
      />
      <Row className="btn-invoice-upload">
        <Col span={24}>
          <Upload
            beforeUpload={() => false}
            onChange={onUploadInvoice}
            showUploadList={false}
            multiple={false}
            maxCount={1}
            accept="application/pdf"
          >
            <Button
              icon={
                <FontAwesomeIcon icon={faUpload} style={{ marginRight: 5 }} />
              }
            >
              Last opp en faktura
            </Button>
          </Upload>
        </Col>
      </Row>
      <Spin
        spinning={isUploadingInvoice}
        tip={
          <Space
            direction="vertical"
            style={{
              width: '350px',
            }}
          >
            <Typography.Title style={{ color: '#0293d9' }} level={4}>
              Laster inn data
            </Typography.Title>
            <Typography.Text style={{ color: '#0293d9' }}>
              Vent mens vi laster inn data fra fakturaen, automatisk. Dette kan
              ta opp mot 15-60 sekunder.
            </Typography.Text>
          </Space>
        }
      >
        <Row className="invoice-view-panel" gutter={{ md: 16, sm: 0, xs: 0 }}>
          <Col sm={24} xs={24} md={10} lg={10} xl={10}>
            {newTreat.obInvoice ? (
              <Card>
                <Form.Item>
                  <Button
                    type="link"
                    icon={
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        style={{ marginRight: 5 }}
                      />
                    }
                    onClick={() => setObInvoice(null)}
                  >
                    Back
                  </Button>
                </Form.Item>
                <Form.List name="items">
                  {(items) => (
                    <>
                      {items.map((item, index) => (
                        <Row key={index} gutter={16}>
                          <Col span={15}>
                            <Form.Item
                              name={[item.name, 'tekst']}
                              label="Tekst"
                              rules={ValidationRules.input}
                            >
                              <Input
                                {...NormalInputProps}
                                onChange={(evt) =>
                                  onChangeItem(index, 'tekst', evt.target.value)
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={7}>
                            <Form.Item
                              name={[item.name, 'beløp']}
                              label="Beløp"
                              rules={ValidationRules.input}
                            >
                              <Input
                                {...NormalInputProps}
                                onChange={(e) => {
                                  onChangeItem(
                                    index,
                                    'beløp',
                                    parseFloat(e.target.value)
                                  );
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            <Form.Item label=" ">
                              <Popconfirm
                                title="Slett dette elementet"
                                description="Er du sikker på at du ønsker å slette?"
                                icon={
                                  <FontAwesomeIcon
                                    color="orange"
                                    icon={faExclamationTriangle}
                                  />
                                }
                                okText="Ja"
                                cancelText="Nei"
                                onConfirm={() =>
                                  onDeleteItem(newTreat.obInvoice.id, index)
                                }
                              >
                                <Button size="small" type="link">
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </Popconfirm>
                            </Form.Item>
                          </Col>
                        </Row>
                      ))}
                      <Row>
                        <Col span={24}>
                          <Button
                            type="default"
                            icon={
                              <FontAwesomeIcon
                                icon={faPlus}
                                style={{ marginRight: 5 }}
                              />
                            }
                            onClick={() => onAddItem(newTreat.obInvoice.id)}
                          >
                            Ny elementet
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </Form.List>

                <Divider />
                <Form.Item align="right">
                  <View style={{ width: '100%', textAlign: 'right' }}>
                    <Typography.Text strong>
                      Total: {formatPrice(totalCost)}
                    </Typography.Text>
                  </View>
                </Form.Item>
                <Divider />

                <Form.Item
                  label="KID"
                  name={'KID'}
                  rules={ValidationRules.input}
                >
                  <Input {...NormalInputProps} onChange={onChangeKID} />
                </Form.Item>
              </Card>
            ) : (
              <Table
                size="small"
                columns={columns}
                dataSource={newTreat.invoices}
                rowKey={'id'}
              />
            )}
          </Col>
          <Col sm={24} xs={24} md={14} xl={14} lg={14}>
            <PDFViewer
              fileId={newTreat.obInvoice && newTreat.obInvoice.file.id}
            />
          </Col>
        </Row>
      </Spin>
    </React.Fragment>
  );
}
