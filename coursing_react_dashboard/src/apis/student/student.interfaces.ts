import { ICity } from 'apis/city/city.interfaces';
import { ICollege } from 'apis/college/college.interfaces';
import { ICourse } from 'apis/course/course.interfaces';
import { IExam } from 'apis/exam/exam.interfaces';
import { IGrade } from 'apis/grade/grade.interfaces';
import { IPointsCodes } from 'apis/sales-point/sales-point.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface IStudent {
  grade: { name: string };
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  gender: number;
  joinDate: string;
  accountStatus: number;
  studentState: number;
  balance: number;
  studentType: number;
  courseCount: number;
  completionRate?: number;
}

export interface IStudentDetails {
  id?: number;
  code: string;
  studentType: number;
  gender: number;
  phoneNumber: string;
  city: ICity;
  college: ICollege;
  grade: IGrade;
  educationalLevel: number;
  exams: IExam[];
  fullName: string;
  firstName: string;
  lastName: string;
  courses: ICourse[];
  birthDate: string;
  email: string;
  accountStatus: number;
  imageUrl: string;
}

export interface IGetStudentPayload {
  text?: string;
  universityId?: number | null;
  collegeId?: number | null;
  gradeId?: number | null;
  studentType?: number | null;
  cityId?: number | null;
  gender?: number | null;
}

export interface IAddPointsToStudentPayload {
  studentId: number;
  salePointCode: string;
}

export interface IUpdateStudentBalancePayload {
  studentId: number;
  points: number;
}

export interface IGeneratePointsFromBaseSalesPoint {
  numberOfPoints: number;
}

export interface IStudentBalance {
  balance: number;
  codes: IPointsCodes[];
}

export interface INewRegistrationStudents {
  studentName: string;
  firstName: string;
  lastName: string;
  studentType: number;
  city: ICity;
  dateOfRegistration: string;
}
export interface IChangeStudentAccountStatusPayload {
  studentId?: number;
  accountStatus: number;
}
export interface IChangeStudentAccountStatusPayloadForm {
  studentId: number;
  accountStatus: TAutoComplete;
}
export interface IChangeStudentStatePayload {
  studentId?: number;
  studentState: number;
}
