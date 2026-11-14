import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ICollegeSubject } from 'apis/college-subject/college-subject.interfaces';
import { ISchoolSubject } from 'apis/school-subject/school-subject.interfaces';
import { ISchoolUnit } from 'apis/school-unit/school-unit.interfaces';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface IGradePayload {
  id?: number;
  name: string;
  /** Educational level the grade belongs to. Omitted => keeps current / none. */
  educationLevelId?: number;
  /** Requested position (>= 1) inside the level. Omitted => placed at the end. */
  order?: number;
}

export interface IGradePayloadForm {
  id?: number;
  name: string;
  educationLevel: TAutoComplete | null;
  /** Empty string means "not specified" (backend puts the grade last). */
  order: number | '';
  schoolSubjectsIds: TAutoComplete[];
  files: IFileUploaderFile[];
}

export interface IGrade {
  id: number;
  name: string;
  subjects: ICollegeSubject[];
  imageUrl: string;
  /** 1-based position relative to its educational level (null outside GetAllGrades). */
  order?: number | null;
  educationLevelId?: number | null;
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

export interface IGetGradesParams extends IPaginationParams {
  /** Returns only the grades of this level. Omit (or 0) to fetch all. */
  educationLevelId?: number;
}

export interface IGetAllGradesPayload {
  gradeId?: number;
  pageSize?: number;
  pageNumber?: number;
}
