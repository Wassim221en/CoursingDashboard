import { IQuestionBank } from 'apis/qusetions/questions.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface ISchoolUnit {
  id: number;
  title: string;
  description: string | null;
  parentId: number | null;
  children: ISchoolUnit[];
  schoolSubject?: TAutoComplete | null;
  grade?: TAutoComplete | null;
  questions?: IQuestionBank[];
}

export interface IGradesSubjectUnit {
  id: number;
  title: string;
  description: string | null;
  parentId: number | null;
  children: ISchoolUnit[];
  gradeSubject?: TAutoComplete | null;
  grade?: TAutoComplete | null;
  questions?: IQuestionBank[];
}

export interface IGradesSubjectUnitPayload {
  gradeSubjectId: number | null;
  pageSize?: number;
  pageNumber?: number;
}

export type ISchoolUnitPayload = {
  id?: number;
  title: string;
  description: string;
  parentId?: number | null;
  gradeSubjectId?: number | null;
  gradeId?: number | null;
};

export interface ISchoolUnitPayloadForm {
  id?: number;
  title: string;
  description: string;
  parentId?: number | null;
  gradeSubjectId?: TAutoComplete | null;
  gradeId?: TAutoComplete | null;
}

export interface IGetSchoolUnitsPayload {
  schoolSubjectId?: number | null;
  gradeId?: number | null;
}
