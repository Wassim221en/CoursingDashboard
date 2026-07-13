/* eslint-disable no-nested-ternary */
import { Box, Tab, Tabs } from '@mui/material';
import React, { ReactNode, useMemo } from 'react';
import CourseAttachments from 'pages/course-attachments/course-attachments.page';
import CourseQuiz from 'pages/course-quiz/course-quiz.page';
import LessonsPage from 'pages/lesson/lesson.page';
import { motion } from 'framer-motion';
import NoData from 'components/common/no-data/no-data.component';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useTranslation } from 'react-i18next';
import NotFoundPage from 'pages/error-pages/not-found.page';
import Reports from 'pages/reports/reports.page';
import ProtectPage from 'components/common/protect-page/protectPage';
import { useSearchParams as useParamsState } from 'react-router-dom';
import CourseStudents from '../components/course-students.component';
import CourseQuestionAndAnswers from '../components/course-question.component';
import StudentsOrderInCourse from '../components/students-order-in-course.component';
import CourseRating from '../components/course-rating';
import InstructorReviews from '../components/instructor-reviews';

type TabName =
  | 'lessons'
  | 'courseQuizs'
  | 'attachments'
  | 'enrolledStudents'
  | 'questionsAndAnswers'
  | 'studentsRating'
  | 'courseRating'
  | 'instructorReviews'
  | 'reports';

function CoursesDetailsPage() {
  const courseId = useSearchParams('course');
  const [params, setParams] = useParamsState();

  const activeTab = (params.get('activeTab') as TabName & {}) || 'lessons';

  const { t } = useTranslation();

  const tabs = useMemo<
    Record<
      TabName,
      {
        title: string;
        component: ReactNode;
      }
    >
  >(
    () => ({
      // default tab
      lessons: {
        title: t('exams.lessons'),
        component: <LessonsPage />,
      },
      courseQuizs: {
        title: t('courses.courseQuizs'),
        component: <CourseQuiz />,
      },
      attachments: {
        title: t('courses.attachments'),
        component: <CourseAttachments />,
      },
      enrolledStudents: {
        title: t('courses.enrolledStudents'),
        component: <CourseStudents />,
      },
      questionsAndAnswers: {
        title: t('courses.questionsAndAnswers'),
        component: <CourseQuestionAndAnswers />,
      },
      studentsRating: {
        title: t('courses.studentsRating'),
        component: <StudentsOrderInCourse />,
      },
      courseRating: {
        title: t('courses.courseRating'),
        component: <CourseRating />,
      },
      instructorReviews: {
        title: t('courses.instructorReviews'),
        component: <InstructorReviews />,
      },
      reports: {
        title: t('reports.reports'),
        component: <Reports />,
      },
    }),
    [t],
  );

  if (!courseId) return <NotFoundPage />;

  return (
    <>
      <Tabs
        sx={{
          py: 2,
          position: 'fixed',
          width: '100%',
          bgcolor: 'white',
          zIndex: 2,
        }}
        value={activeTab}
        onChange={(_, value) =>
          setParams((prev) => {
            prev.set('activeTab', value);
            return prev;
          })
        }
      >
        {Object.entries(tabs).map(([tabValue, { title }]) => (
          <Tab key={tabValue} value={tabValue} label={title} />
        ))}
      </Tabs>
      <Box py={14}>
        <motion.div
          animate={{
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          }}
        >
          {tabs[activeTab].component || <NoData />}
        </motion.div>
      </Box>
    </>
  );
}

export default ProtectPage({
  Page: CoursesDetailsPage,
  internalPathNameSearch: true,
});
