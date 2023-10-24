import {
  Button,
  Card,
  Checkbox,
  Input,
  InputNumber,
  Space,
  Switch,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import View from '../../ui/View';
import { useSelector } from 'react-redux';
import { formatPrice } from '../../../utils/helpers';

export default function Summary({
  egenandel,
  sumVetDekket,
  sumVetIkkeDekket,
  sumCaretakerDekket,
  sumCaretakerIkkeDekket,
  vetBankAccount,
  caretakerBankAccount,
  kids,
  signature,
  updateDekningstilsagn,
  submitDekningstilsagn,
}) {
  const { treat } = useSelector((state) => state.customer);
  const { user } = useSelector((state) => state.auth);
  const { isSavingDekningstilsagn } = useSelector((state) => state.customer);
  const isEditable = !treat.isApproved && user.isInsurance;
  const [isSubmitReady, setIsSubmitReady] = useState(false);
  const [hasClickedSubmit, setHasClickedSubmit] = useState(false);

  const calculateWithEgenandel = (value) => {
    if (egenandel.symbol === 'kr') {
      return value - egenandel.value;
    } else {
      return value * egenandel.value * 0.01;
    }
  };

  const onSubmit = () => {
    setHasClickedSubmit(true);
    if (isSubmitReady) {
      submitDekningstilsagn();
    }
  };

  return (
    <Card>
      <View>
        <Typography.Text>
          Legg inn egenandel og oppsummering for veterinæren og dyreeier
        </Typography.Text>
      </View>
      <View>
        <table cellSpacing={0} width="100%">
          <thead>
            <tr>
              <th width="30%" align="left">
                Dekket for veterinær
              </th>
              <th width="20%"></th>
              <th width="30%" align="left">
                Dekket for dyreeier
              </th>
              <th width="20%" align="right"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sum alle fakturaer eks. MVA</td>
              <td align="center">{formatPrice(sumVetDekket)},-</td>
              <td>Sum eks. MVA</td>
              <td align="right">{formatPrice(sumCaretakerDekket * 0.8)},-</td>
            </tr>
            <tr>
              <td>25% MVA:</td>
              <td align="center">{formatPrice(sumVetDekket * 0.25)},-</td>
              <td>25% MVA:</td>
              <td align="right">{formatPrice(sumCaretakerDekket * 0.2)},-</td>
            </tr>
            <tr>
              <td>Totalpris:</td>
              <td align="center">{formatPrice(sumVetDekket * 1.25)},-</td>
              <td>Totalpris:</td>
              <td align="right">{formatPrice(sumCaretakerDekket)},-</td>
            </tr>
          </tbody>
        </table>
        <table cellSpacing={0} width="100%">
          <thead>
            <tr>
              <th width="30%" align="left">
                Ikke dekket for veterinær
              </th>
              <th width="20%"></th>
              <th width="30%" align="left">
                Ikke dekket for dyreeier
              </th>
              <th width="20%" align="right"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sum alle fakturaer eks. MVA</td>
              <td align="center">{formatPrice(sumVetIkkeDekket)},-</td>
              <td>Sum eks. MVA</td>
              <td align="right">
                {formatPrice(sumCaretakerIkkeDekket * 0.8)},-
              </td>
            </tr>
            <tr>
              <td>25% MVA:</td>
              <td align="center">{formatPrice(sumVetIkkeDekket * 0.25)},-</td>
              <td>25% MVA:</td>
              <td align="right">
                {formatPrice(sumCaretakerIkkeDekket * 0.2)},-
              </td>
            </tr>
            <tr>
              <td>Totalpris ink. MVA</td>
              <td align="center">{formatPrice(sumVetIkkeDekket * 1.25)},-</td>
              <td>Totalpris ink. MVA</td>
              <td align="right">{formatPrice(sumCaretakerIkkeDekket)},-</td>
            </tr>
          </tbody>
        </table>
        <table cellSpacing={0} width="100%">
          <thead>
            <tr>
              <th width="30%" align="left">
                Utbetaling til veterinær
              </th>
              <th width="20%"></th>
              <th width="30%" align="left">
                Utbetaling til dyreeier
              </th>
              <th width="20%" align="right"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td align="center" colSpan={4}>
                {isEditable ? (
                  <Space>
                    <InputNumber
                      value={egenandel.value}
                      style={{ width: '150px' }}
                      onChange={(value) =>
                        updateDekningstilsagn('egenandel', {
                          ...egenandel,
                          value: value,
                        })
                      }
                      addonAfter={egenandel.symbol}
                    />
                    <Switch
                      checkedChildren="kr"
                      unCheckedChildren="%"
                      defaultChecked={egenandel.symbol === 'kr'}
                      onChange={(value) =>
                        updateDekningstilsagn('egenandel', {
                          symbol: value ? 'kr' : '%',
                          value: 0,
                        })
                      }
                    />
                  </Space>
                ) : (
                  `Egenandel: ${egenandel.value}${egenandel.symbol}`
                )}
              </td>
            </tr>
            <tr>
              <td>Egenandel i kr</td>
              <td align="center">
                {formatPrice(calculateWithEgenandel(sumVetDekket * 1.25))},-
              </td>
              <td>Egenandel i kr</td>
              <td align="right">
                {formatPrice(calculateWithEgenandel(sumCaretakerDekket))}
                ,-
              </td>
            </tr>
            <tr className="pink">
              <td>Avviste utgifter og egenandel</td>
              <td align="center">
                {formatPrice(
                  (calculateWithEgenandel(sumVetDekket) + sumVetIkkeDekket) *
                    1.25
                )}
                ,-
              </td>
              <td>Avviste utgifter og egenandel</td>
              <td align="right">
                {formatPrice(
                  sumCaretakerIkkeDekket +
                    calculateWithEgenandel(sumCaretakerDekket)
                )}
                ,-
              </td>
            </tr>
            <tr className="green">
              <td>Totalt utbetalt til veterinær</td>
              <td align="center">
                {formatPrice(
                  sumVetDekket > 0
                    ? sumVetDekket * 1.25 -
                        calculateWithEgenandel(sumVetDekket * 1.25)
                    : 0
                )}
                ,-
              </td>
              <td>Totalt utbetalt til veterinær</td>
              <td align="right">
                {formatPrice(
                  sumCaretakerDekket > 0
                    ? sumCaretakerDekket -
                        calculateWithEgenandel(sumCaretakerDekket)
                    : 0
                )}
                ,-
              </td>
            </tr>
            <tr>
              <td>Betales til kontonummer</td>
              <td align="center">{vetBankAccount}</td>
              <td>Betales til kontonummer</td>
              <td align="right">{caretakerBankAccount}</td>
            </tr>
            <tr>
              <td>KID / Referanse</td>
              <td align="center">{kids.join(', ')}</td>
              <td>Tekst</td>
              <td align="right">
                {isEditable ? (
                  <Input
                    value={signature}
                    onChange={(evt) =>
                      updateDekningstilsagn('signature', evt.target.value)
                    }
                  />
                ) : (
                  signature
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </View>
      {isEditable && (
        <View className="dekningstilsagn-submit-actions">
          <Checkbox
            checked={isSubmitReady}
            onChange={() => setIsSubmitReady(!isSubmitReady)}
            style={{
              color: !isSubmitReady && hasClickedSubmit ? 'red' : 'inherit',
            }}
          >
            Jeg er innforstått med at et dekningstilsagn er bindende, og at
            veterinær så vel som forsikringstaker vil bli varslet om tilsagnet
            iht. utregningen over.
          </Checkbox>
          <Button
            loading={isSavingDekningstilsagn}
            type="primary"
            size="large"
            onClick={onSubmit}
          >
            SEND DEKNINGSTILSAGN
          </Button>
        </View>
      )}
    </Card>
  );
}
