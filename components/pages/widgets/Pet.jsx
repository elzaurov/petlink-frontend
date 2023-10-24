import React, { useEffect, useState } from 'react';
import {
  Typography,
  Image,
  Badge,
  Card,
  Input,
  Form,
  Radio,
  Skeleton,
} from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import View from '../../ui/View';
import { NormalInputProps } from '../../ui/ElementProps';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../redux/customer/actions';
import { ValidationRules } from '../../../constants/validation';
import StepWizardHeading from '../../ui/StepWizardHeading';

export default function Pet({ formRef, newTreat, setNewTreat }) {
  const { petCategories, isFetchingPetCategories } = useSelector(
    (state) => state.customer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: actions.GET_PET_CATEGORIES });
  }, []);

  useEffect(() => {
    formRef.current?.setFieldsValue(newTreat.petInfo);
  }, [newTreat.petInfo, newTreat.currentStep]);

  const onChangeFormField = (field, value) => {
    setNewTreat({
      ...newTreat,
      petInfo: {
        ...newTreat.petInfo,
        [field]: value,
      },
    });
  };

  const PetCategoryCard = ({ pet }) => {
    return (
      <Badge
        offset={[5, 3]}
        count={
          <CheckCircleFilled
            style={{
              color:
                pet.id === newTreat.petInfo.pet_category_id
                  ? '#73e336'
                  : 'transparent',
              fontSize: 22,
            }}
          />
        }
      >
        <View
          className={`pet ${
            pet.id === newTreat.petInfo.pet_category_id && 'active'
          }`}
        >
          <Image src={pet.icon} alt={pet.name} preview={false} />
          <Typography.Title level={5}>{pet.name}</Typography.Title>
        </View>
      </Badge>
    );
  };

  return (
    <React.Fragment>
      <StepWizardHeading
        title="Få veterinærutgifter dekket"
        description="Prosessen er enkel og vi veileder deg gjennom alle stegene."
      />
      <Card className="pet-categories-card">
        <Form.Item
          initialValue={newTreat.petInfo.pet_category_id}
          name="pet_category_id"
        >
          <Radio.Group
            onChange={(evt) =>
              onChangeFormField('pet_category_id', evt.target.value)
            }
            value={newTreat.petInfo.pet_category_id}
          >
            {isFetchingPetCategories
              ? [
                  <Skeleton.Image
                    key="image1"
                    active={isFetchingPetCategories}
                    size="large"
                  />,
                  <Skeleton.Image
                    key="image2"
                    active={isFetchingPetCategories}
                    size="large"
                  />,
                  <Skeleton.Image
                    key="image3"
                    active={isFetchingPetCategories}
                    size="large"
                  />,
                ]
              : petCategories.map((p) => (
                  <Radio.Button key={p.id} value={p.id}>
                    <PetCategoryCard pet={p} />
                  </Radio.Button>
                ))}
          </Radio.Group>
        </Form.Item>
      </Card>
      <Card title="Tast inn pasientens navn">
        <Form.Item
          name="pet_name"
          label="Pasientens navn"
          rules={ValidationRules.input}
        >
          <Input
            {...NormalInputProps}
            onChange={(evt) => onChangeFormField('pet_name', evt.target.value)}
          />
        </Form.Item>
      </Card>
    </React.Fragment>
  );
}
