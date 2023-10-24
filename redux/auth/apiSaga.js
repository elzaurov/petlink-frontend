import { all, put, takeLatest } from 'redux-saga/effects';
import actions from './actions';
import {
  postRequest,
  deleteRequest,
  getRequest,
} from '../../utils/axios-client';
import { callApi } from '../rootSaga';

function* login(action) {
  try {
    const response = yield callApi(() => postRequest('login', action.payload));
    yield put({ type: actions.LOGIN_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({ type: actions.LOGIN_FAILURE });
  }
}

function* getAuthUser() {
  try {
    const response = yield callApi(() => getRequest('auth/user'));
    yield put({
      type: actions.GET_AUTH_USER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.GET_AUTH_USER_FAILURE });
  }
}

function* readNotification(action) {
  try {
    const response = yield callApi(() =>
      getRequest(`notification/${action.payload.id}/read`)
    );
    yield put({
      type: actions.READ_NOTIFICATION_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({ type: actions.READ_NOTIFICATION_FAILURE });
  }
}

function* logout() {
  try {
    yield callApi(() => deleteRequest('logout'));
    yield put({ type: actions.LOGOUT_SUCCESS });
  } catch (e) {
    yield put({ type: actions.LOGOUT_FAILURE });
  }
}

function* forgotPassword(action) {
  try {
    const response = yield callApi(() =>
      postRequest('forgot-password', action.payload)
    );
    yield put({
      type: actions.FORGOT_PASSWORD_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    yield put({
      type: actions.FORGOT_PASSWORD_FAILURE,
    });
  }
}

function* resetPassword(action) {
  try {
    const response = yield callApi(() =>
      postRequest('reset-password', action.payload)
    );
    yield put({ type: actions.RESET_PASSWORD_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({ type: actions.RESET_PASSWORD_FAILURE });
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.GET_AUTH_USER, getAuthUser)]);
  yield all([takeLatest(actions.READ_NOTIFICATION, readNotification)]);
  yield all([takeLatest(actions.LOGIN, login)]);
  yield all([takeLatest(actions.FORGOT_PASSWORD, forgotPassword)]);
  yield all([takeLatest(actions.RESET_PASSWORD, resetPassword)]);
  yield all([takeLatest(actions.LOGOUT, logout)]);
}
