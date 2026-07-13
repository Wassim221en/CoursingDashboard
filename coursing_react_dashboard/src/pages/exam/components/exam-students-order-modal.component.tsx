import { useMemo } from 'react';
import { MRT_ColumnDef, MaterialReactTable } from 'material-react-table';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import FadeModal from 'components/common/generic-table-page/components/fade-modal/fade-modal.component';
import examQueries from 'apis/exam/exam.queries';
import { IStudent } from 'apis/student/student.interfaces';

type Props = {
  examId?: number;
  open: boolean;
  setOpen: (value: boolean) => void;
};

function ExamStudentsOrderModal({ examId, open, setOpen }: Props) {
  const { t } = useTranslation();
  const { data, isLoading } = examQueries.useStudentsOrderInExamQuery(examId);

  const columns = useMemo<MRT_ColumnDef<IStudent>[]>(
    () => [
      {
        accessorKey: 'id',
        header: '#',
        size: 70,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'fullName',
        header: t('students.fullName'),
        size: 280,
      },
      {
        accessorKey: 'completionRate',
        header: t('courses.completionRate'),
        size: 140,
        Cell: ({ cell }) => `${cell.getValue<number>() ?? 0}%`,
      },
    ],
    [t],
  );

  return (
    <FadeModal
      width={900}
      open={open}
      setOpen={setOpen}
      modalTitle={String(t('courses.studentsOrder'))}
      isDialog
    >
      <Box>
        <MaterialReactTable
          columns={columns}
          data={data?.data || []}
          enableTopToolbar={false}
          enableRowActions={false}
          state={{ isLoading }}
          muiTablePaperProps={{
            sx: { direction: 'rtl' },
          }}
          muiTableHeadCellProps={({ column }) => ({
            align: 'center',
            sx: {
              textAlign: 'center',
            },
          })}
          muiTableBodyCellProps={({ column }) => ({
            align: 'center',
            sx: {
              textAlign: 'center',
            },
          })}
          enableColumnActions={false}
          enableGlobalFilter={false}
          enableColumnFilters={false}
          enableFullScreenToggle={false}
          defaultColumn={{
            minSize: 40,
            maxSize: 1000,
            size: 100,
            enableResizing: true,
          }}
        />
      </Box>
    </FadeModal>
  );
}

export default ExamStudentsOrderModal;
