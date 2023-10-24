import React, { useEffect, useState } from 'react';
import { Card, Select, Form, Input, Divider, Row, Col, List } from 'antd';
import {
  NormalInputProps,
  DefaultSelectProps,
  EmailInputProps,
} from '../../ui/ElementProps';
import { ValidationRules } from '../../../constants/validation';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../redux/customer/actions';
import StepWizardHeading from '../../ui/StepWizardHeading';
import PlacesAutocomplete, {
  geocodeByAddress,
} from 'react-places-autocomplete';

export default function Contact({ formRef, newTreat, setNewTreat }) {
  const dispatch = useDispatch();
  const { insuranceCompanies, isFetchingInsuranceCompanies } = useSelector(
    (state) => state.customer
  );

  useEffect(() => {
    dispatch({ type: actions.GET_AVAILABLE_INSURANCE_COMPANIES });
  }, []);

  useEffect(() => {
    formRef.current?.setFieldsValue(newTreat.contactInfo);
  }, [newTreat.contactInfo, newTreat.currentStep]);

  const onChangeFormField = (obj) => {
    setNewTreat({
      ...newTreat,
      contactInfo: {
        ...newTreat.contactInfo,
        ...obj,
      },
    });
  };

  const [address, setAddress] = useState(newTreat.contactInfo.address);

  const handleAddressChange = (address) => {
    onChangeFormField({ address });
    setAddress(address);
  };

  const handleAddressSelect = (address) => {
    const form = formRef.current;
    geocodeByAddress(address)
      .then((results) => {
        const street_number = results[0].address_components.find((c) =>
          c.types.includes('street_number')
        );
        const route = results[0].address_components.find((c) =>
          c.types.includes('route')
        );
        const postal = results[0].address_components.find((c) =>
          c.types.includes('postal_code')
        );
        const area = results[0].address_components.find((c) =>
          c.types.includes('postal_town')
        );

        if (route || street_number) {
          const address = route.long_name + ' ' + street_number.long_name;
          form.setFieldValue('address', address);
        }

        if (postal) {
          form.setFieldValue('postal_code', postal.long_name);
        }

        if (area) {
          form.setFieldValue('post_area', area.long_name);
        }

        if (postal || area) {
          onChangeFormField({
            postal_code: postal.long_name,
            post_area: area.long_name,
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <React.Fragment>
      <StepWizardHeading
        title="Kontaktinformasjon til dyreeier"
        description="Fyll ut kontaktinformasjon slik at forsikringsselskaper kan behandle
        saken din."
      />
      <Card
        loading={isFetchingInsuranceCompanies}
        title="Velg forsikringsselskap"
      >
        <Form.Item
          name="insurance_company_id"
          label="Forsikringsselskap"
          rules={ValidationRules.select}
          initialValue={newTreat.contactInfo.insurance_company_id}
        >
          <Select
            {...DefaultSelectProps}
            onChange={(value) =>
              onChangeFormField({ insurance_company_id: value })
            }
          >
            {insuranceCompanies.map((ic) => (
              <Select.Option key={ic.id} value={ic.id}>
                {ic.company_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Divider />
        <Form.Item
          name="policy_number"
          label="Polisenummer"
          tooltip="Polisenummer er et spesifikt nummer for å identifisere dyreeiernes forsikringsavtale. Dette kan også omtales som avtalenummer eller forsikringsnummer."
        >
          <Input
            {...NormalInputProps}
            onChange={(evt) =>
              onChangeFormField({ policy_number: evt.target.value })
            }
          />
        </Form.Item>
      </Card>
      <Card title="Kontaktinformasjon">
        <Form.Item name="name" label="Fullt navn" rules={ValidationRules.input}>
          <Input
            {...NormalInputProps}
            onChange={(evt) => onChangeFormField({ name: evt.target.value })}
          />
        </Form.Item>
        <Divider />
        <Row gutter={16}>
          <Col md={12} sm={24} xs={24}>
            <PlacesAutocomplete
              value={address}
              onChange={handleAddressChange}
              onSelect={handleAddressSelect}
            >
              {({
                getInputProps,
                suggestions,
                loading,
                getSuggestionItemProps,
              }) => (
                <React.Fragment>
                  <Form.Item
                    name="address"
                    label="Adresse"
                    rules={ValidationRules.input}
                  >
                    <Input {...NormalInputProps} {...getInputProps()} />
                  </Form.Item>
                  {suggestions.length > 0 && (
                    <List
                      className="place-autocomplete"
                      bordered
                      loading={loading}
                      dataSource={suggestions}
                      renderItem={(suggestion) => (
                        <List.Item {...getSuggestionItemProps(suggestion)}>
                          {suggestion.description}
                        </List.Item>
                      )}
                    />
                  )}
                </React.Fragment>
              )}
            </PlacesAutocomplete>
          </Col>
          <Col md={6} sm={12} xs={12}>
            <Form.Item
              name="postal_code"
              label="Postnummer"
              rules={ValidationRules.input}
            >
              <Input
                {...NormalInputProps}
                onChange={(evt) =>
                  onChangeFormField({ postal_code: evt.target.value })
                }
              />
            </Form.Item>
          </Col>
          <Col md={6} sm={12} xs={12}>
            <Form.Item
              name="post_area"
              label="Poststed"
              rules={ValidationRules.input}
            >
              <Input
                {...NormalInputProps}
                onChange={(evt) =>
                  onChangeFormField({ post_area: evt.target.value })
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Mobilnummer"
              rules={ValidationRules.input}
            >
              <Input
                {...NormalInputProps}
                onChange={(evt) =>
                  onChangeFormField({ phone: evt.target.value })
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="E-postadresse"
              rules={ValidationRules.email}
            >
              <Input
                {...EmailInputProps}
                onChange={(evt) =>
                  onChangeFormField({ email: evt.target.value })
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </React.Fragment>
  );
}
