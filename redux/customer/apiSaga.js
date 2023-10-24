import { all, put, takeLatest } from 'redux-saga/effects';
import actions from './actions';
import {
  postRequest,
  getRequest,
  deleteRequest,
  putRequest,
} from '../../utils/axios-client';
import { callApi } from '../rootSaga';
import { notification } from 'antd';

function* getTreats() {
  try {
    const response = yield callApi(() => getRequest('treats'));
    yield put({
      type: actions.GET_MY_TREATS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_MY_TREATS_FAILURE });
  }
}

function* getTreatByID(action) {
  try {
    const response = yield callApi(() =>
      getRequest(`treat/${action.payload.id}`)
    );
    yield put({
      type: actions.GET_TREAT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_TREAT_FAILURE });
  }
}

function* getPetCategories() {
  try {
    const response = yield callApi(() => getRequest('pet-categories'));
    yield put({
      type: actions.GET_PET_CATEGORIES_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_PET_CATEGORIES_FAILURE });
  }
}

function* getAvailableInsuranceCompanies() {
  try {
    const response = yield callApi(() => getRequest('insurance-companies'));
    yield put({
      type: actions.GET_AVAILABLE_INSURANCE_COMPANIES_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_AVAILABLE_INSURANCE_COMPANIES_FAILURE });
  }
}

function* draftTreat(action) {
  const treatData = action.payload;

  // Remove any fields with empty strings or empty arrays.
  for (const field in treatData) {
    if (
      treatData[field] == '' ||
      treatData[field] == [] ||
      treatData[field] == null
    ) {
      if (field == 'has_treated' && parseInt(treatData[field]) == 0) {
        continue;
      }
      delete treatData[field];
    }
  }

  try {
    const response = yield callApi(() => postRequest('treat/draft', treatData));
    yield put({
      type: actions.DRAFT_TREAT_SUCCESS,
      payload: { isUpdate: treatData.treat_id, res: response.data },
    });
  } catch (error) {
    yield put({ type: actions.DRAFT_TREAT_FAILURE });
  }
}

function* createTreat(action) {
  try {
    const response = yield callApi(() => postRequest('treat', action.payload));
    yield put({
      type: actions.CREATE_TREAT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.CREATE_TREAT_FAILURE });
  }
}

function* updateTreat(action) {
  try {
    const response = yield callApi(() =>
      putRequest(`treat/${action.payload.id}`, action.payload.data)
    );
    yield put({
      type: actions.UPDATE_TREAT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.UPDATE_TREAT_FAILURE });
  }
}

function* updateTreatNumber(action) {
  try {
    const response = yield callApi(() =>
      putRequest(`treat/${action.payload.id}/number`, action.payload)
    );
    yield put({
      type: actions.UPDATE_TREAT_NUMBER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.UPDATE_TREAT_NUMBER_FAILURE });
  }
}

function* rejectTreat(action) {
  try {
    const response = yield callApi(() =>
      postRequest('treat/reject', action.payload)
    );
    yield put({
      type: actions.REJECT_TREAT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.REJECT_TREAT_FAILURE });
  }
}

function* completeTreat(action) {
  try {
    const response = yield callApi(() =>
      postRequest('treat/complete', action.payload)
    );
    yield put({
      type: actions.COMPLETE_TREAT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.COMPLETE_TREAT_FAILURE });
  }
}

function* deleteTreat(action) {
  try {
    const response = yield callApi(() =>
      deleteRequest(`treat/${action.payload.id}`)
    );
    yield put({
      type: actions.DELETE_TREAT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.DELETE_TREAT_FAILURE });
  }
}

function* reopenTreat(action) {
  try {
    const response = yield callApi(() =>
      putRequest(`treat/${action.payload.id}/reopen`)
    );
    yield put({
      type: actions.REOPEN_TREAT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.REOPEN_TREAT_FAILURE });
  }
}

function* duplicateTreat(action) {
  try {
    const response = yield callApi(() =>
      putRequest(`treat/${action.payload.id}/duplicate`)
    );
    yield put({
      type: actions.DUPLICATE_TREAT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.DUPLICATE_TREAT_FAILURE });
  }
}

function* downloadTreatOverviewFile(action) {
  try {
    const response = yield callApi(() =>
      getRequest(`treat/${action.payload.id}/download/overview`, {
        responseType: 'blob',
      })
    );
    yield put({
      type: actions.DOWNLOAD_TREAT_OVERVIEW_SUCCESS,
      payload: new Blob([response.data]),
    });
  } catch (error) {
    yield put({ type: actions.DOWNLOAD_TREAT_OVERVIEW_FAILURE });
  }
}

function* sendMessage(action) {
  try {
    const response = yield callApi(() =>
      postRequest('message/send', action.payload)
    );
    yield put({
      type: actions.SEND_MESSAGE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.SEND_MESSAGE_FAILURE });
  }
}

function* sendRequestToOwner(action) {
  try {
    const response = yield callApi(() =>
      getRequest(`treat/${action.payload.id}/request`)
    );
    yield put({
      type: actions.SEND_REQUEST_TO_OWNER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.SEND_REQUEST_TO_OWNER_FAILURE });
  }
}

