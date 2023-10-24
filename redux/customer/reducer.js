import actions from './actions';

const initialState = {
  treats: [],
  isFetchingTreats: false,

  newTreat: null,
  treat: null,
  isFetchingTreat: false,
  isDraftingTreat: false,
  isDraftingSuccess: false,
  isAddingTreat: false,
  isUpdatingTreat: false,
  isCreateTreatSuccess: null,
  isRejectTreat: false,
  isCompleteTreat: false,
  isDeleteTreat: false,
  isReopenTreat: false,
  isDuplicateTreat: false,
  isRequestingTreat: false,
  isUploadingPetOwnerFiles: false,

  petCategories: [],
  isFetchingPetCategories: false,

  insuranceCompanies: [],
  isFetchingInsuranceCompanies: false,

  isSendingMessage: false,

  downloadFile: null,
  isDownloadingFile: false,

  isUploadingInvoice: false,
  isSuccessInvoiceProcess: false,
  invoice: null,

  notes: [],
  isFetchingNotes: false,
  isCreatingNote: false,
  isUpdatingNote: false,
  isDeletingNote: false,

  isSavingDekningstilsagn: false,
  isSavingDekningstilsagnSuccess: false,
};

function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_MY_TREATS:
      return { ...state, isFetchingTreats: true, newTreat: null, treat: null };
    case actions.GET_MY_TREATS_SUCCESS:
      return { ...state, isFetchingTreats: false, treats: action.payload.data };
    case actions.GET_MY_TREATS_FAILURE:
      return { ...state, isFetchingTreats: false };

    case actions.GET_TREAT:
      return { ...state, isFetchingTreat: true };
    case actions.GET_TREAT_SUCCESS:
      return {
        ...state,
        isFetchingTreat: false,
        treat: action.payload.data,
        invoices: action.payload.data.invoices,
      };
    case actions.GET_TREAT_FAILURE:
      return { ...state, isFetchingTreat: false };

    case actions.GET_PET_CATEGORIES:
      return { ...state, isFetchingPetCategories: true };
    case actions.GET_PET_CATEGORIES_SUCCESS:
      return {
        ...state,
        isFetchingPetCategories: false,
        petCategories: action.payload.data,
      };
    case actions.GET_PET_CATEGORIES_FAILURE:
      return { ...state, petCategories: false };

    case actions.GET_AVAILABLE_INSURANCE_COMPANIES:
      return { ...state, isFetchingInsuranceCompanies: true };
    case actions.GET_AVAILABLE_INSURANCE_COMPANIES_SUCCESS:
      return {
        ...state,
        isFetchingInsuranceCompanies: false,
        insuranceCompanies: action.payload.data,
      };
    case actions.GET_AVAILABLE_INSURANCE_COMPANIES_FAILURE:
      return { ...state, isFetchingInsuranceCompanies: false };

    case actions.SET_TREAT:
      return { ...state, newTreat: { ...state.newTreat, ...action.payload } };

    case actions.DRAFT_TREAT:
      return { ...state, isDraftingTreat: true, isDraftingSuccess: false };
    case actions.DRAFT_TREAT_SUCCESS:
      return {
        ...state,
        isDraftingTreat: false,
        isDraftingSuccess: true,
        newTreat: null,
        treats: action.payload.isUpdate
          ? state.treats.map((treat) => {
              if (treat.id === action.payload.res.data.id) {
                return action.payload.res.data;
              } else {
                return treat;
              }
            })
          : [...state.treats, action.payload.res.data],
        treat: action.payload.data,
        invoices: [],
        invoice: null,
      };
    case actions.DRAFT_TREAT_FAILURE:
      return { ...state, isDraftingTreat: false, isDraftingSuccess: false };

    case actions.CREATE_TREAT:
      return { ...state, isAddingTreat: true, isCreateTreatSuccess: null };
    case actions.CREATE_TREAT_SUCCESS:
      return {
        ...state,
        isAddingTreat: false,
        isCreateTreatSuccess: true,
        newTreat: null,
        treats: [...state.treats, action.payload.data],
        treat: action.payload.data,
        invoices: [],
        invoice: null,
        isSuccessInvoiceProcess: false,
      };
    case actions.CREATE_TREAT_FAILURE:
      return { ...state, isAddingTreat: false, isCreateTreatSuccess: false };

    case actions.UPDATE_TREAT:
      return { ...state, isAddingTreat: true, isCreateTreatSuccess: null };
    case actions.UPDATE_TREAT_SUCCESS:
      return {
        ...state,
        isAddingTreat: false,
        isCreateTreatSuccess: true,
        newTreat: null,
        treats: state.treats.map((treat) => {
          if (treat.id === action.payload.data.id) {
            return action.payload.data;
          }
          return treat;
        }),
        treat: action.payload.data,
        isSuccessInvoiceProcess: false,
      };
    case actions.UPDATE_TREAT_FAILURE:
      return { ...state, isAddingTreat: false, isCreateTreatSuccess: false };

    case actions.UPDATE_TREAT_NUMBER:
      return { ...state, isUpdatingTreat: true };
    case actions.UPDATE_TREAT_NUMBER_SUCCESS:
      return {
        ...state,
        isUpdatingTreat: false,
        treat: action.payload.data,
      };
    case actions.UPDATE_TREAT_NUMBER_FAILURE:
      return { ...state, isUpdatingTreat: false };

    case actions.REJECT_TREAT:
      return { ...state, isRejectTreat: true };
    case actions.REJECT_TREAT_SUCCESS:
      return {
        ...state,
        isRejectTreat: false,
        treats: state.treats.map((treat) => {
          if (treat.id === action.payload.data.id) {
            return action.payload.data;
          }
          return treat;
        }),
        treat: action.payload.data,
      };
    case actions.REJECT_TREAT_FAILURE:
      return { ...state, isRejectTreat: false };

    case actions.COMPLETE_TREAT:
      return { ...state, isCompleteTreat: true };
    case actions.COMPLETE_TREAT_SUCCESS:
      return {
        ...state,
        isCompleteTreat: false,
        treats: state.treats.map((treat) => {
          if (treat.id === action.payload.data.id) {
            return action.payload.data;
          }
          return treat;
        }),
        treat: action.payload.data,
      };
    case actions.COMPLETE_TREAT_FAILURE:
      return { ...state, isCompleteTreat: false };

    case actions.DELETE_TREAT:
      return { ...state, isDeleteTreat: true };
    case actions.DELETE_TREAT_SUCCESS:
      return {
        ...state,
        isDeleteTreat: false,
        treat: null,
        treats: state.treats.filter(
          (treat) => treat.id !== parseInt(action.payload.data.id)
        ),
      };
    case actions.DELETE_TREAT_FAILURE:
      return { ...state, isDeleteTreat: false };

    case actions.REOPEN_TREAT:
      return { ...state, isReopenTreat: true };
    case actions.REOPEN_TREAT_SUCCESS:
      return {
        ...state,
        isReopenTreat: false,
        treat: action.payload.data,
        treats: state.treats.map((treat) => {
          if (treat.id === action.payload.data.id) {
            return action.payload.data;
          }
          return treat;
        }),
      };
    case actions.REOPEN_TREAT_FAILURE:
      return { ...state, isReopenTreat: false };

    case actions.DUPLICATE_TREAT:
      return { ...state, isDuplicateTreat: true };
    case actions.DUPLICATE_TREAT_SUCCESS:
      return {
        ...state,
        isDuplicateTreat: false,
        treat: action.payload.data,
        treats: [...state.treats, action.payload.data],
      };
    case actions.DUPLICATE_TREAT_FAILURE:
      return { ...state, isDuplicateTreat: false };

    case actions.SEND_MESSAGE:
      return { ...state, isSendingMessage: true };
    case actions.SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        isSendingMessage: false,
      };
    case actions.SEND_MESSAGE_FAILURE:
      return { ...state, isSendingMessage: false };

    case actions.DOWNLOAD_TREAT_OVERVIEW:
      return { ...state, isDownloadingFile: true };
    case actions.DOWNLOAD_TREAT_OVERVIEW_SUCCESS:
      return {
        ...state,
        downloadFile: action.payload,
        isDownloadingFile: false,
      };
    case actions.DOWNLOAD_TREAT_OVERVIEW_FAILURE:
      return { ...state, isDownloadingFile: false };

    case actions.NEW_MESSAGE:
      return {
        ...state,
        treat: {
          ...state.treat,
          messages: [...state.treat.messages, action.payload],
        },
      };

    case actions.SEND_REQUEST_TO_OWNER:
      return { ...state, isRequestingTreat: true };
    case actions.SEND_REQUEST_TO_OWNER_SUCCESS:
      return {
        ...state,
        isRequestingTreat: false,
      };
    case actions.SEND_REQUEST_TO_OWNER_FAILURE:
      return { ...state, isRequestingTreat: false };

    case actions.UPLOAD_PET_OWNER_FILES:
      return { ...state, isUploadingPetOwnerFiles: true };
    case actions.UPLOAD_PET_OWNER_FILES_SUCCESS:
      return {
        ...state,
        isUploadingPetOwnerFiles: false,
      };
    case actions.UPLOAD_PET_OWNER_FILES_FAILURE:
      return { ...state, isUploadingPetOwnerFiles: false };

    case actions.UPLOAD_INVOICE:
      return {
        ...state,
        isUploadingInvoice: true,
        isSuccessInvoiceProcess: false,
      };
    case actions.UPLOAD_INVOICE_SUCCESS:
      return {
        ...state,
        isUploadingInvoice: false,
        isSuccessInvoiceProcess: true,
        invoice: action.payload.data,
      };
    case actions.UPLOAD_INVOICE_FAILURE:
      return { ...state, isUploadingInvoice: false };

    case actions.SET_INVOICE:
      return { ...state, invoice: action.payload };

    case actions.DELETE_INVOICE:
      return { ...state, isDeleteInvoice: true };
    case actions.DELETE_INVOICE_SUCCESS:
      return {
        ...state,
        isDeleteInvoice: false,
        invoices: state.invoices.filter(
          (invoice) => invoice.id !== action.payload
        ),
        invoice: state.invoice.id === action.payload ? null : state.invoice,
      };
    case actions.DELETE_INVOICE_FAILURE:
      return { ...state, isDeleteInvoice: false };

    case actions.GET_NOTES:
      return { ...state, isFetchingNotes: true };
    case actions.GET_NOTES_SUCCESS:
      return { ...state, notes: action.payload.data, isFetchingNotes: false };
    case actions.GET_NOTES_FAILURE:
      return { ...state, isFetchingNotes: false };

    case actions.CREATE_NOTE:
      return { ...state, isCreatingNote: true };
    case actions.CREATE_NOTE_SUCCESS:
      return {
        ...state,
        isCreatingNote: false,
        notes: [...state.notes, action.payload.data],
      };
    case actions.CREATE_NOTE_FAILURE:
      return {
        ...state,
        isCreatingNote: false,
      };

    case actions.UPDATE_NOTE:
      return {
        ...state,
        isUpdatingNote: true,
      };
    case actions.UPDATE_NOTE_SUCCESS:
      return {
        ...state,
        isUpdatingNote: false,
        notes: state.notes.map((note) => {
          if (note.id === action.payload.data.id) {
            return action.payload.data;
          } else {
            return note;
          }
        }),
      };
    case actions.DELETE_NOTE:
      return { ...state, isDeletingNote: true };
    case actions.DELETE_NOTE_SUCCESS:
      return {
        ...state,
        isDeletingNote: false,
        notes: state.notes.filter((note) => note.id !== action.payload.id),
      };
    case actions.DELETE_NOTE_FAILURE:
      return {
        ...state,
        isDeletingNote: false,
      };

    case actions.SAVE_DEKNINGSTILSAGN:
      return {
        ...state,
        isSavingDekningstilsagn: true,
        isSavingDekningstilsagnSuccess: false,
      };
    case actions.SAVE_DEKNINGSTILSAGN_SUCCESS:
      return {
        ...state,
        isSavingDekningstilsagn: false,
        isSavingDekningstilsagnSuccess: true,
      };
    case actions.SAVE_DEKNINGSTILSAGN_FAILURE:
      return {
        ...state,
        isSavingDekningstilsagn: false,
        isSavingDekningstilsagnSuccess: false,
      };

    case actions.INIT_DEKNINGSTILSAGN:
      return {
        ...state,
        isSavingDekningstilsagnSuccess: false,
      };

    default:
      return state;
  }
}

export default Reducer;
