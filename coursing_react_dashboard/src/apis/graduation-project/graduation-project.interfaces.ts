import { IFileUploaderFile } from '@craft-code/file-uploader';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface IGraduationProjectPayload {
  id?: number;
  title: string;
  description: string;
  collegeId: number;
  year: number;
  filesUrl?: string[];
}

export interface IGraduationProjectPayloadForm {
  id?: number;
  title: string;
  description: string;
  collegeId: TAutoComplete;
  year: TAutoComplete;
  files: IFileUploaderFile[];
}

export interface IGraduationProject {
  id?: number;
  title: string;
  description: string;
  year: number;
  filesUrl?: string[];
  college: TAutoComplete;
}
export interface IGetGraduationProjectPayload {
  collegeId?: number | null;
  year?: number | null;
}
