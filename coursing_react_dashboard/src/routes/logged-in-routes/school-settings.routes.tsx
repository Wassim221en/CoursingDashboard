import { lazy } from 'react';
import routesNames from 'routes/constants';
import TRoute from 'routes/types';

const GradePage = lazy(() => import('pages/grade/grade.page'));
const ExamQuestionPage = lazy(
  () => import('pages/exam-question/exam-question.page'),
);
const GradeDetailsPage = lazy(
  () => import('pages/grade-details/grade-details.page'),
);
const EducationalLevelPage = lazy(
  () => import('pages/educational-level/educational-level.page'),
);
const SchoolUnitPage = lazy(() => import('pages/school-unit/school-unit.page'));
const SchoolSubjectPage = lazy(
  () => import('pages/school-subject/school-subject.page'),
);
const CoursesPage = lazy(() => import('pages/courses/courses.page'));
const CoursesActionPage = lazy(
  () => import('pages/courses/action/courses-action.page'),
);

const CourseDetails = lazy(
  () => import('pages/courses/details/course-details'),
);

const LessonPage = lazy(() => import('pages/lesson/lesson.page'));
const LessonActionPage = lazy(
  () => import('pages/lesson/action/lesson-action.page'),
);
const SchoolExamPage = lazy(
  () => import('pages/exam/school-exam/school-exam.page'),
);

const SchoolLiveExamPage = lazy(
  () => import('pages/LiveExams/schoolLiveExam/school-live-exam.page'),
);

const SchoolQuestionsBankPage = lazy(
  () => import('pages/question-bank/qusetion-bank.page'),
);

const SchoolQuestionAction = lazy(
  () => import('pages/question-bank/action/question-action.page'),
);

const SchoolSubjectDetailsPage = lazy(
  () => import('pages/school-subject/subject-details/subject-details'),
);

const QuestionAction = lazy(
  () => import('pages/question-bank/action/question-action.page'),
);

const UploadExcelPage = lazy(
  () => import('pages/question-bank/action/upload-excel.page'),
);

const ExamQuestionAction = lazy(
  () => import('pages/exam-question/action/action'),
);

const SchoolNews = lazy(() => import('pages/news/news.page'));

const Reports = lazy(() => import('pages/reports/reports.page'));

const schoolSittingsRoutes: TRoute[] = [
  {
    path: routesNames.grades,
    element: <GradePage />,
  },
  {
    path: routesNames.gradeDetails,
    element: <GradeDetailsPage />,
  },
  {
    path: routesNames.educationalLevel,
    element: <EducationalLevelPage />,
  },
  {
    path: routesNames.schoolUnits,
    element: <SchoolUnitPage />,
  },
  {
    path: routesNames.schoolSubjects,
    element: <SchoolSubjectPage />,
  },
  {
    path: routesNames.schoolSubjectsDetails,
    element: <SchoolSubjectDetailsPage />,
  },
  {
    path: `${routesNames.schoolSubjectsDetails}/uploadExcel`,
    element: <UploadExcelPage />,
  },
  {
    path: routesNames.schoolCourses,
    element: <CoursesPage />,
  },
  {
    path: `${routesNames.schoolCourses}/actionCourse`,
    element: <CoursesActionPage />,
  },
  {
    path: `${routesNames.schoolSubjectsDetails}/actionCourse`,
    element: <CoursesActionPage />,
  },
  {
    path: routesNames.schoolLessons,
    element: <LessonPage />,
  },
  {
    path: `${routesNames.schoolCourseDetails}/action`,
    element: <LessonActionPage />,
  },
  {
    path: routesNames.schoolExams,
    element: <SchoolExamPage />,
  },
  {
    path: routesNames.schoolLiveExams,
    element: <SchoolLiveExamPage />,
  },
  {
    path: routesNames.schoolExamsReports,
    element: <Reports />,
  },

  {
    path: `${routesNames.schoolQuestionsBank}/actionQuestion`,
    element: <SchoolQuestionAction />,
  },
  {
    path: `${routesNames.schoolSubjectsDetails}/actionQuestion`,
    element: <QuestionAction />,
  },
  {
    path: routesNames.schoolQuestionsBank,
    element: <SchoolQuestionsBankPage />,
  },

  {
    path: routesNames.schoolQuestionsBankReports,
    element: <Reports />,
  },

  {
    path: `${routesNames.schoolQuestionsBank}/uploadExcel`,
    element: <UploadExcelPage />,
  },
  {
    path: routesNames.schoolExamQuestions,
    element: <ExamQuestionPage />,
  },
  {
    path: `${routesNames.schoolExamQuestions}/action`,
    element: <ExamQuestionAction />,
  },
  {
    path: routesNames.schoolNews,
    element: <SchoolNews />,
  },
  {
    path: routesNames.schoolCourseDetails,
    element: <CourseDetails />,
  },
  {
    path: routesNames.schoolReports,
    element: <Reports />,
  },
];

export default schoolSittingsRoutes;
