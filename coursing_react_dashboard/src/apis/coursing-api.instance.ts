/* eslint-disable no-multi-assign */
import { store } from 'redux/store';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from 'constants/domain';
import { showError, showSuccess } from 'libs/react.toastify';
import { STRINGS } from 'constants/strings';
import authThunks from 'redux/slices/auth/auth.thunks';
import { authActions } from 'redux/slices/auth/auth.slice';
import { isExpiredToken } from 'utils/helpers';

let isRefreshing = false;

const CoursingApiInstance = axios.create({
  baseURL: API_BASE_URL,
});

CoursingApiInstance.interceptors.request.use(
  (config) => {
    const { token } = store.getState().auth;
    if (isRefreshing) config.headers.Authorization = token;
    if (store) {
      if (config.headers) {
        if (token) {
          config.headers.Authorization = token;
        }
      }
    }
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  },
);

CoursingApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { refreshToken, expiration } = store.getState().auth;
    if (
      error?.response?.status === 401 &&
      refreshToken &&
      isExpiredToken(expiration)
    ) {
      isRefreshing = true;
      return store
        .dispatch(authThunks.refreshTokenAsync(refreshToken))
        .then(({ payload: newToken }) => {
          isRefreshing = false;
          const res = {
            ...error.response,
            config: {
              ...error.response.config,
              headers: {
                Authorization: newToken.token,
              },
            },
          };
          return CoursingApiInstance(res.config);
        })
        .catch(() => {
          isRefreshing = false;
          store.dispatch(authActions.logout());
        });
    }

    const message =
      error?.response?.data?.ErrorMessage ?? STRINGS.SOMETHING_WENT_WRONG;
    if ((error as AxiosError).message === 'canceled')
      showSuccess('Upload Canceled');
    else showError(message);
    return Promise.reject(error);
  },
);
export default CoursingApiInstance;
