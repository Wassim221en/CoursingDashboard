import { ICourse } from 'apis/course/course.interfaces';
import { ILesson } from 'apis/lesson/lesson.interfaces';
import { ISpecialized } from 'apis/specialized/specialized.interfaces';
import { IStudent } from 'apis/student/student.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import {
  IQuestionBank,
  IQuestionBankPayload,
} from 'apis/qusetions/questions.interfaces';
import { ICollegeSubject } from 'apis/college-subject/college-subject.interfaces';
import { IGradeSubject } from 'apis/school-subject/school-subject.interfaces';
import { ICollegeUnit } from 'apis/college-unit/college-unit.interfaces';
import { IGradesSubjectUnit } from 'apis/school-unit/school-unit.interfaces';
import { ICollegeDetails } from 'apis/college-details/college-details.interfaces';
import { IGrade } from 'apis/grade/grade.interfaces';
import { IFileUploaderFile } from '@craft-code/file-uploader';
import { IPaginationParams } from 'apis/global-interfaces/global-interfaces';

export interface IExamUserPayload extends IPaginationParams {
  text?: string;
  date?: string;
  userId: number;
  presented?: boolean;
}
export interface IExam {
  id?: number;
  title?: string;
  examTime: string;
  myMark: number;
  rightQuestionCount: number;
  course?: ICourse | null;
  lesson?: ILesson | null;
  courseId?: number | null;
  lessonId?: number | null;
  collegeDetailsSubjectId: number;
  specialized: ISpecialized | null;
  maxMark: number;
  minMark: number;
  examType: number;
  questions: IQuestionBank[];
  students: IStudent[];
  specializedId: number;
  collegeSubject: ICollegeSubject | null;
  collegeSubjectUnit: ICollegeUnit[] | null;
  gradeSubject: IGradeSubject;
  gradeSubjectUnit: IGradesSubjectUnit[];
  points: number;
  collegeDetails: ICollegeDetails;
  grade: IGrade;
  examLiveDate?: string;
  filesUrl: string[];
  order: number;
}

export interface IExamPayloadForm {
  id?: number;
  title: string;
  examTime: string;
  courseId: TAutoComplete;
  lessonId: TAutoComplete;
  collegeDetailsSubjectId: TAutoComplete;
  collegeSubjectUnitIds: TAutoComplete[];
  gradesId?: number | null;
  gradeSubjectId: TAutoComplete;
  gradeSubjectUnitIds: TAutoComplete[];
  specializedId: number;
  maxMark: number;
  minMark: number;
  examType: TAutoComplete;
  pastQuestions: number[];
  questions: IQuestion[];
  points: number;
  examLiveDate?: Date;
  collegeId: TAutoComplete;
  files: IFileUploaderFile[];
}

export interface IExamPayload {
  id?: number;
  courseId?: number | null;
  lessonId?: number | null;
  collegeDetailsSubjectId: number | null;
  collegeSubjectUnitIds: number[] | null;
  gradesId?: number | null;
  gradeSubjectId: number | null;
  gradeSubjectUnitIds: number[] | null;
  specializedId: number | null;
  maxMark?: number;
  minMark?: number;
  examType?: number;
  examTime?: string;
  pastQuestions: number[];
  questions: IQuestion[];
  points: number;
  examLiveDate?: Date | string | null;
}

export interface IExamQuestionPayloadForm {
  questions: TAutoComplete[];
  newQuestions: IQuestion[];
}

export interface IEditExamQuestionPayloadForm {
  question: TAutoComplete;
}

export interface IExamQuestionPayload {
  id?: number;
  examId?: number;
  pastQuestions: {
    questionId?: number;
    mark: number;
  }[];
  questionId?: number;
  questions?: IQuestionBankPayload[];
  image?: string;
}

export interface IQuestionPayload {
  id?: number;
  title: string;
  mark: number;
  examId: number;
  answerText: string;
  chooseType: number;
  chooses: IChoose[];
}

export interface IChoose {
  title: string;
  theTrueAnswer: boolean;
}

export interface IQuestionPayloadForm {
  id?: number;
  title: string;
  mark: number;
  examId: number;
  answerText: string;
  chooseType: TAutoComplete;
  chooses: IChoose[];
}

export interface IGetExamQuestionPayload {
  examId?: number;
  pastId?: number;
}

export interface IQuestion {
  id?: number;
  title: string;
  mark: number;
  examId?: number;
  answerText: string;
  chooseType: TAutoComplete;
  chooses: IChoose[];
  choices: IChoose[];
}

export interface IGetUniversityExamPayload {
  text?: string;
  courseId?: number | null;
  lessonId?: number | null;
  CollegeDetailsSubjectId?: number | null;
  collegeSubjectUnitId?: number | null;
  examType?: number | null;
}

export interface IGetSchoolExamPayload {
  text?: string;
  courseId?: number;
  lessonId?: number;
  gradeSubjectUnitId?: number;
  gradeSubjectId?: number;
  examType?: number;
  // schoolSubjectId?: number;
}

export interface IGetSpecializedExamPayload {
  text?: string;
  courseId?: number | null;
  lessonId?: number | null;
  specializationId?: number | null;
  examType?: number | null;
}
