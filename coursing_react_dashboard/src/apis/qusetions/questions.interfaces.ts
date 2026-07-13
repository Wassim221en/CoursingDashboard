import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ICollegeSubject } from 'apis/college-subject/college-subject.interfaces';
import { ICollegeUnit } from 'apis/college-unit/college-unit.interfaces';
import { IChoose } from 'apis/exam/exam.interfaces';
import { IGrade } from 'apis/grade/grade.interfaces';
import { IGradesSubjectUnit } from 'apis/school-unit/school-unit.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

interface IGradeSubject {
  id: number;
  name: string;
  fileUrl: string;
  description: string;
  grade: IGrade;
}
export interface IQuestionBank {
  questionId?: number;
  examQuestionId?: number;
  pastExamQuestionId?: number;
  title: string;
  body: string;
  imageUrl?: string;
  trueFalseAnswer: boolean;
  questionType: number;
  questionLevel: number;
  collegeDetailsSubjectId: TAutoComplete;
  gradeSubjectId: TAutoComplete;
  gradeSubject?: IGradeSubject;
  specialityId: TAutoComplete;
  collegeDetailsSubjectUnitId: ICollegeUnit[];
  examQuestionMark: number;
  note?: string;
  image?: string;
  choices: IChoose[];
  collegeDetailsSubject?: ICollegeSubject;
  gradeSubjectUnitId?: IGradesSubjectUnit[];
  specialized?: TAutoComplete;
  questionTags: TAutoComplete[];
  // mark: number;
  // schoolSubjectId: TAutoComplete;
}

export interface IQuestionBankPayloadForm {
  id?: number;
  title: string;
  body: string;
  mark: number;
  trueFalseAnswer: number;
  questionType: TAutoComplete;
  questionLevel: TAutoComplete;
  schoolSubjectId: TAutoComplete;
  gradeSubjectId: TAutoComplete;
  examQuestionMark: number;
  gradeId: TAutoComplete;
  specialityId: TAutoComplete;
  collegeSubjectUnitIds: TAutoComplete[];
  gradeSubjectUnitIds: TAutoComplete[];
  note?: string;
  image?: string;
  choices: IChoose[];
  files: IFileUploaderFile[];
  collegeId: TAutoComplete;
  collegeDetailsSubjectId: TAutoComplete;
  tags: TAutoComplete[];
}

export interface IExamQuestionPayloadForm {
  id?: number;
  examId: number;
  question: IQuestionBankPayloadForm[];
}

export interface IQuestionBankPayload {
  id?: number;
  title: string;
  body: string;
  examQuestionMark?: number;
  trueFalseAnswer?: boolean | null;
  questionType?: number;
  questionLevel?: number | null;
  collegeDetailsSubjectId?: number | null;
  collegeId?: number | null;
  gradeSubjectId?: number | null;
  specialityId?: number | null;
  collegeDetailsSubjectUnitIds: number[] | null;
  gradeSubjectUnitIds: number[] | null;
  choices?: IChoose[] | null;
  note?: string;
  gradeId?: number | null;
  tags: TAutoComplete[] | null;
}

export interface IExamQuestionPayload {
  collegeDetailsSubjectId?: number | null;
  type: number | null;
  schoolSubjectId?: number | null;
  gradeSubjectId?: number | null;
  specialityId?: number | null;
  collegeSubjectUnitId?: number | null;
  collegeDetailsSubjectUnitId?: number | null;
  schoolSubjectUnitId?: number | null;
  text?: string;
}

export interface IUploadExcelPayload {
  collegeDetailsSubjectId?: number | null;
  gradeSubjectId?: number | null;
  collegeId: number | null;
  specializedId: number | null;
  file?: FormData;
  examId?: number | null;
}

export enum QuestionTypeEnum {
  MultiChoice = 1,
  Text,
  TrueAndFalse,
}
