import {
  Alert,
  Button,
  List,
  Modal,
  Popconfirm,
  Skeleton,
  Space,
  Tag,
  Typography,
  notification,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { FullWidthButtonProps, NormalButtonProps } from '../../ui/ElementProps';
import View from '../../ui/View';
import { lang } from '../../../constants/lang';
import ListItemText from '../../ui/ListItemText';
import ListItemLinkText from '../../ui/ListItemLinkText';
import Conclude from '../modals/Conclude';
import Cost from '../modals/Cost';
import Attachment from '../modals/Attachment';
import Contact from '../modals/Contact';
import { useDispatch, useSelector } from 'react-redux';
import { statusOptions } from '../../../constants/treat';
import actions from '../../../redux/customer/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { downloadPetlinkFile } from '../../../utils/file';
import { formatPhoneNumber } from '../../../utils/helpers';
import dayjs from 'dayjs';

const maxRequestsPerDay = 3;

export default function CaseInfoBox() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { treat, isFetchingTreat, isRequestingTreat } = useSelector(
    (state) => state.customer
  );
  const { user } = useSelector((state) => state.auth);

  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (treat) {
      setRequestCount(
        parseInt(localStorage.getItem(`clickRequestCount_${treat.id}`)) || 0
      );
    }
  }, [treat]);

  const canClickRequestButton = () => {
    const today = new Date().toLocaleDateString();
    const storedDate = localStorage.getItem(`clickRequestDate_${treat.id}`);
    const storedClicks =
      parseInt(localStorage.getItem(`clickRequestCount_${treat.id}`)) || 0;

    if (storedDate === today) {
      return storedClicks < maxRequestsPerDay;
    } else {
      localStorage.setItem(`clickRequestDate_${treat.id}`, today);
      localStorage.setItem(`clickRequestCount_${treat.id}`, '1');
      return true;
    }
  };

  const [modals, setModals] = useState([
    {
      key: 'conclude',
      isOpen: false,
      title: 'Konkluder saken',
      content: <Conclude />,
    },
    {
      key: 'costs',
      isOpen: false,
      title: 'Veterinærutgifter',
      content: <Cost />,
    },
    {
      key: 'attachments',
      isOpen: false,
      title: 'Vedlegg',
      content: <Attachment />,
    },
    {
      key: 'contact',
      isOpen: false,
      title: 'Kontaktinformasjon',
      content: <Contact />,
    },
  ]);

  const words = lang.treat.detail;

  const hideModal = (key) => {
    setModals(
      modals.map((modal) =>
        modal.key === key ? { ...modal, isOpen: false } : modal
      )
    );
  };
  const showModal = (key) => {
    setModals(
      modals.map((modal) =>
        modal.key === key ? { ...modal, isOpen: true } : modal
      )
    );
  };

  const sendRequest = () => {
    if (canClickRequestButton()) {
      setRequestCount((prevCount) => prevCount + 1);
      localStorage.setItem(
        `clickRequestCount_${treat.id}`,
        (requestCount + 1).toString()
      );

      dispatch({
        type: actions.SEND_REQUEST_TO_OWNER,
        payload: {
          id: treat.id,
        },
      });
    } else {
      notification['warning']({
        duration: 8,
        message: 'Maksimalt antall forespørsler nådd',
        description:
          'Du har nådd det maksimale antallet forespørsler for i dag.',
      });
    }
  };

  const data = useMemo(() => {
    if (treat) {
      // const file = treat.files.find((file) => file.isFromPetlink);
      const activeStatus = statusOptions.find(
        (status) => status.value === treat.status
      );
      return [
        {
          title: 'ID',
          value: <ListItemText text={`#${treat.id}`} />,
        },
        {
          title: 'Saksnummer',
          value: (
            <ListItemText
              isEditable={user.isInsurance && treat.isActive}
              field="case_no"
              text={treat.case_no ? treat.case_no : 'N/A'}
            />
          ),
        },
        {
          title: 'Skadenummer',
          value: (
            <ListItemText
              isEditable={user.isInsurance && treat.isActive}
              field="claim_no"
              text={treat.claim_no ? treat.claim_no : 'N/A'}
            />
          ),
        },
        {
          title: 'Status',
          value: <Tag color={activeStatus.color}>{treat.status}</Tag>,
        },
        {
          title: 'Klinikk / Hospital',
          value: <ListItemText text={treat.vet.company_name} />,
          description: `Tlf: ${formatPhoneNumber(treat.vet.phone)}`,
        },
        {
          title: 'Forsikringsselskap',
          value: <ListItemText text={treat.insurance_company.company_name} />,
          description: `Tlf: ${formatPhoneNumber(
            treat.insurance_company.phone
          )}`,
        },
        {
          title: 'Type dyr',
          value: <ListItemText text={treat.pet_category.name} />,
        },
        {
          title: 'Skadedokumentasjon',
          value: (
            <ListItemLinkText
              text={`Se dokumentasjon (${
                treat.vet_documents.length + treat.caretaker_documents.length
              })`}
              onClick={() => showModal('attachments')}
            />
          ),
        },
        {
          title: 'Er dyret ferdigbehandlet?',
          value: <ListItemText text={treat.has_treated ? 'Ja' : 'Nei'} />,
        },
        {
          title: 'Skadedato',
          value: (
            <ListItemText
              text={dayjs(treat.injury_date).format('dddd, D. MMMM')}
            />
          ),
        },
        {
          title: 'Utgifter',
          value: (
            <ListItemLinkText
              text={`Se utgifter (${
                treat.vet_invoices.length +
                treat.caretaker_invoices.filter(
                  (invoice) => invoice.file !== null
                ).length
              })`}
              onClick={() => showModal('costs')}
            />
          ),
        },
        {
          title: 'Dyreeier',
          value: (
            <ListItemLinkText
              text="Se kontaktinformasjon"
              onClick={() => showModal('contact')}
            />
          ),
        },
        {
          title: 'Dekningstilsagn',
          isVisible: treat.isApproved && treat.dekningstilsagn,
          value: (
            <ListItemLinkText
              text="Se dekningstilsagn"
              onClick={() => navigate(`/case/${treat.id}/dekningstilsagn`)}
            />
          ),
        },
        {
          title: 'Oppsummering av skadesak',
          isVisible: treat.isApproved,
          value: (
            <ListItemLinkText
              text="Last ned"
              onClick={() =>
                downloadPetlinkFile(
                  treat.dekningstilsagn.full_pdf,
                  `case${treat.id}-full.pdf`
                )
              }
            />
          ),
        },
      ];
    }
  }, [treat]);

  return (
    <View>
      {isFetchingTreat ? (
        [
          <Skeleton key="skeleton1" active />,
          <Skeleton key="skeleton2" active />,
        ]
      ) : (
        <List
          className="info-list-box"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => {
            if (item.isVisible !== false) {
              return (
                <List.Item>
                  <List.Item.Meta title={item.title} />
                  <Space align="end" direction="vertical">
                    <Typography.Text>{item.value}</Typography.Text>
                    <Typography.Text>{item.description}</Typography.Text>
                  </Space>
                </List.Item>
              );
            }
            return null;
          }}
        />
      )}
      {user.isInsurance && treat?.isActive && (
        <Popconfirm
          title="Send forespørsel"
          description="Ønsker du å sende forespørsel til dyreeier?"
          icon={<FontAwesomeIcon color="orange" icon={faExclamationTriangle} />}
          okText="Ja,send"
          cancelText="Nei"
          onConfirm={sendRequest}
        >
          <Button {...FullWidthButtonProps} loading={isRequestingTreat}>
            Send forespørsel til dyreeier
          </Button>
        </Popconfirm>
      )}
      {user.isInsurance && treat?.isActive && (
        <Alert
          message={words.alertMessage}
          description={words.alertDescription}
          type="info"
          className="complete-alert"
          action={
            <Button
              {...NormalButtonProps}
              onClick={() => showModal('conclude')}
            >
              {words.alertActionButton}
            </Button>
          }
        />
      )}
      {modals.map((modal) => (
        <Modal
          key={modal.key}
          title={modal.title}
          open={modal.isOpen}
          onCancel={() => hideModal(modal.key)}
          footer={null}
          className="info-modal"
        >
          {modal.content}
        </Modal>
      ))}
    </View>
  );
}
