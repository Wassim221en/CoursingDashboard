import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface IUser {
  id: number;
  name: string;
  email: string;
  phoneNumber: number;
  role: number;
  roleName: string;
  roleId: number;
  password: string;
}

export interface IRequestPaper {
  id?: number;
  user: IUser;
  deliveredName: string;
  examId: number;
  lessonId: number;
  description: string;
  address: string;
  status: number;
  type: number;
  countOfCopy: number;
  phoneNumber: number;
  creationDate: string;
  fileId: number;
  fileUrl: string;
  examTitle?: string;
  fileTitle?: string;
  courseTitle?: string;
  lessonTitle?: string;
}

export interface IRequestPaperPayload {
  requestPaperId?: number;
  status: number;
}

export interface IRequestPaperPayloadForm {
  requestPaperId: number;
  status: TAutoComplete;
}
