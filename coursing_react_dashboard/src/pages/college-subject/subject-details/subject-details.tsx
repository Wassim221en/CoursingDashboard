/* eslint-disable no-nested-ternary */
import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import CourseAttachments from 'pages/course-attachments/course-attachments.page';
import CoursesPage from 'pages/courses/courses.page';
import QuestionsBank from 'pages/question-bank/qusetion-bank.page';
import ExamPage from 'pages/exam/university-exam/university-exam.page';
import UnitPage from 'pages/college-unit/college-unit.page';
import collegeSubjectQueries from 'apis/college-subject/college-subject.queries';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import UniversityPastExamPage from 'pages/past-exam/university-past-exam/university-past-exam';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import UniversityLiveExamPage from 'pages/LiveExams/universityLiveExam/university-live-exam.page';
import NoData from 'components/common/no-data/no-data.component';
import NotFoundPage from 'pages/error-pages/not-found.page';

function CollegeSubjectDetailsPage() {
  const [activeTab, setActiveTab] = useState(0);

  const { t } = useTranslation();

  const subject = useSearchParams('subject');

  const { data: subjectDetails } =
    collegeSubjectQueries.useCollegeSubjectDetailsUnitQuery(subject, !!subject);

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
        {/* <Tab value={2} label={t('exams.exams')} />
         */}
        <Tab value={2} label={t('common.questionBank')} />
        <Tab value={3} label={t('exams.pastExams')} />
        <Tab value={4} label={t('exams.liveExams')} />
        <Tab value={5} label={t('exams.units')} />
        <Tab value={6} label={t('exams.archived-questions')} />
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
            <CoursesPage extendedPageTitle={subjectDetails?.name} />
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
            <CourseAttachments extendedPageTitle={subjectDetails?.name} />
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
            <ExamPage extendedPageTitle={subjectDetails?.name} />
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
            <UniversityPastExamPage extendedPageTitle={subjectDetails?.name} />
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
            <UniversityLiveExamPage extendedPageTitle={subjectDetails?.name} />
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
            <UnitPage extendedPageTitle={subjectDetails?.name} />
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
            <QuestionsBank extendedPageTitle={subjectDetails?.name} />
          </motion.div>
        ) : (
          <NoData />
        )}
      </Box>
    </>
  );
}

export default CollegeSubjectDetailsPage;
