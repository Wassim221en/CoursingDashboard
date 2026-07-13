/* eslint-disable no-useless-computed-key */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoginResponse } from 'apis/auth/auth.interfaces';

const initialState: ILoginResponse = {
  expiration: '',
  token: '',
  refreshToken: '',
  fullName: '',
  permissions: {
    roleName: '',
    webContentsForDashboardRole: {
      permissions: {
        base: [],
        schooling: { base: [], setting: [] },
        setting: [],
        specialty: { base: [], setting: [] },
        university: { base: [], setting: [] },
      },
      roleName: '',
      roleId: 0,
    },
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => ({ ...initialState }),
  },
  extraReducers: {
    ['auth/login/fulfilled']: (
      state,
      action: PayloadAction<ILoginResponse>,
    ) => ({
      ...state,
      ...action.payload,
    }),
    ['auth/refreshToken/fulfilled']: (
      state,
      action: PayloadAction<ILoginResponse>,
    ) => ({
      ...state,
      ...action.payload,
      permissions: state.permissions,
    }),
  },
});

export const authReducer = authSlice.reducer;

export const authActions = authSlice.actions;
