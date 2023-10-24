import React, { useEffect, useMemo, useState } from 'react';
import CustomerLayout from '../layouts/CustomerLayout';
import CaseHeading from './partials/CaseHeading';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import actions from '../../redux/customer/actions';
import { Card } from 'antd';
import InsuranceCompany from './dekningstilsagn/InsuranceCompany';
import VetInvoices from './dekningstilsagn/VetInvoices';
import PetOwnerInvoice from './dekningstilsagn/PetOwnerInvoices';
import Summary from './dekningstilsagn/Summary';
import Loader from '../ui/Loader';

export default function Dekningstilsagn() {
  const { treat, isSavingDekningstilsagnSuccess } = useSelector(
    (state) => state.customer
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [newDekningstilsagn, setNewDekningstilsagn] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const store = localStorage.getItem('draftDekningstilsagn');
    if (store) {
      setNewDekningstilsagn(JSON.parse(store));
    }
  }, []);

  useEffect(() => {
    if (!newDekningstilsagn && treat) {
      const {
        insurance_company,
        vet,
        caretaker,
        vet_invoices,
        vet_documents,
        caretaker_invoices,
        caretaker_documents,
        egenandel_type,
        egenandel_value,
        claim_no,
        dekningstilsagn,
      } = treat;
      const { note, signature } = dekningstilsagn || {};

      setNewDekningstilsagn({
        insurance_company: insurance_company,
        vet: vet,
        caretaker: caretaker,
        note:
          note ||
          `Vedlagt under følger dekningstilsagn i tilknytning til de mottatte utgiftene i skadesak "${
            claim_no ? claim_no : 'N/A'
          }". Vurderingen av berretigheten til dekning av de ulike utgiftene er basert på din gjeldende forsikringsavtale. Skulle du ha spørsmål i tilknytning til dette oppgjøret kan dette rettes mot oss per telefon eller e-post. Det bemerkes at dette dekningstilsagnet isolert gjelder de utgifter som uttrykkelig står nevnt i oppstillingen under. Dekningstilsagnet foranledninger ellers at opplysningene som er lagt til grunn er korrekt.`,
        vetInvoices: vet_invoices,
        vetDocuments: vet_documents,
        caretakerInvoices: caretaker_invoices,
        caretakerDocuments: caretaker_documents,
        egenandel: {
          symbol: egenandel_type,
          value: egenandel_value,
        },
        signature: signature || `Skadenummer: ${claim_no ? claim_no : 'N/A'}`,
      });
    }
  }, [treat, newDekningstilsagn]);

  useEffect(() => {
    if (id) {
      dispatch({
        type: actions.GET_TREAT,
        payload: { id },
      });
    }
  }, [id]);

  useEffect(() => {
    if (newDekningstilsagn) {
      localStorage.setItem(
        'draftDekningstilsagn',
        JSON.stringify(newDekningstilsagn)
      );
    }
  }, [newDekningstilsagn]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('draftDekningstilsagn');
    };
  }, []);

  const updateDekningstilsagn = (field, value) => {
    setNewDekningstilsagn({ ...newDekningstilsagn, [field]: value });
  };

  const updateVetInvoice = (invoiceIdx, itemIdx, field, value) => {
    const updatedInvoices = newDekningstilsagn.vetInvoices.map(
      (invoice, invoiceIndex) => {
        if (invoiceIndex === invoiceIdx) {
          return {
            ...invoice,
            items: invoice.items.map((item, itemIndex) => {
              if (itemIndex === itemIdx) {
                if (field === 'beløp') {
                  return { ...item, [field]: value, dekket: parseFloat(value) };
                }
                return { ...item, [field]: value };
              } else {
                return item;
              }
            }),
          };
        } else {
          return invoice;
        }
      }
    );
    updateDekningstilsagn('vetInvoices', updatedInvoices);
  };

  const updateCaretakerInvoice = (invoiceIdx, field, value) => {
    const updatedInvoices = newDekningstilsagn.caretakerInvoices.map(
      (invoice, invoiceIndex) => {
        if (invoiceIndex === invoiceIdx) {
          if (field === 'cost') {
            return {
              ...invoice,
              cost: value,
              dekket: parseFloat(value),
            };
          }
          return {
            ...invoice,
            [field]: value,
          };
        } else {
          return invoice;
        }
      }
    );
    updateDekningstilsagn('caretakerInvoices', updatedInvoices);
  };

  const addNewVetInvoiceItem = (index) => {
    const updatedInvoices = newDekningstilsagn.vetInvoices.map(
      (invoice, idx) => {
        if (index === idx) {
          return {
            ...invoice,
            items: [
              ...invoice.items,
              {
                beløp: 0,
                dekket: 0,
                tekst: 'Ny element',
              },
            ],
          };
        }
        return invoice;
      }
    );
    updateDekningstilsagn('vetInvoices', updatedInvoices);
  };

  const addNewCaretakerInvoice = () => {
    const updatedInvoices = [
      ...newDekningstilsagn.caretakerInvoices,
      {
        treat_id: id,
        description: 'Ny post',
        cost: 0,
        dekket: 0,
      },
    ];
    updateDekningstilsagn('caretakerInvoices', updatedInvoices);
  };

  const sumVetDekket = useMemo(() => {
    let sum = 0;
    if (newDekningstilsagn && newDekningstilsagn.vetInvoices) {
      newDekningstilsagn.vetInvoices.map((invoice) => {
        sum += invoice.items.reduce((acc, item) => acc + item.dekket, 0);
      });
    }
    return sum;
  }, [newDekningstilsagn]);

  const sumVetIkkeDekket = useMemo(() => {
    let sum = 0;
    if (newDekningstilsagn && newDekningstilsagn.vetInvoices) {
      newDekningstilsagn.vetInvoices.map((invoice) => {
        sum += invoice.items.reduce(
          (acc, item) => acc + item.beløp - item.dekket,
          0
        );
      });
    }
    return sum;
  }, [newDekningstilsagn]);

  const sumCaretakerDekket = useMemo(() => {
    if (newDekningstilsagn && newDekningstilsagn.caretakerInvoices) {
      return newDekningstilsagn.caretakerInvoices.reduce(
        (acc, item) => acc + item.dekket,
        0
      );
    }
    return 0;
  }, [newDekningstilsagn]);

  const sumCaretakerIkkeDekket = useMemo(() => {
    if (newDekningstilsagn && newDekningstilsagn.caretakerInvoices) {
      return newDekningstilsagn.caretakerInvoices.reduce(
        (acc, item) => acc + parseFloat(item.cost) - item.dekket,
        0
      );
    }
    return 0;
  }, [newDekningstilsagn]);

  const submitDekningstilsagn = () => {
    dispatch({
      type: actions.SAVE_DEKNINGSTILSAGN,
      payload: {
        id,
        data: newDekningstilsagn,
      },
    });
  };

  useEffect(() => {
    if (isSavingDekningstilsagnSuccess) {
      dispatch({ type: actions.INIT_DEKNINGSTILSAGN });
      localStorage.removeItem('draftDekningstilsagn');
      navigate(`/case/${id}`);
    }
  }, [isSavingDekningstilsagnSuccess]);

  if (!newDekningstilsagn || !treat) {
    return <Loader />;
  }

  return (
    <CustomerLayout>
      <CaseHeading />
      <Card className="dekningstilsagn-content">
        <InsuranceCompany
          note={newDekningstilsagn.note}
          company={newDekningstilsagn.insurance_company}
          updateDekningstilsagn={updateDekningstilsagn}
        />
        <VetInvoices
          invoices={newDekningstilsagn.vetInvoices}
          documents={newDekningstilsagn.vetDocuments}
          sumDekket={sumVetDekket}
          sumIkkeDekket={sumVetIkkeDekket}
          updateInvoice={updateVetInvoice}
          addNewItem={addNewVetInvoiceItem}
        />
        <PetOwnerInvoice
          invoices={newDekningstilsagn.caretakerInvoices}
          documents={[
            ...newDekningstilsagn.caretakerDocuments,
            ...newDekningstilsagn.caretakerInvoices,
          ]}
          updateInvoice={updateCaretakerInvoice}
          addNewInvoice={addNewCaretakerInvoice}
          sumDekket={sumCaretakerDekket}
          sumIkkeDekket={sumCaretakerIkkeDekket}
        />
        <Summary
          egenandel={newDekningstilsagn.egenandel}
          sumVetDekket={sumVetDekket}
          sumVetIkkeDekket={sumVetIkkeDekket}
          sumCaretakerDekket={sumCaretakerDekket}
          sumCaretakerIkkeDekket={sumCaretakerIkkeDekket}
          vetBankAccount={newDekningstilsagn.vet?.bank_account_number}
          caretakerBankAccount={
            newDekningstilsagn.caretaker?.bank_account_number
          }
          kids={newDekningstilsagn.vetInvoices.map((invoice) => invoice.KID)}
          signature={newDekningstilsagn.signature}
          updateDekningstilsagn={updateDekningstilsagn}
          submitDekningstilsagn={submitDekningstilsagn}
        />
      </Card>
    </CustomerLayout>
  );
}
