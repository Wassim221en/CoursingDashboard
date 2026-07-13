/* eslint-disable no-nested-ternary */
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { IExam } from 'apis/exam/exam.interfaces';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { getNameById } from 'hooks/use-generic-form/helpers';
import { examType } from 'constants/constants';

import { ICourse } from 'apis/course/course.interfaces';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
  Exams: IExam[];
  isLoading: boolean;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination?: Dispatch<
    SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
};

function StudentExams({ Exams, isLoading, pagination, setPagination }: Props) {
  const { t } = useTranslation();

  // const [pagination, setPagination] = useState({
  //   pageIndex: 0,
  //   pageSize: 10,
  // });

  const Columns = useMemo<MRT_ColumnDef<IExam>[]>(
    () => [
      {
        accessorKey: 'title',
        header: t('exams.title'),
      },
      {
        accessorKey: 'examType',
        header: t('exams.examType'),
        Cell: ({ cell }) => t(getNameById(examType, cell.getValue<string>())),
      },

      {
        accessorKey: 'course',
        header: t('exams.course'),
        Cell: ({ cell }) => cell.getValue<ICourse>()?.title ?? '',
      },
      {
        accessorKey: 'myMark',
        header: t('exams.quizMark'),
        // eslint-disable-next-line react/no-unstable-nested-components
        Cell: ({ cell, row }) => (
          <div key={`${row.original.id} ${cell.getValue<number>()}`}>
            {cell.getValue<number>()} / {row.original.maxMark}
          </div>
        ),
      },
    ],
    [t],
  );

  const ExamTable = GenericTablePage<IExam>;

  return (
    <Box>
      <ExamTable
        form=""
        columns={Columns}
        data={Exams || []}
        name={String(t('exams.exam'))}
        title={String(t('exams.exams'))}
        isLoading={isLoading}
        withActionProgress={false}
        pagination={pagination}
        setPagination={setPagination}
        width={800}
        permissionName="Student"
        withoutActions
      />
    </Box>
  );
}

export default StudentExams;
