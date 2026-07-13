import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ICollegeSubject } from 'apis/college-subject/college-subject.interfaces';
import { ICollegeUnit } from 'apis/college-unit/college-unit.interfaces';
import { ICollege } from 'apis/college/college.interfaces';
import { IResponse } from 'apis/global-interfaces/global-interfaces';
import { IGrade } from 'apis/grade/grade.interfaces';
import { IInstructor } from 'apis/instructor/instructor.interfaces';
import { IUser } from 'apis/request-paper/request-paper.interfaces';
import { ISchoolSubject } from 'apis/school-subject/school-subject.interfaces';
import { ISchoolUnit } from 'apis/school-unit/school-unit.interfaces';
import { ISpecialized } from 'apis/specialized/specialized.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface ICourseSubject {
  id: number;
  name: string;
  year: number;
  college: ICollege;
  grade: IGrade;
}

export interface IActionQa {
  id?: number;
  lessonId?: number;
  courseId: number;
  question: string;
}

export interface ICourse {
  isActive: boolean;
  id: number;
  title: string;
  coverUrl: string;
  rating: number;
  completionRate: number;
  enrollDate: string;
  instructors: IInstructor[];
  subject: ICourseSubject;
  isPublished?: boolean;
  unReadQuestionCount?: number;
  unReadReportCount?: number;
}

export interface ICoursePayloadForm {
  expirationInDays: number;
  id?: number;
  title: string;
  aboutCourse: string;
  specializedId: number;
  collegeDetailsSubjectId: TAutoComplete;
  gradeId: TAutoComplete;
  gradeSubjectId: TAutoComplete;
  instructorsIds: TAutoComplete[];
  files: IFileUploaderFile;
  points: number;
  collegeId: TAutoComplete;
  // expirationInWeeks: number;
  hours: number;
  minute: number;
}

export interface ICoursePayload {
  expirationInDays: number;
  id?: number;
  title: string;
  aboutCourse: string;
  specializedId: number | null;
  collegeDetailsSubjectId: number | null;
  gradeId: number | null;
  gradeSubjectId: number | null;
  instructorsIds: number[];
  points: number;
  collegeId?: number | null;
}

export interface ICourseDetails {
  id: number;
  title: string;
  aboutCourse: string;
  examCount: number;
  rating: number;
  instructors: IInstructor[];
  grade: TAutoComplete;
  speciality: ISpecialized;
  coverUrl: string;
  collegeDetailsSubject: ICollegeSubject;
  gradeSubject: ISchoolSubject;
  points: number;
  hours: number;
  minute: number;
  // expirationInWeeks: number;
  expirationInDays: number;
}

export interface IGetCoursesPayload {
  text?: string;
  collegeDetailsSubjectId?: number | null;
  universityId?: number | null;
  collegeId?: number | null;
  gradeSubjectId?: number | null;
  gradeId?: number | null;
  specializedId?: number | null;
  courseFilter?: string | null;
  instructor?: number | null;
}
export interface IGetCourseStudentPayload {
  courseId: number;
  From: string | null;
  to: string | null;
}

export interface ICourseStudents {
  studentName: string;
  enrolledDate: string;
  expireDate: string;
  completionRate: number;
  examAvg: number;
}

export interface IMostPopularCourse {
  id: number;
  title: string;
  coverUrl?: string;
  rating: number;
  countOfOrders: number;
}

interface ICourseQuestionAnswer {
  id: number;
  answer: string;
  user: IUser;
}
export interface ICourseQuestion {
  id: number;
  byOwner: boolean;
  question: string;
  isHidden: boolean;
  order: number;
  lesson: {
    id: number;

    title: string;
    lessonId: number;
  };
  user: IUser;
  answers: ICourseQuestionAnswer[];
  lessonId?: number | null;
  isReadFromDashboard?: boolean;
}

export interface IGetCourseQuestionPayload {
  lessonId?: number | null;
  courseId?: number;
  fromDashboard: boolean;
}

export interface ICourseQuestionPayload {
  questionId: number;
  answer: string;
  id?: number;
}

export interface IGetStudentsOrderInCoursePayload {
  courseId: number;
}

export interface IRatingsDetails {
  studentId: number;
  studentName: string;
  rating: number;
  rateDescription: string;
}

export interface ICourseRating {
  courseId: number;
  ratingAverage: number;
  ratingCount: number;
  studentCourseCount: number;
  ratingsDetails: IResponse<IRatingsDetails[]>;
}
export interface ICourseRatingPayload {
  courseId: number;
}

export interface IInstructorRatingDetails {
  studentId: number;
  studentName: string;
  instructorId: number;
  instructorName: string;
  rating: number;
  rateDescription: string;
}

export interface IInstructorCourseRating {
  courseId: number;
  ratingAverage: number;
  ratingCount: number;
  studentCourseCount: number;
  ratingsDetails: IResponse<IInstructorRatingDetails[]>;
}

export type TCourseUnit =
  | {
      id: number;
      type: 'school';
      title: string;
      description?: string;
      children?: TCourseUnit[];
      originalWithoutChildren: Omit<ISchoolUnit, 'children'>;
    }
  | {
      id: number;
      type: 'collage';
      title: string;
      description?: string;
      children?: TCourseUnit[];
      originalWithoutChildren: Omit<ICollegeUnit, 'children'>;
    };
