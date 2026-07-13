import { IQuestionBank } from 'apis/qusetions/questions.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface ICollegeUnit {
  id: number;
  title: string;
  description: string | null;
  parentId: number | null;
  children: ICollegeUnit[];
  collegeSubject?: TAutoComplete | null;
  questions?: IQuestionBank[];
}

export type ICollegeUnitPayload = {
  id?: number;
  title: string;
  description: string;
  parentId?: number | null;
  collegeDetailsSubjectId?: number | null;
};

export interface ICollegeUnitPayloadForm {
  id?: number;
  title: string;
  description: string;
  parentId?: number | null;
  collegeSubjectId?: TAutoComplete | null;
}

export interface IGetCollegeUnitsPayload {
  collegeDetailsSubjectId?: number | null;
}
