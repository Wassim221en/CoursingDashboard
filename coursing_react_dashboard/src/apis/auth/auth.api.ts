import CoursingApiInstance from 'apis/coursing-api.instance';
import {
  IChangePasswordPayload,
  ILoginPayload,
  ILoginResponse,
} from './auth.interfaces';
import AuthApiRoutes from './auth.api-routes';

const logIn = async (payload: ILoginPayload) => {
  const { data } = await CoursingApiInstance.post<ILoginResponse>(
    AuthApiRoutes.LogIn,
    payload,
  );
  return data;
};

const changePassword = async (payload: IChangePasswordPayload) => {
  await CoursingApiInstance.post(AuthApiRoutes.ChangePassword, payload);
};

const refreshToken = async (accessToken: string) => {
  const { data } = await CoursingApiInstance.post(
    AuthApiRoutes.refreshToken,
    `"${accessToken}"`,
    {
      headers: {
        'Content-Type': 'text/json',
      },
    },
  );
  return data;
};

const removeAccount = async (userId: number, isHard: boolean) => {
  const { data } = await CoursingApiInstance.delete(
    AuthApiRoutes.removeAccount,
    {
      params: { userId, isHard },
    },
  );
  return data;
};

const generateResetCode = async (userId: number) => {
  const { data } = await CoursingApiInstance.get<number>(
    AuthApiRoutes.generateResetCode,
    {
      params: { userId },
    },
  );
  return data;
};

const authApi = {
  logIn,
  changePassword,
  refreshToken,
  removeAccount,
  generateResetCode,
};

export default authApi;
