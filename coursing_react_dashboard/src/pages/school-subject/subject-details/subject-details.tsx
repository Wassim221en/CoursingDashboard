/* eslint-disable no-nested-ternary */
import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import CourseAttachments from 'pages/course-attachments/course-attachments.page';
import CoursesPage from 'pages/courses/courses.page';
import QuestionsBank from 'pages/question-bank/qusetion-bank.page';
import ExamPage from 'pages/exam/school-exam/school-exam.page';
import UnitPage from 'pages/school-unit/school-unit.page';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import SchoolPastExamPage from 'pages/past-exam/school-past-exam/school-past-exam';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import gradeQueries from 'apis/grade/grade.queries';
import SchoolLiveExamPage from 'pages/LiveExams/schoolLiveExam/school-live-exam.page';
import NoData from 'components/common/no-data/no-data.component';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';
import NotFoundPage from 'pages/error-pages/not-found.page';

function SchoolSubjectDetailsPage() {
  const subject = useSearchParams('subject');

  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(0);

  const { data: subjectDetails } = gradeQueries.useGradeSubjectDetailsQuery(
    subject,
    !!subject,
  );

  if (!subject) return <NotFoundPage />;

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
        onChange={(_, value) => setActiveTab(value)}
      >
        <Tab value={0} label={t('courses.courses')} />
        <Tab value={1} label={t('courses.files')} />
        <Tab value={2} label={t('exams.exams')} />
        <Tab value={3} label={t('exams.liveExams')} />
        <Tab value={4} label={t('exams.pastExams')} />
        <Tab value={5} label={t('exams.units')} />
        <Tab value={6} label={t('common.questionBank')} />
      </Tabs>

      <Box py={10}>
        {activeTab === 0 ? (
          <motion.div
            animate={{
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
            }}
          >
            <CoursesPage extendedPageTitle={subjectDetails?.subject?.name} />
          </motion.div>
        ) : activeTab === 1 ? (
          <motion.div
            animate={{
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
            }}
          >
            <CourseAttachments
              extendedPageTitle={subjectDetails?.subject.name}
            />
          </motion.div>
        ) : activeTab === 2 ? (
          <motion.div
            animate={{
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
            }}
          >
            <ExamPage extendedPageTitle={subjectDetails?.subject.name} />
          </motion.div>
        ) : activeTab === 3 ? (
          <motion.div
            animate={{
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
            }}
          >
            <SchoolLiveExamPage
              extendedPageTitle={subjectDetails?.subject.name}
            />
          </motion.div>
        ) : activeTab === 4 ? (
          <motion.div
            animate={{
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
            }}
          >
            <SchoolPastExamPage
              extendedPageTitle={subjectDetails?.subject.name}
            />
          </motion.div>
        ) : activeTab === 5 ? (
          <motion.div
            animate={{
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
            }}
          >
            <UnitPage />
          </motion.div>
        ) : activeTab === 6 ? (
          <motion.div
            animate={{
              x: 0,
              y: 0,
              scale: 1,
              rotate: 0,
            }}
          >
            <QuestionsBank extendedPageTitle={subjectDetails?.subject.name} />
          </motion.div>
        ) : (
          <NoData />
        )}
      </Box>
    </>
  );
}

export default ProtectPage({
  Page: SchoolSubjectDetailsPage,
  controllerName: ControllersNames.Grade,
});
