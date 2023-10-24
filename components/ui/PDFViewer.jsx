import React, { useEffect, useState, memo } from 'react';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Card, Empty } from 'antd';
import axios from 'axios';

const PDFViewer = ({ fileId }) => {
  const [fileUrl, setFileUrl] = useState(undefined);
  const [isDownloading, setIsDownloading] = useState(false);

  const newPlugin = defaultLayoutPlugin();

  useEffect(() => {
    const onFileDownload = () => {
      axios({
        url: `/api/download/${fileId}`,
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setFileUrl(url);
        setIsDownloading(false);
      });
    };

    if (fileId !== null) {
      setIsDownloading(true);
      onFileDownload();
    } else {
      setFileUrl(null);
    }
  }, [fileId]);

  if (fileUrl === null && !isDownloading) {
    return (
      <Card className="pdf-container">
        <div style={{ height: 750 }}>
          <Empty />
        </div>
      </Card>
    );
  }

  return (
    <Card
      loading={fileUrl === undefined || isDownloading}
      className="pdf-container"
    >
      <div style={{ height: 750 }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer fileUrl={fileUrl} plugins={[newPlugin]} defaultScale={1} />
        </Worker>
      </div>
    </Card>
  );
};

export default memo(PDFViewer);
