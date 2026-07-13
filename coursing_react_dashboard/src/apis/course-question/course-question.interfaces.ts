import { IQuestion } from 'apis/exam/exam.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface IGetCourseQuestion {
  courseId?: number | null;
  pageSize?: number;
  pageNumber?: number;
}

export interface ICourseQuestion {
  id: number;
  courseId: number;
  question: IQuestion;
}

export interface ICourseQuestionPayload {
  id?: number;
  courseId: number;
  questionIds: number[];
  questions: IQuestion[];
}

export interface ICourseQuestionPayloadForm {
  id?: number;
  questions: IQuestion[];
  questionIds: TAutoComplete[];
}

export interface IEditCourseQuestionPayload {
  id?: number;
  questionIds: number[];
  courseQuestionId?: number;
  question: IQuestion;
}

export interface IEditCourseQuestionPayloadForm {
  id?: number;
  question: IQuestion;
}
