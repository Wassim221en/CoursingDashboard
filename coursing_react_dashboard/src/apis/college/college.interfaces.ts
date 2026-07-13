import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IUniversity } from 'apis/university/university.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface ICollege {
  id: number;
  name: string;
  university: IUniversity;
  filesUrl: string[];
}

export interface ICollegePayloadForm {
  id: number;
  collegeName: string;
  universityId: TAutoComplete;
  files: IFileUploaderFile[];
}

export interface ICollegePayload {
  id?: number;
  collegeName: string;
  universityId: number | null;
}

export interface IUniversityCollege {
  id: number;
  collegeCollegeName: string;
}

export interface IGetCollegePayload {
  universityId?: number | null;
}
