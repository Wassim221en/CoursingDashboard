import { lazy } from 'react';
import routesNames from 'routes/constants';
import TRoute from 'routes/types';

const SpecializedPage = lazy(
  () => import('pages/specialized/specialized.page'),
);
const CoursesPage = lazy(() => import('pages/courses/courses.page'));
const CoursesActionPage = lazy(
  () => import('pages/courses/action/courses-action.page'),
);

const CourseDetails = lazy(
  () => import('pages/courses/details/course-details'),
);

const LessonPage = lazy(() => import('pages/lesson/lesson.page'));
const ExamQuestionPage = lazy(
  () => import('pages/exam-question/exam-question.page'),
);
const LessonActionPage = lazy(
  () => import('pages/lesson/action/lesson-action.page'),
);
const SpecializedExamPage = lazy(
  () => import('pages/exam/specialized-exam/specialized-exam.page'),
);
const SpecializedPastExamPage = lazy(
  () => import('pages/past-exam/specialized-past-exam/specialized-past-exam'),
);
const SpecializedQuestionsBankPage = lazy(
  () => import('pages/question-bank/qusetion-bank.page'),
);

const SpecializedQuestionAction = lazy(
  () => import('pages/question-bank/action/question-action.page'),
);
const ExamQuestionAction = lazy(
  () => import('pages/exam-question/action/action'),
);

const UploadExcelPage = lazy(
  () => import('pages/question-bank/action/upload-excel.page'),
);

const SpecializedNews = lazy(() => import('pages/news/news.page'));

const Reports = lazy(() => import('pages/reports/reports.page'));

const specializedSittingsRoutes: TRoute[] = [
  {
    path: routesNames.specialized,
    element: <SpecializedPage />,
  },
  {
    path: routesNames.specializedCourses,
    element: <CoursesPage />,
  },
  {
    path: `${routesNames.specializedCourses}/actionCourse`,
    element: <CoursesActionPage />,
  },
  {
    path: `${routesNames.specializeCourseDetails}/action`,
    element: <LessonActionPage />,
  },
  {
    path: routesNames.specializedLessons,
    element: <LessonPage />,
  },
  {
    path: `${routesNames.specializedLessons}/action`,
    element: <LessonActionPage />,
  },
  {
    path: routesNames.specializedExams,
    element: <SpecializedExamPage />,
  },
  {
    path: routesNames.specializedPastExams,
    element: <SpecializedPastExamPage />,
  },

  {
    path: routesNames.specializedExamsReports,
    element: <Reports />,
  },

  {
    path: `${routesNames.specializeQuestionsBank}/actionQuestion`,
    element: <SpecializedQuestionAction />,
  },
  {
    path: routesNames.specializeQuestionsBank,
    element: <SpecializedQuestionsBankPage />,
  },

  {
    path: routesNames.specializeQuestionsBankReports,
    element: <Reports />,
  },

  {
    path: routesNames.specializeExamQuestions,
    element: <ExamQuestionPage />,
  },
  {
    path: `${routesNames.specializeExamQuestions}/action`,
    element: <ExamQuestionAction />,
  },
  {
    path: routesNames.specializeNews,
    element: <SpecializedNews />,
  },
  {
    path: `${routesNames.specializeQuestionsBank}/uploadExcel`,
    element: <UploadExcelPage />,
  },
  {
    path: routesNames.specializeCourseDetails,
    element: <CourseDetails />,
  },
  {
    path: routesNames.specializedReports,
    element: <Reports />,
  },
];

export default specializedSittingsRoutes;
