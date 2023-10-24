import React, { useEffect, useRef, useState } from 'react';
import { StepsForm } from '@ant-design/pro-components';
import { Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { LinkButtonProps, NormalButtonProps } from '../ui/ElementProps';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../redux/customer/actions';

import Pet from './widgets/Pet';
import Contact from './widgets/Contact';
import Injury from './widgets/Injury';
import Cost from './widgets/Cost';
import Conclude from './widgets/Conclude';

import CustomerLayout from '../layouts/CustomerLayout';
import { useParams } from 'react-router-dom';
import Loader from '../ui/Loader';
import dayjs from 'dayjs';

const FormSteps = [
  { name: 'pet', title: 'Type dyr', content: <Pet /> },
  { name: 'contact', title: 'Kontaktinfo', content: <Contact /> },
  { name: 'injury', title: 'Skade', content: <Injury /> },
  { name: 'cost', title: 'Kostnader', content: <Cost /> },
];

const initialTreat = {
  treat_id: null,
  currentStep: 0,
  petInfo: {
    pet_category_id: 1,
    pet_name: '',
  },
  contactInfo: {
    insurance_company_id: null,
    policy_number: '',
    name: '',
    address: '',
    postal_code: '',
    post_area: '',
    email: '',
    phone: '',
  },
  injury: {
    attachments: [],
    description: '',
    has_treated: null,
    injury_date: dayjs(),
  },
  invoices: [],
  obInvoice: null,
};

const FormButton = ({ type, onClick }) => {
  const { isAddingTreat } = useSelector((state) => state.customer);
  const isLinkButton = type === 'pre';
  const ButtonProps = isLinkButton ? LinkButtonProps : NormalButtonProps;
  const buttonText = isLinkButton
    ? 'TILBAKE'
    : type === 'next'
    ? 'FORTSETT'
    : 'FULLFØR';

  return (
    <Button
      loading={type === 'submit' && isAddingTreat}
      {...ButtonProps}
      onClick={onClick}
    >
      {isLinkButton && (
        <FontAwesomeIcon
          icon={faChevronLeft}
          style={{ fontSize: 14, marginRight: 5 }}
        />
      )}
      {buttonText}
      {!isLinkButton && type === 'next' && (
        <FontAwesomeIcon
          icon={faChevronRight}
          style={{ fontSize: 14, marginLeft: 20 }}
        />
      )}
    </Button>
  );
};

const FormButtons = ({ onSubmit, onPre, step }) => {
  const isFirstStep = step === 0;
  const isLastStep = step === FormSteps.length - 1;
  const isAfterLastStep = step === FormSteps.length;

  if (isAfterLastStep) return null;

  return [
    !isFirstStep && <FormButton key="preButton" type="pre" onClick={onPre} />,
    <FormButton
      key="nextButton"
      type={isLastStep ? 'submit' : 'next'}
      onClick={onSubmit}
    />,
  ].filter(Boolean);
};

export default function NewCase() {
  const dispatch = useDispatch();
  const formRef = useRef();
  const { StepForm } = StepsForm;
  const { id } = useParams();
  const [newTreat, setNewTreat] = useState(initialTreat);
  const [isReadyForSubmit, setIsReadyForSubmit] = useState(false);

  const { treat, isCreateTreatSuccess } = useSelector(
    (state) => state.customer
  );

  useEffect(() => {
    const draftCaseData = localStorage.getItem('draftCaseData');
    if (draftCaseData) {
      setNewTreat(JSON.parse(draftCaseData));
    } else {
      setNewTreat(initialTreat);
    }
  }, []);

  useEffect(() => {
    if (newTreat.currentStep === FormSteps.length) {
      localStorage.removeItem('draftCaseData');
    } else {
      localStorage.setItem('draftCaseData', JSON.stringify(newTreat));
    }
  }, [newTreat]);

  useEffect(() => {
    if (id) {
      dispatch({
        type: actions.GET_TREAT,
        payload: { id },
      });
    }
  }, [id]);

  useEffect(() => {
    if (treat) {
      const structuredTreat = {
        treat_id: treat.id,
        currentStep: treat.step,
        petInfo: {
          pet_category_id: treat.pet_category.id,
          pet_name: treat.pet_name,
        },
        contactInfo: {
          caretakerId: treat.caretaker?.id || null,
          insurance_company_id: treat.insurance_company?.id || null,
          policy_number: treat.caretaker?.policy_number || '',
          name: treat.caretaker?.name || '',
          address: treat.caretaker?.address || '',
          postal_code: treat.caretaker?.postal_code || '',
          post_area: treat.caretaker?.post_area || '',
          email: treat.caretaker?.email || '',
          phone: treat.caretaker?.phone || '',
        },
        injury: {
          attachments:
            treat.vet_documents.map(({ file, description }) => {
              return {
                file: {
                  file: {
                    name: file.original_name,
                    status: 'done',
                    uid: file.id,
                    originalFileObj: file,
                    response: {
                      data: file.stored_name,
                    },
                  },
                  fileList: [
                    {
                      name: file.original_name,
                      status: 'done',
                      uid: file.id,
                      originalFileObj: file,
                      response: {
                        data: file.stored_name,
                      },
                    },
                  ],
                },
                description,
              };
            }) || [],
          description: treat.description || '',
          has_treated: treat.has_treated || 0,
          injury_date: dayjs(treat.injury_date) || dayjs(),
        },
        invoices: treat.vet_invoices || [],
        obInvoice: null,
      };
      setNewTreat(structuredTreat);
    }
  }, [treat]);

  const onFinishStep = async () => {
    return true;
  };

  const onFinish = () => {
    setIsReadyForSubmit(true);
  };

  useEffect(() => {
    if (isReadyForSubmit) {
      if (id || newTreat.treat_id) {
        dispatch({
          type: actions.UPDATE_TREAT,
          payload: {
            id: id ? id : newTreat.treat_id,
            data: {
              step: newTreat.currentStep,
              ...newTreat.petInfo,
              ...newTreat.contactInfo,
              invoices: newTreat.invoices,
              ...newTreat.injury,
            },
          },
        });
      } else {
        dispatch({
          type: actions.CREATE_TREAT,
          payload: {
            step: newTreat.currentStep,
            ...newTreat.petInfo,
            ...newTreat.contactInfo,
            invoices: newTreat.invoices,
            ...newTreat.injury,
          },
        });
      }

      setIsReadyForSubmit(false);
    }
  }, [isReadyForSubmit]);

  useEffect(() => {
    if (isCreateTreatSuccess && newTreat.currentStep === FormSteps.length - 1) {
      setNewTreat({ ...newTreat, currentStep: newTreat.currentStep + 1 });
    }
  }, [isCreateTreatSuccess]);

  const onInit = () => {
    setNewTreat(initialTreat);
  };

  if (!newTreat) {
    return <Loader />;
  }

  return (
    <CustomerLayout>
      <StepsForm
        current={newTreat.currentStep}
        onCurrentChange={(current) => {
          setNewTreat({ ...newTreat, currentStep: current });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="steps-form"
        onFinish={onFinish}
        formRef={formRef}
        stepsProps={{ labelPlacement: 'vertical' }}
        submitter={{ render: FormButtons }}
      >
        {FormSteps.map(({ name, title, content }) => (
          <StepForm
            key={name}
            name={name}
            title={title}
            onFinish={onFinishStep}
            preserve={false}
          >
            {React.cloneElement(content, { formRef, newTreat, setNewTreat })}
          </StepForm>
        ))}
        {newTreat.currentStep === FormSteps.length && (
          <Conclude onInit={onInit} />
        )}
      </StepsForm>
    </CustomerLayout>
  );
}
