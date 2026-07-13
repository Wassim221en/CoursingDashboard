import { IFileUploaderFile } from '@craft-code/file-uploader';
import { ICourse } from 'apis/course/course.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';

export interface IInstructor {
  id: number;
  fullName: string;
  userName: string;
  aboutInstructor: string;
  rating: number;
  certificates: IInstructorCertificate[];
  instructorCourses: ICourse[];
  birthDate: string;
  Type: number;
  CollegeDetailsSubjectIds: number[];
  GradeSubjectIds: number[];
  password: string;
}
export interface IInstructorDetails {
  id: number;
  fullName: string;
  userName: string;
  aboutInstructor: string;
  rating: number;
  certificates: IInstructorCertificate[];
  instructorCourses: ICourse[];
  birthDate: string;
  Type: number;
  CollegeDetailsSubjectIds: number[];
  GradeSubjectIds: number[];
  password: string;
  collegeDetailsSubjects: ICollegeDetailsSubjects[];
  gradeSubjects: IGradeSubjects[];
}
export interface ICollegeDetailsSubjects {
  id: number;
  collegeDetailsSubjectId: number;
  subjectId: number;
  name: string;
  collegeId: number;
  collegeName: string;
}
export interface IGradeSubjects {
  id: number;
  grade: Grade;
  subject: Subject;
  allExamsPrice: number;
}

export interface Grade {
  id: number;
  name: string;
}

export interface Subject {
  id: number;
  gradeSubjectId: number;
  collegeDetailsSubjectId: number;
  name: string;
  allExamsPrice: number;
  fileCount: number;
  courseCount: number;
  examCount: number;
}

export interface IInstructorPayload {
  id: number;
  userName: string;
  fullName: string;
  aboutInstructor: string;
  password: string;
  birthDate: string;
  Type: number;
  CollegeDetailsSubjectIds: number[];
  GradeSubjectIds: number[];
}
export interface IActionInstructorPayload {
  id: number;
  userName: string;
  fullName: string;
  aboutInstructor: string;
  password: string;
  birthDate: string;
  Type: TAutoComplete;
  university: TAutoComplete | null;
  colleges: TAutoComplete | null;
  subjects: TAutoComplete;
  grade: TAutoComplete | null;
  gradeSubjects: TAutoComplete[];
  CollegeDetailsSubjectIds: TAutoComplete[];
  GradeSubjectIds: TAutoComplete[];
}
export interface IInstructorCertificatePayloadForm {
  id?: number | null;
  name: string;
  date: Date;
  files: IFileUploaderFile;
  source: string;
  instructorId: number;
}

export interface IInstructorCertificatePayload {
  id?: number | null;
  name: string;
  date: string;
  source: string;
  instructorId: number;
}

export interface IInstructorCertificate {
  id?: number;
  name: string;
  date: string;
  fileUrl: string;
  source: string;
  instructorId: number;
}
export interface IInstructorEdit {
  id: number;
  fullName: string;
  userName: string;
  aboutInstructor: string;
  studentsAttended: number;
  coursesCount: number;
  rating: number;
  collegeDetailsSubjects: ICollegeDetailsSubjects[];
  gradeSubjects: GradeSubject[];
  birthDate: string;
  type: number;
  university: IUniversity;
  certificates: IInstructorCertificate[];
  imageUrl: string;
}
interface IUniversity {
  name: string;
  id: number;
}

export interface GradeSubject {
  id: number;
  grade: IGrade;
  subject: ISubject;
  description: string;
  allExamsPrice: number;
  fileUrl: string;
}

export interface IGrade {
  id: number;
  name: string;
  imageUrl: null;
}

export interface ISubject {
  id: number;
  gradeSubjectId: number;
  collegeDetailsSubjectId: number;
  name: string;
  fileUrl: null;
  allExamsPrice: number;
  year: null;
  courses: null;
  units: any[];
  college: null;
  grade: null;
  fileCount: number;
  courseCount: number;
  examCount: number;
  color: null;
}
