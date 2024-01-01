import axios, { AxiosError } from 'axios';
import I18n from '../language/I18n';
import { showToast } from '../services/generalservices';
import store from '../store';

let state = store.getState();
store.subscribe(() => {
  state = store.getState();
});

const httpClient = axios.create({
  // baseURL: 'https://demo.creativitykw.com/P168-CEO/P168-CEO-Backend/public/api',
  baseURL: 'https://www.qa3at.co/v1/public/api',
  timeout: 5000,
  timeoutErrorMessage: I18n.t('Something went wrong'),
});

httpClient.interceptors.request.use(
  function (config) {
    if (!config) {
      config = {};
    }
    if (!config?.headers) {
      config.headers = {};
    }

    if (Object.keys(state.auth.data).length !== 0) {
      console.log('Under if condition,token present');
      config.headers = {
        'Content-Type': 'application/json',
        'custom-token': '295828be2ad95b95abcfe20ed09d4df9',
        Authorization: `Bearer ${state.auth.data.token}`,
        language: state.lang.lang,
        'x-country': state.master.selectedCountry?.title_en,
        ...config.headers,
      };
    } else {
      config.headers = {
        'Content-Type': 'application/json',
        'custom-token': '295828be2ad95b95abcfe20ed09d4df9',
        language: state.lang.lang,
        'x-country': state.master.selectedCountry?.title_en,
        ...config.headers,
      };
    }

    console.log(`Bearer ${state.auth.data.token}`);

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

httpClient.interceptors.response.use(
  function (response) {
    if (response?.data.status === 'success') {
      // showToast({ msg: response?.data?.msg, color: "green" })
    } else {
      console.log(response?.data?.msg);
      if (!response?.data?.Email && !response?.data?.Username) {
        showToast({ msg: response?.data?.msg, color: 'red' });
      }
    }
    return response;
  },
  function (error) {
    let res = error.response;
    if (error instanceof AxiosError && error?.message) {
      showToast({ msg: error.message, color: 'red' });
    } else {
      showToast({ msg: String(res), color: 'red' });
    }
    return null;
  },
);

export default httpClient;
