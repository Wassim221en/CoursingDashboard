// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createAsyncThunk } from '@reduxjs/toolkit';
import authApi from 'apis/auth/auth.api';
import { ILoginPayload } from 'apis/auth/auth.interfaces';

const loginAsync = createAsyncThunk(
  'auth/login',
  async (payload: ILoginPayload) => {
    const result = await authApi.logIn(payload);
    return result;
  },
);

const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (accessToken: string) => {
    const result = await authApi.refreshToken(accessToken);
    return result;
  },
);

const authThunks = {
  loginAsync,
  refreshTokenAsync,
};

export default authThunks;
