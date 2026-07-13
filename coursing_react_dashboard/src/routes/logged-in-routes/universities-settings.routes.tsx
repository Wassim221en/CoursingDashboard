import { lazy } from 'react';
import routesNames from 'routes/constants';
import TRoute from 'routes/types';

const UnitPage = lazy(() => import('pages/college-unit/college-unit.page'));
const SubjectPage = lazy(
  () => import('pages/college-subject/college-subject.page'),
);
const GradePage = lazy(() => import('pages/grade/grade.page'));
const SemesterPage = lazy(() => import('pages/semester/semester.page'));
const UniversityPage = lazy(() => import('pages/university/university.page'));
const CollegePage = lazy(() => import('pages/college/college.page'));
const AttachmentsPage = lazy(
  () => import('pages/course-attachments/course-attachments.page'),
);

const CollegeDetailsPage = lazy(
  () => import('pages/college-details/college-details.page'),
);
const CoursesPage = lazy(() => import('pages/courses/courses.page'));
const CoursesActionPage = lazy(
  () => import('pages/courses/action/courses-action.page'),
);
const LessonPage = lazy(() => import('pages/lesson/lesson.page'));
const LessonActionPage = lazy(
  () => import('pages/lesson/action/lesson-action.page'),
);
// const GraduationProjectPage = lazy(
//   () => import('pages/graduation-project/graduation-project.page'),
// );
const UniversityExamPage = lazy(
  () => import('pages/exam/university-exam/university-exam.page'),
);
const UniversityLiveExamPage = lazy(
  () => import('pages/LiveExams/universityLiveExam/university-live-exam.page'),
);
const CourseQuestionPage = lazy(
  () => import('pages/course-quiz/course-quiz.page'),
);
const ExamQuestionPage = lazy(
  () => import('pages/exam-question/exam-question.page'),
);
const CourseDetails = lazy(
  () => import('pages/courses/details/course-details'),
);

const QuestionsBankPage = lazy(
  () => import('pages/question-bank/qusetion-bank.page'),
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

const CollegeSubjectDetails = lazy(
  () => import('pages/college-subject/subject-details/subject-details'),
);

const UniversityNews = lazy(() => import('pages/news/news.page'));

const Reports = lazy(() => import('pages/reports/reports.page'));

const universitiesSettingsRoutes: TRoute[] = [
  {
    path: routesNames.collegeUnits,
    element: <UnitPage />,
  },
  {
    path: routesNames.collegeSubjects,
    element: <SubjectPage />,
  },
  {
    path: routesNames.collegeSubjectsDetails,
    element: <CollegeSubjectDetails />,
  },
  {
    path: routesNames.grades,
    element: <GradePage />,
  },
  {
    path: routesNames.semesters,
    element: <SemesterPage />,
  },
  {
    path: routesNames.universities,
    element: <UniversityPage />,
  },
  {
    path: routesNames.colleges,
    element: <CollegePage />,
  },
  {
    path: routesNames.collegeDetails,
    element: <CollegeDetailsPage />,
  },

  {
    path: routesNames.universityCourses,
    element: <CoursesPage />,
  },
  {
    path: `${routesNames.universityCourses}/actionCourse`,
    element: <CoursesActionPage />,
  },
  {
    path: `${routesNames.collegeSubjectsDetails}/actionCourse`,
    element: <CoursesActionPage />,
  },
  {
    path: routesNames.universityLessons,
    element: <LessonPage />,
  },
  {
    path: `${routesNames.universityCourseDetails}/action`,
    element: <LessonActionPage />,
  },
  {
    path: routesNames.universityExams,
    element: <UniversityExamPage />,
  },
  {
    path: routesNames.universityLiveExams,
    element: <UniversityLiveExamPage />,
  },
  {
    path: routesNames.universityExamsReports,
    element: <Reports />,
  },
  {
    path: routesNames.courseQuestions,
    element: <CourseQuestionPage />,
  },
  {
    path: routesNames.attachments,
    element: <AttachmentsPage />,
  },

  {
    path: routesNames.universityExamQuestions,
    element: <ExamQuestionPage />,
  },
  // {
  //   path: routesNames.graduationProject,
  //   element: <GraduationProjectPage />,
  // },
  {
    path: routesNames.universityQuestionsBank,
    element: <QuestionsBankPage />,
  },

  {
    path: routesNames.universityQuestionsBankReports,
    element: <Reports />,
  },

  {
    path: `${routesNames.universityQuestionsBank}/actionQuestion`,
    element: <QuestionAction />,
  },
  {
    path: `${routesNames.universityQuestionsBank}/uploadExcel`,
    element: <UploadExcelPage />,
  },
  {
    path: `${routesNames.collegeSubjectsDetails}/uploadExcel`,
    element: <UploadExcelPage />,
  },
  {
    path: `${routesNames.collegeSubjectsDetails}/actionQuestion`,
    element: <QuestionAction />,
  },
  {
    path: routesNames.universityCourseDetails,
    element: <CourseDetails />,
  },
  {
    path: `${routesNames.universityExamQuestions}/action`,
    element: <ExamQuestionAction />,
  },
  {
    path: routesNames.universityNews,
    element: <UniversityNews />,
  },
  {
    path: routesNames.universityReports,
    element: <Reports />,
  },
];

export default universitiesSettingsRoutes;
