import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface IRoles {
  id: number;
  roleName: string;
  webContents: string;
}

export interface IUser {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: number;
  roles: IRoles[];
}

export interface IUserPayload {
  id?: number;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  password: string;
}
export interface IUserPayloadForm {
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  roleId: TAutoComplete;
  password: string;
}

export interface ISetUserPasswordPayload {
  userId: number;
  newPassword: string;
}
