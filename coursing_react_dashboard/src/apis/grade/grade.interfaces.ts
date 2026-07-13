import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ICollegeSubject } from 'apis/college-subject/college-subject.interfaces';
import { ISchoolSubject } from 'apis/school-subject/school-subject.interfaces';
import { ISchoolUnit } from 'apis/school-unit/school-unit.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface IGradePayload {
  id?: number;
  name: string;
  // schoolSubjectsIds: number[];
}

export interface IGradePayloadForm {
  id?: number;
  name: string;
  schoolSubjectsIds: TAutoComplete[];
  files: IFileUploaderFile[];
}

export interface IGrade {
  id: number;
  name: string;
  subjects: ICollegeSubject[];
  imageUrl: string;
}

export interface IGradeSubject {
  id: number;
  grade: TAutoComplete;
  subject: ISchoolSubject;
  description: string;
  fileUrl: string;
  allExamsPrice: number;
}

export interface IGradeSubjectDetails {
  id: number;
  grade: TAutoComplete;
  subject: ISchoolSubject;
  description: string;
  filesUrls: string[];
  units: ISchoolUnit[];
  allExamsPrice: number;
}

export interface IGradeSubjectPayload {
  id: number;
  gradeId: number;
  description: string;
  schoolSubjectId: number;
  // units: number[];
  AllExamsPrice: number;
}

export interface IGradeSubjectPayloadForm {
  id: number;
  description: string;
  schoolSubjectId: TAutoComplete;
  units: TAutoComplete[];
  files: IFileUploaderFile[];
  AllExamsPrice: number;
}

export interface IGetAllGradesPayload {
  gradeId?: number;
  pageSize?: number;
  pageNumber?: number;
}
