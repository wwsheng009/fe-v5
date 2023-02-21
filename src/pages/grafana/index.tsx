import PageLayout from '@/components/pageLayout';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SearchOutlined, DownOutlined, FundOutlined, FundViewOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';

function Grafana() {
  const { t } = useTranslation();
  return (
    <PageLayout title={t('Grafana')} icon={<FundViewOutlined />}>
      <div style={{ height: '100%',overflow:'hidden',padding:'0' }}>
        <iframe style={{border:0}} height='100%' width='100%' src='/grafana'></iframe>
      </div>
    </PageLayout>
  );
}

export default Grafana;