/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import courseQueries from 'apis/course/course.queries';
import { IStudent } from 'apis/student/student.interfaces';

function StudentsOrderInCourse() {
  const { t } = useTranslation();

  const courseId = useSearchParams('course');

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: studentsOrder, isLoading: isLoadingStudetsOrder } =
    courseQueries.useStudentsOrderInCourseQuery({
      courseId,
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageIndex,
    });

  const Columns = useMemo<MRT_ColumnDef<IStudent>[]>(
    () => [
      {
        accessorKey: 'id',
        header: '#',
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'fullName',
        header: t('students.fullName'),
      },
      {
        accessorKey: 'completionRate',
        header: t('courses.completionRate'),
        Cell: ({ cell }) => `${cell.getValue<number>()}%`,
      },
    ],
    [t],
  );

  const StudentsOrderTable = GenericTablePage<IStudent>;

  return (
    <Box>
      <StudentsOrderTable
        form=""
        columns={Columns}
        data={studentsOrder?.data || []}
        name={String(t('courses.studentsOrder'))}
        title={String(t('courses.studentsOrder'))}
        isLoading={isLoadingStudetsOrder}
        withActionProgress={false}
        pagination={pagination}
        setPagination={setPagination}
        withoutActions
        permissionName="forceAllow"
      />
    </Box>
  );
}

export default StudentsOrderInCourse;
