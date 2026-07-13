/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import courseQueries from 'apis/course/course.queries';
import { ICourseStudents } from 'apis/course/course.interfaces';
import { generateFriendlyDate } from 'utils/helpers';

import DateFilter from 'components/common/date-filter/date-filter.component';

function CourseStudents() {
  const { t } = useTranslation();

  const courseId = useSearchParams('course');

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 1000,
  });

  const [fromDate, setFromnDate] = useState<Date | null>();

  const [toDate, setToDate] = useState<Date | null>();

  const { data: courseStudents, isLoading: isLoadingCourseStudent } =
    courseQueries.useCourseStudents({
      pageNumber: pagination.pageIndex,
      pageSize: pagination.pageSize,
      courseId,
      From: fromDate?.toISOString() || null,
      to: toDate?.toISOString() || null,
    });

  const Columns = useMemo<MRT_ColumnDef<ICourseStudents>[]>(
    () => [
      {
        accessorKey: 'studentName',
        header: t('students.fullName'),
      },
      {
        accessorKey: 'enrolledDate',
        header: t('courses.enrollDate'),
        Cell: ({ cell }) => generateFriendlyDate(cell.getValue<string>()),
      },
      {
        accessorKey: 'expireDate',
        header: t('courses.courseExpireDate'),
        Cell: ({ cell }) => generateFriendlyDate(cell.getValue<string>()),
      },
      {
        accessorKey: 'completionRate',
        header: t('courses.completionRate'),
        Cell: ({ cell }) => `${cell.getValue<number>()}%`,
      },
      {
        accessorKey: 'examAvg',
        header: t('courses.examAvg'),
      },
    ],
    [t],
  );

  const CourseStudentsTable = GenericTablePage<ICourseStudents>;

  return (
    <Box>
      <CourseStudentsTable
        form=""
        columns={Columns}
        data={courseStudents?.data || []}
        name={String(t('courses.enrolledStudents'))}
        title={String(t('courses.enrolledStudents'))}
        isLoading={isLoadingCourseStudent}
        withActionProgress={false}
        pagination={pagination}
        setPagination={setPagination}
        withoutActions
        permissionName="forceAllow"
        extra={
          <Grid container gap={2}>
            <Grid item md={5}>
              <DateFilter
                value={fromDate || null}
                setValue={setFromnDate}
                label={t('common.fromDate')}
                maxDate={new Date()}
              />
            </Grid>
            <Grid item md={5}>
              <DateFilter
                value={toDate || null}
                setValue={setToDate}
                label={t('common.toDate')}
                maxDate={new Date()}
                minDate={fromDate || null}
                disabled={!fromDate}
              />
            </Grid>
          </Grid>
        }
      />
    </Box>
  );
}

export default CourseStudents;
