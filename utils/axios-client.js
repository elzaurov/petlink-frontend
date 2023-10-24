import axios from 'axios';

const axiosClient = axios.create();

axiosClient.defaults.baseURL = '/api';
axiosClient.defaults.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// To share cookies to cross site domain, change to true.
axiosClient.defaults.withCredentials = false;

export function getCustomRequest(URL) {
  return axios.get(`/${URL}`).then((response) => response);
}

export function getRequest(URL, options = {}) {
  return axiosClient.get(`/${URL}`, options).then((response) => response);
}

export function postRequest(URL, payload, config = {}) {
  return axiosClient
    .post(`/${URL}`, payload, config)
    .then((response) => response);
}

export function putRequest(URL, payload) {
  return axiosClient.put(`/${URL}`, payload).then((response) => response);
}

export function patchRequest(URL, payload) {
  return axiosClient.patch(`/${URL}`, payload).then((response) => response);
}

export function deleteRequest(URL) {
  return axiosClient.delete(`/${URL}`).then((response) => response);
}
