/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { IMostPopularCourse } from 'apis/course/course.interfaces';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import courseQueries from 'apis/course/course.queries';

function MostPopularCourses() {
  const { t } = useTranslation();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: mostPopularCourses, isLoading: isLoadingMostPouplarCourses } =
    courseQueries.useMostPopularCourseQuery(pagination);

  const Columns = useMemo<MRT_ColumnDef<IMostPopularCourse>[]>(
    () => [
      {
        accessorKey: 'title',
        header: t('courses.course'),
      },
    ],
    [t],
  );

  const MostPopularCoursesTable = GenericTablePage<IMostPopularCourse>;

  return (
    <Box>
      <MostPopularCoursesTable
        form=""
        columns={Columns}
        data={mostPopularCourses?.data || []}
        name={String(t('courses.mostPopularCourses'))}
        title={String(t('courses.mostPopularCourses'))}
        isLoading={isLoadingMostPouplarCourses}
        withActionProgress={false}
        pagination={pagination}
        setPagination={setPagination}
        enableTopToolbar={false}
        withoutActions
        permissionName="Home"
      />
    </Box>
  );
}

export default MostPopularCourses;
