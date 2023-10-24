import { all, call, put } from 'redux-saga/effects';
import authenticateSaga from './auth/apiSaga';
import adminSaga from './admin/apiSaga';
import vetSaga from './customer/apiSaga';
import { getCustomRequest } from '../utils/axios-client';
import actions from './auth/actions';
import { notification } from 'antd';

// Here you can include all the saga which you write for components
export default function* rootSaga() {
  yield all([authenticateSaga(), adminSaga(), vetSaga()]);
}

export function* callApi(apiFunction, ...args) {
  try {
    yield call(() => getCustomRequest('sanctum/csrf-cookie'));
    const response = yield call(apiFunction, ...args);
    handleSuccessfulResponse(response);
    return response;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

function handleSuccessfulResponse(response) {
  if (response.status === 200 && response.data.notification) {
    showNotification(
      'success',
      response.data.notification.title,
      response.data.notification.message
    );
  }
}

function handleError(error) {
  if (error.response) {
    const errorHandlerMapping = {
      401: () => put({ type: actions.UNAUTHORIZED }),
      500: () =>
        showNotification(
          'error',
          'Midlertidig serverproblem',
          'Vi opplever for øyeblikket noen tekniske problemer. Våre ingeniører jobber med saken, og vi håper å ha det løst snart. Vennligst prøv igjen senere.'
        ),
      422: () => {
        const validationErrors = error.response.data.message;
        const errorMessages = Object.values(validationErrors).flat().join('\n');

        showNotification(
          'error',
          'Validering mislyktes',
          `Det ser ut til at det var et problem med informasjonen som ble gitt: ${errorMessages} Vennligst sjekk og prøv igjen.`
        );
      },
    };
    const errorHandler =
      errorHandlerMapping[error.response.status] ||
      (() =>
        showNotification(
          'error',
          'Uventet feil',
          `Oops, noe gikk galt: ${error.response.data.message}. Vennligst prøv igjen, eller kontakt support hvis problemet vedvarer.`
        ));
    errorHandler();
  }
}

function showNotification(type, title, message) {
  notification[type]({
    duration: 8,
    message: title,
    description: message,
  });
}
