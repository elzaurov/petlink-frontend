import React, { useMemo } from 'react';
import { Typography, List, Divider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { DescriptionProps } from '../../ui/ElementProps';

export default function Attachment() {
  const { vet_documents, caretaker_documents } = useSelector(
    (state) => state.customer.treat
  );
  const { description } = useSelector((state) => state.customer.treat);

  const vetDocuments = useMemo(() => {
    return vet_documents.map(({ file, description }) => {
      return {
        id: file.id,
        title: description,
        link: file.original_name,
      };
    });
  }, [vet_documents]);

  const caretakerDocuments = useMemo(() => {
    return caretaker_documents.map(({ file, description }) => {
      return {
        id: file.id,
        title: description,
        link: file.original_name,
      };
    });
  }, [caretaker_documents]);

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
      <Typography.Text {...DescriptionProps}>{description}</Typography.Text>
      <List
        header="Dokumentasjon fra veterinær"
        itemLayout="horizontal"
        dataSource={vetDocuments}
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
        header="Dokumentasjon fra dyreeier"
        itemLayout="horizontal"
        dataSource={caretakerDocuments}
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
