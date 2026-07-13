import { IWebContentsForRole } from 'apis/permissions/permissions.interfaces';

export interface ILoginPayload {
  userName: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  expiration: string;
  refreshToken: string;
  fullName: string;
  permissions: IWebContentsForRole;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
