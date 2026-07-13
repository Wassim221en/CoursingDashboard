import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ICollegeSubject } from 'apis/college-subject/college-subject.interfaces';
import { ICollege } from 'apis/college/college.interfaces';
import { IGrade } from 'apis/grade/grade.interfaces';
import { IGradeSubject } from 'apis/grade/grade.interfaces';
import { ISpecialized } from 'apis/specialized/specialized.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface INewsSubjectRef {
  id: number;
  name: string;
  fileUrl?: string;
}

export interface INews {
  id: number;
  gradeId: number | null;
  grade: {
    id: number;
    name: string;
  } | null;
  title: string;
  content: string;
  imageUrl: string | null;
  date: string;
  gradeSubjectId: number;
  gradeSubject: IGradeSubject;
  schoolSubjectId?: number | null;
  schoolSubject?: INewsSubjectRef | null;
  collegeDetailsSubjectId: number;
  collegeDetailsSubject: ICollegeSubject;
  collegeSubjectId?: number | null;
  collegeSubject?: INewsSubjectRef | null;
  specializedId: number;
  specialized: ISpecialized;
  collegeId: number;
  college: ICollege;
}

export interface INewsPayloadForm {
  id?: number;
  title: string;
  content: string;
  files: IFileUploaderFile[];
  date: Date;
  gradeSubjectId: TAutoComplete;
  schoolSubjectId?: TAutoComplete | null;
  GradeId?: TAutoComplete;
  collegeDetailsSubjectId: TAutoComplete;
  collegeSubjectId?: TAutoComplete | null;
  specializedId: number;
  collegeId: TAutoComplete;
}

export interface INewsPayload {
  id?: number;
  title: string;
  gradeId: number | null;
  content: string;
  date: string;
  gradeSubjectId: number | null;
  schoolSubjectId: number | null;
  GradeId?: number | null;
  collegeDetailsSubjectId: number | null;
  collegeSubjectId: number | null;
  specializedId: number | null;
  collegeId: number | null;
  Type: string | null;
}

export interface IGetNews {
  collegeId?: number | null;
  gradeSubjectId: number | null;
  collegeDetailsSubjectId: number | null;
  specializedId: number | null;
  text: string;
}
