import axios from 'axios';
import store from './store';

const axiosService = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosService.interceptors.request.use(async (config) => {
  const { token } = store.getState().auth;
  if (token !== null) {
    config.headers!.Authorization = `Token ${token}`;
  }
  return config;
});

export default axiosService;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function getDayMonthYear(dateString: string) {
  let date = new Date(dateString);
  return `${
    MONTHS[date.getUTCMonth()]
  } ${date.getUTCDate()}, ${date.getFullYear()}`;
}

export function getTime(dateString: string) {
  let date = new Date(dateString);
  return `${
    date.getHours() ? date.getHours() % 12 : date.getHours() + 12
  }:${date.getMinutes()}:${date.getSeconds()} ${
    date.getHours() > 12 ? 'PM' : 'AM'
  }`;
}
