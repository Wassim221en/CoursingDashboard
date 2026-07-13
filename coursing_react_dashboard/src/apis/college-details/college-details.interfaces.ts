import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ICollegeSubjectDetails } from 'apis/college-subject/college-subject.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface ICollegeDetails {
  id: number;
  collegeName: string;
  semester: TAutoComplete;
  subjects: ICollegeSubjectDetails[];
  year: number;
  collegeSection: TAutoComplete;
}

export interface ICollegeDetailsPayloadForm {
  id?: number;
  collegeId: TAutoComplete;
  year: TAutoComplete;
  semesterId: TAutoComplete;
  // collegeSubjectIds: TAutoComplete[];
}

export interface ICollegeDetailsPayload {
  id?: number;
  collegeId: number | null;
  year: number | null;
  semesterId: number | null;
  collegeSubjectIds: number[];
}

export interface ICollegeDetailsSubjectPayloadForm {
  CollegeSubjectId: TAutoComplete;
  Description: string;
  AllExamsPrice: number;
  files: IFileUploaderFile[];
}

export interface ICollegeDetailsSubjectPayload {
  id?: number;
  CollegeSubjectId?: number;
  Description: string | null;
  CollegeDetailsId: number;
}

export interface IGetCollegeDetailsPayload {
  collegeId?: number | null;
}

export interface IRemoveCollegeDetailsSubjectPayload {
  collegeDetailsId: number;
  collegeSubjectId: number;
}
