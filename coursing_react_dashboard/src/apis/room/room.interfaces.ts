import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface IRoom {
  id: number;
  admin: TAutoComplete;
  name: string;
  password?: string;
  description: string;
  members: TAutoComplete[];
}

export interface IRoomPayload {
  id?: number;
  adminId: number;
  name: string;
  password: string;
  description: string;
  usersId: number[];
}

export interface IRoomPayloadForm {
  id?: number;
  adminId: TAutoComplete;
  name: string;
  password: string;
  description: string;
  usersId: TAutoComplete[];
}

export interface IUserRoomPayload {
  roomId: number;
  users: number[];
}

export interface IUserRoomPayloadForm {
  users: TAutoComplete;
}

export type IMember = TAutoComplete;

