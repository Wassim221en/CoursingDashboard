import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ICollegeUnit } from 'apis/college-unit/college-unit.interfaces';
import { TCourseUnit } from 'apis/course/course.interfaces';
import {
  IGradesSubjectUnit,
  ISchoolUnit,
} from 'apis/school-unit/school-unit.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface IGoal {
  title: string;
}

export interface ILessonPayload {
  id?: number;
  courseId: number | null;
  collegeSubjectUnitId: number | null;
  schoolSubjectUnitId?: number | null;
  gradeSubjectUnitId?: number | null;
  title: string;
  description: string;
  videoDuration?: string;
  goals: IGoal[];
  points: number;
  free: boolean;
  order: number;
}

export interface ILessonPayloadForm {
  collegeSubjectUnitId: TAutoComplete;
  schoolSubjectUnitId: TAutoComplete;
  title: string;
  description: string;
  duration: string;
  files: IFileUploaderFile[];
  thumbnail: IFileUploaderFile[];
  points: number;
  free: boolean;
  order: number;

  _courseId?: number;
  _unit?: TCourseUnit;
}

export interface ILesson {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  videoSectionsCount: number;
  order: number;
}

export interface ILessonDetails {
  id: number;
  videoDuration: string;
  question: string;
  answer: string;
  courseId: number;
  collegeSubjectUnit: ICollegeUnit | null;
  schoolSubjectUnit: ISchoolUnit | null;
  gradeSubjectUnit: IGradesSubjectUnit | null;
  title: string;
  description: string;
  goals: IGoal[];
  duration: number;
  fileUrl: string;
  thumbnail: string;
  points: number;
  free: boolean;
  order: number;

  units?: unknown[];
}

export interface IGetLessonsPayload {
  courseId: number;
}