function* uploadPetOwnerFiles(action) {
  try {
    const response = yield callApi(() =>
      postRequest('pet-owner/upload', action.payload)
    );
    yield put({
      type: actions.UPLOAD_PET_OWNER_FILES_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.UPLOAD_PET_OWNER_FILES_FAILURE });
  }
}

function* uploadInvoice(action) {
  try {
    const formData = new FormData();
    formData.append('file', action.payload.file);

    const response = yield axios.post('/api/invoice/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    yield put({
      type: actions.UPLOAD_INVOICE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    // Notification for try more.
    notification['info']({
      duration: 8,
      message: 'Prøv igjen',
      description: 'Noe gikk galt. Vennligst prøv igjen.',
    });
    yield put({ type: actions.UPLOAD_INVOICE_FAILURE });
  }
}

function* deleteInvoice(action) {
  try {
    yield callApi(() => deleteRequest(`invoice/delete/${action.payload}`));
    yield put({
      type: actions.DELETE_INVOICE_SUCCESS,
      payload: action.payload,
    });
  } catch (error) {
    yield put({ type: actions.DELETE_INVOICE_FAILURE });
  }
}

function* getNotes(action) {
  try {
    const response = yield callApi(() =>
      getRequest(`notes/${action.payload.treatId}`)
    );
    yield put({
      type: actions.GET_NOTES_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_NOTES_FAILURE });
  }
}

function* createNote(action) {
  try {
    const response = yield callApi(() =>
      postRequest(`notes/${action.payload.treatId}`, action.payload.data)
    );
    yield put({
      type: actions.CREATE_NOTE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.CREATE_NOTE_FAILURE });
  }
}

function* updateNote(action) {
  try {
    const response = yield callApi(() =>
      putRequest(`notes/${action.payload.id}`, action.payload.data)
    );
    yield put({
      type: actions.UPDATE_NOTE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.UPDATE_NOTE_FAILURE });
  }
}

function* deleteNote(action) {
  try {
    yield callApi(() => deleteRequest(`notes/${action.payload.id}`));
    yield put({
      type: actions.DELETE_NOTE_SUCCESS,
      payload: { id: action.payload.id },
    });
  } catch (error) {
    yield put({ type: actions.DELETE_NOTE_FAILURE });
  }
}

function* saveDekningstilsagn(action) {
  try {
    const response = yield callApi(() =>
      postRequest(`dekningstilsagn/${action.payload.id}`, action.payload.data)
    );
    yield put({
      type: actions.SAVE_DEKNINGSTILSAGN_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.SAVE_DEKNINGSTILSAGN_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.GET_MY_TREATS, getTreats)]);
  yield all([takeLatest(actions.GET_TREAT, getTreatByID)]);
  yield all([takeLatest(actions.GET_PET_CATEGORIES, getPetCategories)]);
  yield all([
    takeLatest(
      actions.GET_AVAILABLE_INSURANCE_COMPANIES,
      getAvailableInsuranceCompanies
    ),
  ]);
  yield all([takeLatest(actions.DRAFT_TREAT, draftTreat)]);
  yield all([takeLatest(actions.CREATE_TREAT, createTreat)]);
  yield all([takeLatest(actions.UPDATE_TREAT, updateTreat)]);
  yield all([takeLatest(actions.UPDATE_TREAT_NUMBER, updateTreatNumber)]);
  yield all([takeLatest(actions.REJECT_TREAT, rejectTreat)]);
  yield all([takeLatest(actions.COMPLETE_TREAT, completeTreat)]);
  yield all([takeLatest(actions.DUPLICATE_TREAT, duplicateTreat)]);
  yield all([
    takeLatest(actions.DOWNLOAD_TREAT_OVERVIEW, downloadTreatOverviewFile),
  ]);
  yield all([takeLatest(actions.DELETE_TREAT, deleteTreat)]);
  yield all([takeLatest(actions.REOPEN_TREAT, reopenTreat)]);
  yield all([takeLatest(actions.SEND_MESSAGE, sendMessage)]);
  yield all([takeLatest(actions.SEND_REQUEST_TO_OWNER, sendRequestToOwner)]);
  yield all([takeLatest(actions.UPLOAD_PET_OWNER_FILES, uploadPetOwnerFiles)]);
  yield all([takeLatest(actions.UPLOAD_INVOICE, uploadInvoice)]);
  yield all([takeLatest(actions.DELETE_INVOICE, deleteInvoice)]);

  yield all([takeLatest(actions.GET_NOTES, getNotes)]);
  yield all([takeLatest(actions.CREATE_NOTE, createNote)]);
  yield all([takeLatest(actions.UPDATE_NOTE, updateNote)]);
  yield all([takeLatest(actions.DELETE_NOTE, deleteNote)]);

  yield all([takeLatest(actions.SAVE_DEKNINGSTILSAGN, saveDekningstilsagn)]);
}
