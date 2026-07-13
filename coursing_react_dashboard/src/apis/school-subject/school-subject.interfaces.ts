import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ISchoolUnit } from 'apis/school-unit/school-unit.interfaces';

export interface ISchoolSubject {
  id: number;
  name: string;
  gradeSubjectId: number;
  fileUrl: string;
  units: ISchoolUnit[];
}

export interface IGradeSubject {
  id: number;
  name: string;
  fileUrl: string;
}

export interface ISchoolSubjectPayload {
  id?: number;
  name: string;
  files: IFileUploaderFile[];
}

export interface ISchoolSubjectDetails {
  id: number;
  name: string;
  filesUrls: string[];
}

export interface IGetSchoolSubjectPayload {
  gradeId?: number;
}
