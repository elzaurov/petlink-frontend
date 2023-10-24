import React, { useMemo } from 'react';
import { List } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

export default function Cost() {
  const { vet_invoices, caretaker_invoices } = useSelector(
    (state) => state.customer.treat
  );

  const vetInvoices = useMemo(() => {
    return vet_invoices.map(({ file }, index) => {
      return {
        id: file.id,
        title: `Faktura #${index + 1}`,
        link: file.original_name,
      };
    });
  }, [vet_invoices]);

  const caretakerInvoices = useMemo(() => {
    return caretaker_invoices
      .filter((invoice) => invoice.file !== null)
      .map(({ file, description }) => {
        return {
          id: file.id,
          title: description,
          link: file.original_name,
        };
      });
  }, [caretaker_invoices]);

  const onFileDownload = (fileID, fileName) => {
    axios({
      url: `/api/download/${fileID}`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <React.Fragment>
      <List
        header="Utgifter fra veterinær"
        itemLayout="horizontal"
        dataSource={vetInvoices}
        renderItem={(item) => {
          return (
            <List.Item>
              <List.Item.Meta title={item.title} />
              <a
                type="button"
                onClick={() => onFileDownload(item.id, item.link)}
              >
                <FontAwesomeIcon icon={faDownload} style={{ fontSize: 16 }} />
              </a>
            </List.Item>
          );
        }}
      />
      <List
        header="Utgifter fra dyreeier"
        itemLayout="horizontal"
        dataSource={caretakerInvoices}
        renderItem={(item) => {
          return (
            <List.Item>
              <List.Item.Meta title={item.title} />
              <a
                type="button"
                onClick={() => onFileDownload(item.id, item.link)}
              >
                <FontAwesomeIcon icon={faDownload} style={{ fontSize: 16 }} />
              </a>
            </List.Item>
          );
        }}
      />
    </React.Fragment>
  );
}
