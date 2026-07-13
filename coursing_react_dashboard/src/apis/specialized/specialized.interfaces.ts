import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ICollegeUnit } from 'apis/college-unit/college-unit.interfaces';
import { IQuestionBank } from 'apis/qusetions/questions.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface ISpecialized {
  id: number;
  name: string;
  parentId: number | null;
  fileUrl?: string;
  children: ISpecialized[];
}

export interface ISpecializedPayload {
  id?: number;
  name: string;
  parentId: number | null;
}

export interface ISpecializedPayloadForm {
  id?: number;
  name: string;
  parentId: number | null;
  files: IFileUploaderFile[];
}

export interface ISpecializedUnit {
  id: number;
  title: string;
  description: string | null;
  parentId: number | null;
  children: ICollegeUnit[];
  collegeSubject?: TAutoComplete | null;
  questions?: IQuestionBank[];
}
