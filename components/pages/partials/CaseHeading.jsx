import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faClone,
  faExclamationTriangle,
  faPencilAlt,
  faRepeat,
  faStickyNote,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Popconfirm, Space } from 'antd';
import CircleIconButton from '../../ui/CircleIconButton';
import View from '../../ui/View';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../redux/customer/actions';
import Heading from '../../ui/Heading';
import { LINK_CUSTOMER_CASE_LIST } from '../../../constants/links';

const styles = {
  heading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    lineHeight: 0,
    marginRight: 5,
    fontSize: 20,
    cursor: 'pointer',
  },
};

export default function CaseHeading({ noAction = null }) {
  const { treat, isDeleteTreat } = useSelector((state) => state.customer);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();

  const onDelete = () => {
    dispatch({
      type: actions.DELETE_TREAT,
      payload: { id },
    });
    if (!isDeleteTreat) navigate(LINK_CUSTOMER_CASE_LIST);
  };

  const onReopen = () => {
    dispatch({
      type: actions.REOPEN_TREAT,
      payload: { id },
    });
  };

  const onDuplicate = () => {
    dispatch({
      type: actions.DUPLICATE_TREAT,
      payload: { id },
    });
  };

  const isSubRoute =
    location.pathname.includes('note') ||
    location.pathname.includes('dekningstilsagn');

  return (
    <View style={styles.heading}>
      <Space
        style={styles.backBtn}
        onClick={() =>
          isSubRoute
            ? navigate(`/case/${id}`)
            : navigate(LINK_CUSTOMER_CASE_LIST)
        }
      >
        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: 20 }} />
        {treat && (
          <Heading text={`${treat.display_id} - ${treat.pet_name}`} size={2} />
        )}
      </Space>
      {!isSubRoute && (
        <Space>
          <CircleIconButton
            icon={<FontAwesomeIcon icon={faStickyNote} />}
            onClick={() => navigate(`/case/${id}/note`)}
          />
          {!noAction && user.isVet && treat?.isActive && (
            <>
              <CircleIconButton
                icon={<FontAwesomeIcon icon={faPencilAlt} />}
                onClick={() => navigate(`/case/${id}/edit`)}
              />
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
                onConfirm={onDelete}
              >
                <CircleIconButton
                  icon={<FontAwesomeIcon icon={faTrashAlt} />}
                />
              </Popconfirm>
            </>
          )}
          {!noAction && user.isInsurance && (
            <Popconfirm
              title="Dupliser saken"
              description="Er du sikker på at du ønsker å duplisere denne saken?"
              icon={
                <FontAwesomeIcon color="orange" icon={faExclamationTriangle} />
              }
              okText="Ja"
              cancelText="Nei"
              onConfirm={onDuplicate}
            >
              <CircleIconButton icon={<FontAwesomeIcon icon={faClone} />} />
            </Popconfirm>
          )}
          {!noAction && user.isInsurance && treat?.isApproved && (
            <Popconfirm
              title="Åpne saken på nytt"
              description="Er du sikker på at du ønsker å åpne saken på nytt?"
              icon={
                <FontAwesomeIcon color="orange" icon={faExclamationTriangle} />
              }
              okText="Ja"
              cancelText="Nei"
              onConfirm={onReopen}
            >
              <CircleIconButton icon={<FontAwesomeIcon icon={faRepeat} />} />
            </Popconfirm>
          )}
        </Space>
      )}
    </View>
  );
}
