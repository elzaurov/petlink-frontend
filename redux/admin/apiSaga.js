import { all, put, takeLatest } from 'redux-saga/effects';
import actions from './actions';
import { postRequest, getRequest, putRequest } from '../../utils/axios-client';
import { callApi } from '../rootSaga';

function* getVets() {
  try {
    const response = yield callApi(() => getRequest('admin/vets'));
    yield put({
      type: actions.GET_VETS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_VETS_FAILURE });
  }
}

function* getVet(action) {
  const { id } = action.payload;
  try {
    const response = yield callApi(() => getRequest(`admin/vets/${id}`));
    yield put({
      type: actions.GET_VET_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_VET_FAILURE });
  }
}

function* addNewVet(action) {
  try {
    const response = yield callApi(() =>
      postRequest('admin/vets/create', action.payload)
    );
    yield put({ type: actions.ADD_VET_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({ type: actions.ADD_VET_FAILURE });
  }
}

function* updateVet(action) {
  try {
    const response = yield callApi(() =>
      putRequest(`admin/vets/${action.payload.id}`, action.payload)
    );
    yield put({ type: actions.UPDATE_VET_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({ type: actions.UPDATE_VET_FAILURE });
  }
}

function* getInsuranceCompanies() {
  try {
    const response = yield callApi(() =>
      getRequest('admin/insurance-companies')
    );
    yield put({
      type: actions.GET_INSURANCE_COMPANIES_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_INSURANCE_COMPANIES_FAILURE });
  }
}

function* getInsuranceCompany(action) {
  const { id } = action.payload;
  try {
    const response = yield callApi(() =>
      getRequest(`admin/insurance-companies/${id}`)
    );
    yield put({
      type: actions.GET_INSURANCE_COMPANY_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_INSURANCE_COMPANY_FAILURE });
  }
}

function* addNewInsuranceCompany(action) {
  try {
    const response = yield callApi(() =>
      postRequest('admin/insurance-companies/create', action.payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
    yield put({
      type: actions.ADD_INSURANCE_COMPANY_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.ADD_INSURANCE_COMPANY_FAILURE });
  }
}

function* updateInsuranceCompany(action) {
  try {
    const response = yield callApi(() =>
      postRequest(
        `admin/insurance-companies/${action.payload.id}`,
        action.payload.data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
    );
    yield put({
      type: actions.UPDATE_INSURANCE_COMPANY_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.UPDATE_INSURANCE_COMPANY_FAILURE });
  }
}

function* getTreats() {
  try {
    const response = yield callApi(() => getRequest('admin/treats'));
    yield put({
      type: actions.GET_TREATS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_TREATS_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.GET_VETS, getVets)]);
  yield all([takeLatest(actions.GET_VET, getVet)]);
  yield all([takeLatest(actions.ADD_VET, addNewVet)]);
  yield all([takeLatest(actions.UPDATE_VET, updateVet)]);
  yield all([
    takeLatest(actions.GET_INSURANCE_COMPANIES, getInsuranceCompanies),
  ]);
  yield all([takeLatest(actions.GET_INSURANCE_COMPANY, getInsuranceCompany)]);
  yield all([
    takeLatest(actions.ADD_INSURANCE_COMPANY, addNewInsuranceCompany),
  ]);
  yield all([
    takeLatest(actions.UPDATE_INSURANCE_COMPANY, updateInsuranceCompany),
  ]);
  yield all([takeLatest(actions.GET_TREATS, getTreats)]);
}
