import React from 'react';
import { Button } from 'antd';
import View from '../../ui/View';
import { useNavigate, useParams } from 'react-router-dom';
import { DefaultButtonProps, NormalButtonProps } from '../../ui/ElementProps';
import StepWizardHeading from '../../ui/StepWizardHeading';
import { useSelector } from 'react-redux';

export default function Conclude({ onInit }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { treat } = useSelector((state) => state.customer);

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <StepWizardHeading
        title={id ? 'Saken er oppdatert!' : 'Saken er opprettet!'}
        description="Forsikringsselskapet behandler saken din og vil ta kontakt fortløpende."
      />
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          gap: 10,
          marginTop: 20,
        }}
      >
        <Button
          {...DefaultButtonProps}
          size="large"
          onClick={() => {
            onInit();
            navigate('/case/new');
          }}
        >
          OPPRETT NY SAK
        </Button>
        <Button
          {...NormalButtonProps}
          onClick={() => {
            navigate(`/case/${treat?.id}`);
          }}
        >
          GÅ TIL SAKEN
        </Button>
      </View>
    </View>
  );
}
