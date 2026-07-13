export interface IWebContents {
  id: number;
  enName: string;
  arName: string;
  canAction: boolean;
  canDelete: boolean;
  canView: boolean;
}

interface IBaseAndSettingPermission {
  base: IWebContents[];
  setting: IWebContents[];
}

export interface IPermission {
  base: IWebContents[];
  university: IBaseAndSettingPermission;
  schooling: IBaseAndSettingPermission;
  specialty: IBaseAndSettingPermission;
  setting: IWebContents[];
}
export interface IWebContentsForDashboardRole {
  roleId: number;
  roleName: string;
  permissions: IPermission;
}
export interface IWebContentsForRole {
  roleName: string;
  webContentsForDashboardRole: IWebContentsForDashboardRole;
}

export interface IPermissionspayload {
  roleId: number;
  permissions: IPermission;
}
export type IWebContentEnName =
  | 'Ads'
  | 'Instructor'
  | 'RequestPaperCopy'
  | 'Room'
  | 'Account'
  | 'Home'
  | 'Student'
  | 'UniversityCourses'
  | 'UniversityExams'
  | 'UniversityLiveExams'
  | 'UniversityNews'
  | 'GraduationProjects'
  | 'UniversityQuestionBank'
  | 'College'
  | 'Semester'
  | 'University'
  | 'SchoolingCourses'
  | 'SchoolingExams'
  | 'SchoolingLiveExams'
  | 'SchoolingNews'
  | 'SchoolingQuestionBank'
  | 'EducationalLevel'
  | 'Grade'
  | 'SchoolingSubject'
  | 'Specialized'
  | 'SpecialtyCourses'
  | 'SpecialtyExams'
  | 'SpecialtyNews'
  | 'SpecialtyQuestionBank'
  | 'City'
  | 'Country'
  | 'FAQ'
  | 'SalesPoint'
  | 'UniversitySubject'
  | 'UniversityReport'
  | 'UniversityExamReport'
  | 'UniversityQuestionReport'
  | 'SchoolingReport'
  | 'SchoolingExamReport'
  | 'SchoolingQuestionReport'
  | 'SpecialtyReport'
  | 'SpecialtyExamReport'
  | 'SpecialtyQuestionReport'
  | 'Privacy'
  | 'ContactInfo'
  | 'AppRating'
  | 'forceAllow'
  | '';
