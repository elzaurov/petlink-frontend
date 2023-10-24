import { Avatar, Card, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import View from '../../ui/View';
import { downloadLogoFile, downloadPetlinkFile } from '../../../utils/file';
import { useSelector } from 'react-redux';
import CircleIconButton from '../../ui/CircleIconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export default function InsuranceCompany({
  note,
  company,
  updateDekningstilsagn,
}) {
  const { treat } = useSelector((state) => state.customer);
  const { user } = useSelector((state) => state.auth);
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    async function fetchLogo() {
      if (company?.logo) {
        const file = await downloadLogoFile(company.logo);
        const reader = new FileReader();

        reader.onload = () => {
          setLogo(reader.result);
        };

        reader.readAsDataURL(file.originFileObj);
      }
    }

    fetchLogo();
  }, [company]);

  const isEditable = !treat.isApproved && user.isInsurance;

  return (
    <View className="insurance-company">
      <View className="basic-info">
        <Typography.Title level={3}>Fyll ut dekningstilsagn</Typography.Title>
        {company && (
          <Typography.Text>
            {company.company_name} • {company.company_number} • {company.email}{' '}
            • {company.phone}
          </Typography.Text>
        )}
      </View>
      {!isEditable && (
        <View className="dekningstilsagn-download-button">
          <CircleIconButton
            icon={<FontAwesomeIcon icon={faDownload} />}
            onClick={() =>
              downloadPetlinkFile(
                treat.dekningstilsagn.dekningstilsagn_pdf,
                `saken${treat.id}-dekningstilsagn.pdf`
              )
            }
          />
        </View>
      )}
      <Card>
        <View className="notes">
          <Typography.Text>Merknad til dekningstilsagn</Typography.Text>
          {logo && <Avatar size={32} src={logo} />}
        </View>
        <View className="description">
          <Typography.Text
            editable={
              isEditable
                ? { onChange: (val) => updateDekningstilsagn('note', val) }
                : false
            }
          >
            {note}
          </Typography.Text>
        </View>
      </Card>
    </View>
  );
}
