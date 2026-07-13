import { ICourse } from 'apis/course/course.interfaces';
import { useTranslation } from 'react-i18next';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { generateFriendlyDate } from 'utils/helpers';
import { Box, Typography } from '@mui/material';

type Props = {
  courses: ICourse[];
  isLoadingStudentInfo: boolean;
};

function StudentCourses({ courses, isLoadingStudentInfo }: Props) {
  const { t } = useTranslation();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const Columns = useMemo<MRT_ColumnDef<ICourse>[]>(
    () => [
      {
        accessorKey: 'title',
        header: t('courses.courseTitle'),
      },
      {
        accessorKey: 'isActive',
        header: t('courses.status-course'),
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ cell }) => (
          <Box
            sx={{
              mx: 'auto',
              width: 'fit-content',
              color: cell.getValue<boolean>() ? 'green' : 'red',
            }}
          >
            {cell.getValue<boolean>()
              ? t('courses.finch')
              : t('courses.not-finch')}
          </Box>
        ),
      },
      {
        accessorKey: 'enrollDate',
        header: t('courses.enrollDate'),
        Cell: ({ cell }) => generateFriendlyDate(cell.getValue<string>()),
      },
      {
        accessorKey: 'completionRate',
        header: t('courses.progressPercent'),
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ cell }) => <Typography>{cell.getValue<number>()}%</Typography>,
      },
    ],
    [t],
  );

  const StudentCoursesTable = GenericTablePage<ICourse>;

  return (
    <StudentCoursesTable
      form=""
      columns={Columns}
      data={courses || []}
      name={String(t('courses.course'))}
      title={String(t('courses.courses'))}
      isLoading={isLoadingStudentInfo}
      withActionProgress={false}
      pagination={pagination}
      width={800}
      withoutActions
      permissionName="Student"
    />
  );
}

export default StudentCourses;
