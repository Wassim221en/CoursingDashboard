/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { INewRegistrationStudents } from 'apis/student/student.interfaces';
import studentQueries from 'apis/student/student.queries';
import { getNameById } from 'hooks/use-generic-form/helpers';
import { studentType } from 'constants/constants';
import { generateFriendlyDate } from 'utils/helpers';

function NewRegistrationStudents() {
  const { t } = useTranslation();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: newRegistrationStudents, isLoading: isLoadingData } =
    studentQueries.useNewRegistrationStudentsQuery(pagination);

  const Columns = useMemo<MRT_ColumnDef<INewRegistrationStudents>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: t('students.fullName'),
        Cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      {
        accessorKey: 'studentType',
        header: t('students.studnetType'),
        Cell: ({ cell }) => getNameById(studentType, cell.getValue<string>()),
      },
      {
        accessorKey: 'city.name',
        header: t('students.city'),
      },
      {
        accessorKey: 'dateOfRegistration',
        header: t('students.dateOfRegistration'),
        Cell: ({ cell }) => generateFriendlyDate(cell.getValue<string>()),
      },
    ],
    [t],
  );

  const NewRegistrationStudentsTable =
    GenericTablePage<INewRegistrationStudents>;

  return (
    <Box>
      <NewRegistrationStudentsTable
        form=""
        columns={Columns}
        data={newRegistrationStudents?.data || []}
        name={String(t('students.newRegistrationStudents'))}
        title={String(t('students.newRegistrationStudents'))}
        isLoading={isLoadingData}
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

export default NewRegistrationStudents;
