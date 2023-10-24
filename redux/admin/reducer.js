import actions from './actions';

const initialState = {
  vets: [],
  vet: null,
  isFetchingVet: false,
  isFetchingVets: false,
  isAddingVet: false,

  insuranceCompanies: [],
  insuranceCompany: null,
  isFetchingInsuranceCompany: false,
  isFetchingInsuranceCompanies: false,
  isAddingInsuranceCompany: false,

  treats: [],
  isFetchingTreats: false,
};

function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_VETS:
      return { ...state, isFetchingVets: true, vet: null };
    case actions.GET_VETS_SUCCESS:
      return { ...state, isFetchingVets: false, vets: action.payload.data };
    case actions.GET_VETS_FAILURE:
      return { ...state, isFetchingVets: false };

    case actions.GET_VET:
      return { ...state, isFetchingVet: true };
    case actions.GET_VET_SUCCESS:
      return { ...state, isFetchingVet: false, vet: action.payload.data };
    case actions.GET_VET_FAILURE:
      return { ...state, isFetchingVet: false };

    case actions.ADD_VET:
      return { ...state, isAddingVet: true };
    case actions.ADD_VET_SUCCESS:
      return {
        ...state,
        isAddingVet: false,
        vets: [...state.vets, action.payload.data],
      };
    case actions.ADD_VET_FAILURE:
      return {
        ...state,
        isAddingVet: false,
      };

    case actions.UPDATE_VET:
      return { ...state, isAddingVet: true };
    case actions.UPDATE_VET_SUCCESS:
      return {
        ...state,
        isAddingVet: false,
        vets: state.vets.map((vet) => {
          return vet.id === action.payload.data.id ? action.payload.data : vet;
        }),
      };
    case actions.UPDATE_VET_FAILURE:
      return {
        ...state,
        isAddingVet: false,
      };

    case actions.GET_INSURANCE_COMPANIES:
      return {
        ...state,
        isFetchingInsuranceCompanies: true,
        insuranceCompany: null,
      };
    case actions.GET_INSURANCE_COMPANIES_SUCCESS:
      return {
        ...state,
        isFetchingInsuranceCompanies: false,
        insuranceCompanies: action.payload.data,
      };
    case actions.GET_INSURANCE_COMPANIES_FAILURE:
      return { ...state, isFetchingInsuranceCompanies: false };

    case actions.GET_INSURANCE_COMPANY:
      return { ...state, isFetchingInsuranceCompany: true };
    case actions.GET_INSURANCE_COMPANY_SUCCESS:
      return {
        ...state,
        isFetchingInsuranceCompany: false,
        insuranceCompany: action.payload.data,
      };
    case actions.GET_INSURANCE_COMPANY_FAILURE:
      return { ...state, isFetchingInsuranceCompany: false };

    case actions.ADD_INSURANCE_COMPANY:
      return { ...state, isAddingInsuranceCompany: true };
    case actions.ADD_INSURANCE_COMPANY_SUCCESS:
      return {
        ...state,
        isAddingInsuranceCompany: false,
        insuranceCompanies: [...state.insuranceCompanies, action.payload.data],
      };
    case actions.ADD_INSURANCE_COMPANY_FAILURE:
      return {
        ...state,
        isAddingInsuranceCompany: false,
      };

    case actions.UPDATE_INSURANCE_COMPANY:
      return { ...state, isAddingInsuranceCompany: true };
    case actions.UPDATE_INSURANCE_COMPANY_SUCCESS:
      return {
        ...state,
        isAddingInsuranceCompany: false,
        insuranceCompanies: state.insuranceCompanies.map((ic) => {
          return ic.id === action.payload.data.id ? action.payload.data : ic;
        }),
      };
    case actions.UPDATE_INSURANCE_COMPANY_FAILURE:
      return {
        ...state,
        isAddingInsuranceCompany: false,
      };

    case actions.GET_TREATS:
      return { ...state, isFetchingTreats: true };
    case actions.GET_TREATS_SUCCESS:
      return { ...state, isFetchingTreats: false, treats: action.payload.data };
    case actions.GET_TREATS_FAILURE:
      return { ...state, isFetchingTreats: false };

    default:
      return state;
  }
}

export default Reducer;
