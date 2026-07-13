import { ControllersNames } from 'constants/constants';
import routesNames from 'routes/constants';

function getRoutePermission() {
  const route = window.location.pathname;
  let permissionName;

  if (
    route.includes(routesNames.universityCourses) ||
    route.includes(routesNames.universityCourseDetails)
  )
    permissionName = ControllersNames.UniversityCourses;

  if (route.includes(routesNames.collegeSubjectsDetails))
    permissionName = ControllersNames.UniversitySubject;

  if (route.includes(routesNames.schoolSubjectsDetails))
    permissionName = ControllersNames.SchoolingSubject;

  if (
    route.includes(routesNames.schoolCourses) ||
    route.includes(routesNames.schoolCourseDetails)
  )
    permissionName = ControllersNames.SchoolingCourses;
  if (
    route.includes(routesNames.specializedCourses) ||
    route.includes(routesNames.specializeCourseDetails)
  )
    permissionName = ControllersNames.SpecialtyCourses;

  if (route.includes(routesNames.universityQuestionsBank))
    permissionName = ControllersNames.UniversityQuestionBank;
  if (route.includes(routesNames.schoolQuestionsBank))
    permissionName = ControllersNames.SchoolingQuestionBank;
  if (route.includes(routesNames.specializeQuestionsBank))
    permissionName = ControllersNames.SpecialtyQuestionBank;

  if (route === routesNames.universityNews)
    permissionName = ControllersNames.UniversityNews;
  if (route === routesNames.schoolNews)
    permissionName = ControllersNames.SchoolingNews;
  if (route === routesNames.specializeNews)
    permissionName = ControllersNames.SpecialtyNews;

  if (route.includes(routesNames.universityExamQuestions))
    permissionName = ControllersNames.UniversityExams;

  if (route.includes(routesNames.schoolExamQuestions))
    permissionName = ControllersNames.SchoolingExams;

  if (route.includes(routesNames.specializeExamQuestions))
    permissionName = ControllersNames.SpecialtyExams;

  if (route.includes(routesNames.universityReports))
    permissionName = ControllersNames.UniversityReport;

  if (route.includes(routesNames.universityExamsReports))
    permissionName = ControllersNames.UniversityExamReport;

  if (route.includes(routesNames.universityQuestionsBankReports))
    permissionName = ControllersNames.UniversityQuestionReport;

  if (route.includes(routesNames.schoolReports))
    permissionName = ControllersNames.SchoolingReport;

  if (route.includes(routesNames.schoolExamsReports))
    permissionName = ControllersNames.SchoolingExamReport;

  if (route.includes(routesNames.schoolQuestionsBankReports))
    permissionName = ControllersNames.SchoolingQuestionReport;

  if (route.includes(routesNames.specializedReports))
    permissionName = ControllersNames.SpecialtyReport;

  if (route.includes(routesNames.specializedExamsReports))
    permissionName = ControllersNames.SpecialtyExamReport;

  if (route.includes(routesNames.specializeQuestionsBankReports))
    permissionName = ControllersNames.SpecialtyQuestionReport;

  // if (route.includes(routesNames.instructorsReports))
  // permissionName = ControllersNames.;

  return permissionName;
}

export default getRoutePermission;
