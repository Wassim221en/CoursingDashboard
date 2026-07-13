import { Box, Grid, Typography } from '@mui/material';
import statisticsQueries from 'apis/statistics/statistics.queries';
import ProtectPage from 'components/common/protect-page/protectPage';
import { ControllersNames } from 'constants/constants';
import PageTitle from 'components/common/generic-table-page/components/page-title/page-title.component';
import { useTranslation } from 'react-i18next';
import GroupsIcon from '@mui/icons-material/Groups';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import StudentsByTypeChart from './components/studentsByType-cart/StudentsByType-chart.component';
import StudentsByGenderChart from './components/studentsByGender-chart/studentsByGender-chart.component';
import StudentsByCityChart from './components/studentsByCity-chart/studentsByCity-chart.component';
import StudentsByUniversityChart from './components/studentsByUniversity-chart/studentsByUniversity-chart.component';
import StudentsByCollegeChart from './components/studentsByCollege-chart/studentsByCollege-chart.components';
import StudentsByGradeChart from './components/studentsByGrade-chart/studentsByGrade-chart.component';
import MostPopularCourses from './components/mostPopularCourses/mostPopularCourses.component';
import NewRegistrationStudents from './components/newRegistrationStudents/newRegistrationStudents.component';
import StudentsBySpecialityChart from './components/studentsBySpeciality-chart/studentsBySpeciality-chart.component';
import KnowingSourceStatistics from './components/knowingSourceStatistics/knowingSourceStatistics.component';

function HomePage() {
  const { t } = useTranslation();

  const { data: statistics, isLoading: isLoadingStatistics } =
    statisticsQueries.useStatisticsQuery();

  return isLoadingStatistics ? (
    <LoadingPlaceholder />
  ) : (
    <Box>
      <Box py={2}>
        <PageTitle title={t('statistics.statistics')} />
      </Box>

      <Box sx={{ display: 'flex', py: 4 }}>
        <GroupsIcon sx={{ fontSize: 30 }} />
        <Typography sx={{ fontSize: 25, paddingInlineStart: 2 }}>
          {t('statistics.studentsTotalCount')}
        </Typography>
        <Typography sx={{ fontSize: 28 }}>
          {statistics?.studentsCount}
        </Typography>
      </Box>

      <Grid container>
        <Grid item md={4}>
          <StudentsByTypeChart statistics={statistics || null} />
        </Grid>
        <Grid item md={4}>
          <StudentsByGenderChart statistics={statistics || null} />
        </Grid>
        <Grid item md={4}>
          <StudentsByCityChart statistics={statistics || null} />
        </Grid>
      </Grid>

      <Grid container pb={4}>
        <Grid item md={7}>
          <NewRegistrationStudents />
        </Grid>
        <Grid item md={5}>
          <MostPopularCourses />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', py: 6 }}>
        <GroupsIcon sx={{ fontSize: 30 }} />
        <Typography sx={{ fontSize: 25, paddingInlineStart: 2 }}>
          {t('statistics.totalUniversityStudents')}
        </Typography>
        <Typography sx={{ fontSize: 28 }}>
          {statistics?.collegeStudentsCount}
        </Typography>
      </Box>

      <Grid container>
        {!!statistics?.universityStudents?.length && (
          <>
            <Grid item md={6}>
              <StudentsByCollegeChart statistics={statistics || null} />
            </Grid>
            <Grid item md={6}>
              <StudentsByUniversityChart statistics={statistics || null} />
            </Grid>
          </>
        )}
      </Grid>

      <Box sx={{ display: 'flex' }}>
        <GroupsIcon sx={{ fontSize: 30 }} />
        <Typography sx={{ fontSize: 25, paddingInlineStart: 2 }}>
          {t('statistics.totalSchoolingStudents')}
        </Typography>
        <Typography sx={{ fontSize: 28 }}>
          {statistics?.schoolStudentsCount}
        </Typography>
      </Box>

      <Grid container>
        <Grid item md={6}>
          {!!statistics?.schoolStudents?.length && (
            <StudentsByGradeChart statistics={statistics || null} />
          )}
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', py: 4 }}>
        <GroupsIcon sx={{ fontSize: 30 }} />
        <Typography sx={{ fontSize: 25, paddingInlineStart: 2 }}>
          {t('statistics.specialityStudentsCount')}
        </Typography>
        <Typography sx={{ fontSize: 28 }}>
          {statistics?.specialityStudentsCount}
        </Typography>
      </Box>

      {/* <Grid container>
        <Grid item md={6}>
          {!!statistics?.specialityStudents?.length && (
            <StudentsBySpecialityChart statistics={statistics || null} />
          )}
        </Grid>
      </Grid> */}

      <Grid container>
        <Grid item md={6}>
          <KnowingSourceStatistics />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProtectPage({
  Page: HomePage,
  controllerName: ControllersNames.Home,
});
