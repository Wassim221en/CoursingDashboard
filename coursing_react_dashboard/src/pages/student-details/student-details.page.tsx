/* eslint-disable no-nested-ternary */
import { Box, Tab, Tabs, Grid, Divider } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import studentQueries from 'apis/student/student.queries';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ProtectPage from 'components/common/protect-page/protectPage';
import { ControllersNames } from 'constants/constants';
import NoData from 'components/common/no-data/no-data.component';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import examQueries from 'apis/exam/exam.queries';
import GeneralInformationSection from './components/general-information/general-information.component';
import StudentCourses from './components/student-courses/student-courses.component';
import StudentExams from './components/student-exams/student-exams.component';
import StudentPoints from './components/student-points/student-points.component';

function StudentDetails() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { id: studentId } = useParams();

  const { data: studentExam, isLoading: isLoadingStudentExam } =
    examQueries.useUserExamsInfiniteQuery({
      userId: Number(studentId),
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageIndex,
    });
  const { data: studentInfo, isLoading: isLoadingStudentInfo } =
    studentQueries.useStudentDetailsQuery(Number(studentId));

  return (
    <Box>
      <Grid container>
        <Grid md={3}>
          {isLoadingStudentInfo ? (
            <LoadingPlaceholder />
          ) : (
            <Box
              sx={{
                position: 'fixed',
                mx: 2,
              }}
            >
              <GeneralInformationSection
                studentInfo={studentInfo?.data || null}
              />
            </Box>
          )}
        </Grid>
        <Divider
          flexItem
          orientation="vertical"
          sx={{ mx: 3, my: 2, display: { xs: 'none', md: 'flex' } }}
        />

        <Grid md={8}>
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
            <Tab value={1} label={t('exams.exams')} />
            <Tab value={2} label={t('students.points')} />
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
                {isLoadingStudentInfo ? (
                  <LoadingPlaceholder />
                ) : (
                  <StudentCourses
                    courses={studentInfo?.data.courses || []}
                    isLoadingStudentInfo={isLoadingStudentInfo}
                  />
                )}
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
                <StudentExams
                  setPagination={setPagination}
                  pagination={pagination}
                  Exams={studentExam?.pages[0]?.data.data || []}
                  isLoading={isLoadingStudentExam}
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
                <StudentPoints />
              </motion.div>
            ) : (
              <NoData />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProtectPage({
  Page: StudentDetails,
  controllerName: ControllersNames.Students,
});
