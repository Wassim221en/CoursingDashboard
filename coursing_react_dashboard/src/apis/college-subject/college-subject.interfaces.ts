import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ICollegeUnit } from 'apis/college-unit/college-unit.interfaces';
import { ICollege } from 'apis/college/college.interfaces';

export interface TUnit {
  id: number;
  title: string;
}

export interface ICollegeSubject {
  id: number;
  collegeDetailsSubjectId: number;
  name: string;
  fileUrl: string;
  units?: TUnit[];
  description: string;
  college: ICollege;
}

export interface ICollegeSubjectPayloadForm {
  id: number;
  name: string;
  files: IFileUploaderFile[];
}

export interface ICollegeSubjectPayload {
  id?: number;
  name: string;
}

export interface ICollegeSubjectDetails {
  id: number;
  allExamsPrice: number;
  name: string;
  filesUrls: string[];
  units?: TUnit[];
  description?: string;
}

export interface ICollegeSubjectDetailsUnit {
  id: number;
  name: string;
  units?: ICollegeUnit[];
}

export interface IGetCollegeSubjectPayload {
  collegeId?: number;
  semisterId?: number;
  year?: 1 | 2 | 3 | 4 | 5;
  pageSize?: number;
  pageNumber?: number;
}
