import {
  Button,
  Card,
  Input,
  InputNumber,
  List,
  Modal,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import View from '../../ui/View';
import { downloadFile } from '../../../utils/file';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';
import { formatPrice } from '../../../utils/helpers';
import { useSelector } from 'react-redux';

export default function PetOwnerInvoices({
  invoices,
  documents,
  sumDekket,
  sumIkkeDekket,
  updateInvoice,
  addNewInvoice,
}) {
  const { treat } = useSelector((state) => state.customer);
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const isEditable = !treat.isApproved && user.isInsurance;

  return (
    <Card>
      <View className="invoice-header">
        <Typography.Text>Velg hva som skal dekkes for dyreeier</Typography.Text>
        <Button type="default" onClick={() => setOpen(true)}>
          SE DOKUMENTASJON
        </Button>
      </View>
      <View>
        <table cellSpacing={0} width="100%">
          <thead>
            <tr>
              <th align="left" width="50%">
                Beskrivelse
              </th>
              <th>Beløp</th>
              <th width="20%">Beløp dekket</th>
              <th align="right">Ikke dekket</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index}>
                <td>
                  <Typography.Text
                    editable={
                      isEditable
                        ? {
                            onChange: (value) =>
                              updateInvoice(index, 'description', value),
                          }
                        : false
                    }
                  >
                    {invoice.description}
                  </Typography.Text>
                </td>
                <td align="center">
                  <Typography.Text
                    editable={
                      isEditable
                        ? {
                            onChange: (value) =>
                              updateInvoice(
                                index,
                                'cost',
                                value === '' ? invoice.cost : value
                              ),
                          }
                        : false
                    }
                  >
                    {formatPrice(invoice.cost)},-
                  </Typography.Text>
                </td>
                <td align="center">
                  {isEditable ? (
                    <InputNumber
                      addonAfter="kr"
                      value={invoice.dekket}
                      min={0}
                      max={invoice.cost}
                      onChange={(value) =>
                        updateInvoice(index, 'dekket', value)
                      }
                    />
                  ) : (
                    invoice.dekket + ',-'
                  )}
                </td>
                <td align="right">
                  {formatPrice(invoice.cost - invoice.dekket)},-
                </td>
              </tr>
            ))}
            {isEditable && (
              <tr>
                <td colSpan={4}>
                  <Button
                    icon={
                      <FontAwesomeIcon
                        icon={faPlus}
                        style={{ marginRight: 5 }}
                      />
                    }
                    type="default"
                    size="small"
                    onClick={addNewInvoice}
                  >
                    Ny post
                  </Button>
                </td>
              </tr>
            )}
            <tr className="gray">
              <td colSpan={2}>Delsum dekket:</td>
              <td colSpan={2} align="right">
                {formatPrice(sumDekket)},-ink.MVA
              </td>
            </tr>
            <tr className="gray">
              <td colSpan={2}>Delsum ikke dekket:</td>
              <td colSpan={2} align="right">
                {formatPrice(sumIkkeDekket)},-ink.MVA
              </td>
            </tr>
          </tbody>
        </table>
      </View>
      <Modal
        title="Dyreeierutgifter"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        className="info-modal"
      >
        <List
          header="Dokumentasjon fra dyreeier"
          itemLayout="horizontal"
          dataSource={documents.filter((document) => document.file !== null)}
          renderItem={(item) => {
            return (
              <List.Item>
                <List.Item.Meta title={item.description} />
                <a
                  type="button"
                  onClick={() =>
                    downloadFile(item.file.id, item.file.original_name)
                  }
                >
                  <FontAwesomeIcon icon={faDownload} style={{ fontSize: 16 }} />
                </a>
              </List.Item>
            );
          }}
        />
      </Modal>
    </Card>
  );
}
