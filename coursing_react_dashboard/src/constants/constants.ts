import { TAutoComplete } from 'hooks/use-generic-form/types';

/* eslint-disable import/prefer-default-export */

enum ActionType {
  EDIT,
  DELETE,
  DETAILS,
  ADD,
  CHANGE_PASSWORD,
}

enum AdsTypeEnum {
  All = 1,
  College = 2,
  Category = 3,
  Class = 4,
}

const AdsType: TAutoComplete[] = [
  { id: 1, name: 'all' },
  { id: 2, name: 'college' },
  { id: 3, name: 'category' },
  { id: 4, name: 'class' },
];

const Years: TAutoComplete[] = [
  { id: 1, name: 'auto-complete.first-year' },
  { id: 2, name: 'auto-complete.second-year' },
  { id: 3, name: 'auto-complete.third-year' },
  { id: 4, name: 'auto-complete.fourth-year' },
  { id: 5, name: 'auto-complete.fifth-year' },
];

const examType: TAutoComplete[] = [
  {
    id: 1,
    name: 'exams.quiz',
  },
  {
    id: 2,
    name: 'exams.exam',
  },
  {
    id: 3,
    name: 'exams.courseQuestionsExamType',
  },
  {
    id: 5,
    name: 'exams.liveExam',
  },
];
const QuestionLevel: TAutoComplete[] = [
  {
    id: 1,
    name: 'questionsBank.easy',
  },
  {
    id: 2,
    name: 'questionsBank.medium',
  },
  {
    id: 3,
    name: 'questionsBank.hard',
  },
  {
    id: 4,
    name: 'questionsBank.veryHard',
  },
  {
    id: 5,
    name: 'questionsBank.veryEasy',
  },
];

const QuestionType: TAutoComplete[] = [
  {
    id: 1,
    name: 'questionsBank.multiChocies',
  },
  // {
  //   id: 2,
  //   name: 'questionsBank.text',
  // },
  {
    id: 3,
    name: 'questionsBank.trueOrFalse',
  },
];

const studentType: TAutoComplete[] = [
  {
    id: 1,
    name: 'طالب مدرسي',
  },
  {
    id: 2,
    name: 'طالب جامعي',
  },
  {
    id: 3,
    name: 'طالب  اختصاص',
  },
];

const codeStatus: TAutoComplete[] = [
  {
    id: 1,
    name: 'salesPoints.valid',
  },
  {
    id: 2,
    name: 'salesPoints.inValid',
  },
  {
    id: 3,
    name: 'salesPoints.suspended',
  },
  {
    id: 4,
    name: 'salesPoints.bought',
  },
];

const accountStatus: TAutoComplete[] = [
  {
    id: 1,
    name: 'students.active',
  },

  {
    id: 2,
    name: 'students.suspended',
  },
];

const RequestPaperCopyStatus: TAutoComplete[] = [
  {
    id: 1,
    name: 'requestPaper.pending',
  },
  {
    id: 2,
    name: 'requestPaper.onTheRoad',
  },
  {
    id: 3,
    name: 'requestPaper.delivered',
  },
  {
    id: 4,
    name: 'requestPaper.rejected',
  },
];

const RequestPaperCopyType: TAutoComplete[] = [
  {
    id: 1,
    name: 'requestPaper.fast',
  },
  {
    id: 2,
    name: 'requestPaper.VeryFast',
  },
  {
    id: 3,
    name: 'requestPaper.Normal',
  },
  {
    id: 4,
    name: 'requestPaper.NotInAHurry',
  },
];

const StudentGender: TAutoComplete[] = [
  {
    id: 1,
    name: 'common.male',
  },
  {
    id: 2,
    name: 'common.female',
  },
];

const PrivacyAndTerms: TAutoComplete[] = [
  {
    id: 1,
    name: 'privacyAndTerms.termsAndConditions',
  },
  {
    id: 2,
    name: 'privacyAndTerms.privacyPolicy',
  },
  {
    id: 3,
    name: 'privacyAndTerms.cookiePolicy',
  },
];

const KnowingSource: TAutoComplete[] = [
  {
    id: 1,
    name: 'FaceBook',
  },
  {
    id: 2,
    name: 'Instagram',
  },
  {
    id: 3,
    name: 'LinkedIn',
  },
  {
    id: 4,
    name: 'Friend',
  },
  {
    id: 5,
    name: 'Twitter',
  },
  {
    id: 6,
    name: 'YouTube',
  },
  {
    id: 7,
    name: 'Book',
  },
  {
    id: 8,
    name: 'Whatsapp',
  },
  {
    id: 9,
    name: 'Telegram',
  },
  {
    id: 10,
    name: 'Google',
  },
  {
    id: 11,
    name: 'Tiktok',
  },
];

