import { Button, Card, InputNumber, List, Modal, Typography } from 'antd';
import React, { useState } from 'react';
import View from '../../ui/View';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';
import { downloadFile } from '../../../utils/file';
import { formatPrice } from '../../../utils/helpers';
import { useSelector } from 'react-redux';

export default function VetInvoices({
  invoices,
  documents,
  sumDekket,
  sumIkkeDekket,
  updateInvoice,
  addNewItem,
}) {
  const { treat } = useSelector((state) => state.customer);
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const isEditable = !treat.isApproved && user.isInsurance;

  return (
    <Card>
      <View className="invoice-header">
        <Typography.Text>
          Velg hva som skal dekkes for veterinæren
        </Typography.Text>
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
              <React.Fragment key={index}>
                <tr className="gray">
                  <td colSpan={4}>{`Faktura ${index + 1}`}</td>
                </tr>
                {invoice.items.map((item, idx) => (
                  <tr key={index + '-' + idx}>
                    <td>
                      <Typography.Text
                        editable={
                          isEditable
                            ? {
                                onChange: (value) =>
                                  updateInvoice(index, idx, 'tekst', value),
                              }
                            : false
                        }
                      >
                        {item.tekst}
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
                                    idx,
                                    'beløp',
                                    value === '' ? item.beløp : value
                                  ),
                              }
                            : false
                        }
                      >
                        {formatPrice(item.beløp)},-
                      </Typography.Text>
                    </td>
                    <td align="center">
                      {isEditable ? (
                        <InputNumber
                          addonAfter="kr"
                          value={item.dekket}
                          min={0}
                          max={item.beløp}
                          onChange={(value) =>
                            updateInvoice(index, idx, 'dekket', value)
                          }
                        />
                      ) : (
                        item.dekket + ',-'
                      )}
                    </td>
                    <td align="right">
                      {formatPrice(item.beløp - item.dekket)}
                      ,-
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
                        onClick={() => addNewItem(index)}
                      >
                        Ny post
                      </Button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            <tr className="gray">
              <td colSpan={2}>Delsum dekket:</td>
              <td colSpan={2} align="right">
                {formatPrice(sumDekket)},-eks.MVA
              </td>
            </tr>
            <tr className="gray">
              <td colSpan={2}>Delsum ikke dekket:</td>
              <td colSpan={2} align="right">
                {formatPrice(sumIkkeDekket)},-eks.MVA
              </td>
            </tr>
          </tbody>
        </table>
      </View>
      <Modal
        title="Veterinærutgifter"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        className="info-modal"
      >
        <List
          header="Dokumentasjon fra veterinær"
          itemLayout="horizontal"
          dataSource={documents}
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