/* eslint-disable import/prefer-default-export */
export const CourseFilterType = {
  college: 'College',
  school: 'School',
  speciality: 'Speciality',
};

export enum ExamTypeEnum {
  quiz = 1,
  finalExam,
  pastExam,
  quizAndExam,
  liveExam,
}

export const newsStudentType = {
  collegeStudent: 'CollegeStudent',
  schoolStudent: 'SchoolStudent',
  specialityStudent: 'SpecialityStudent',
};

export const reportSectionType = {
  university: 'University',
  schooling: 'Schooling',
  specialty: 'Specialty',
};
export const typeInstructor = [
  { id: 0, name: 'University' },
  { id: 1, name: 'Schooling' },
  { id: 2, name: 'Specialty' },
];
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum reportTypes {
  general = 'General',
  courseLesson = 'CourseLesson',
  instructor = 'Instructor',
  exam = 'Exam',
  question = 'Question',
  course = 'Course',
  lesson = 'Lesson',
  examRate = 'ExamRate',
  questionRate = 'QuestionRate',
  examDifficulty = 'ExamDifficulty',
  questionDifficulty = 'QuestionDifficulty',
}

const ControllersNames = {
  Ads: 'Ads',
  Instructor: 'Instructor',
  RequestPaperCopy: 'RequestPaperCopy',
  Room: 'Room',
  Account: 'Account',
  Home: 'Home',
  Students: 'Student',
  UniversityCourses: 'UniversityCourses',
  UniversityExams: 'UniversityExams',
  UniversityLiveExams: 'UniversityLiveExams',
  UniversityNews: 'UniversityNews',
  GraduationProjects: 'GraduationProjects',
  UniversityQuestionBank: 'UniversityQuestionBank',
  UniversitySubject: 'UniversitySubject',
  College: 'College',
  Semester: 'Semester',
  University: 'University',
  SchoolingCourses: 'SchoolingCourses',
  SchoolingExams: 'SchoolingExams',
  SchoolingLiveExams: 'SchoolingLiveExams',
  SchoolingNews: 'SchoolingNews',
  SchoolingQuestionBank: 'SchoolingQuestionBank',
  EducationalLevel: 'EducationalLevel',
  Grade: 'Grade',
  SchoolingSubject: 'SchoolingSubject',
  Specialized: 'Specialized',
  SpecialtyCourses: 'SpecialtyCourses',
  SpecialtyExams: 'SpecialtyExams',
  SpecialtyNews: 'SpecialtyNews',
  SpecialtyQuestionBank: 'SpecialtyQuestionBank',
  City: 'City',
  Country: 'Country',
  FAQ: 'FAQ',
  SalesPoint: 'SalesPoint',
  UniversityReport: 'UniversityReport',
  UniversityExamReport: 'UniversityExamReport',
  UniversityQuestionReport: 'UniversityQuestionReport',
  SchoolingReport: 'SchoolingReport',
  SchoolingExamReport: 'SchoolingExamReport',
  SchoolingQuestionReport: 'SchoolingQuestionReport',
  SpecialtyReport: 'SpecialtyReport',
  SpecialtyExamReport: 'SpecialtyExamReport',
  SpecialtyQuestionReport: 'SpecialtyQuestionReport',
  Privacy: 'Privacy',
  ContactInfo: 'ContactInfo',
  AppRating: 'AppRating',
  CoursingInfo: 'AppRating',
};

const FramerAnimationStart = {
  y: -100,
  opacity: 0,
};

const FramerAnimationEnd = {
  y: 0,
  opacity: 1,
};

export {
  ActionType,
  Years,
  examType,
  QuestionLevel,
  QuestionType,
  studentType,
  codeStatus,
  AdsType,
  AdsTypeEnum,
  RequestPaperCopyStatus,
  RequestPaperCopyType,
  StudentGender,
  accountStatus,
  ControllersNames,
  PrivacyAndTerms,
  KnowingSource,
  FramerAnimationStart,
  FramerAnimationEnd,
};

export enum StudentState {
  Subscribed = 0, // مشترك
  NotSubscribed, // غير مشترك
  Offer, // عرض
  Free, // مجاني
  Discount, // حسم
  Card, // بطاقة
}
export const StudentStateOptions = [
  { id: 0, name: 'مشترك' },
  { id: 1, name: 'غير مشترك' },
  { id: 2, name: 'عرض' },
  { id: 3, name: 'مجاني' },
  { id: 4, name: 'حسم' },
  { id: 5, name: 'بطاقة' },
];
