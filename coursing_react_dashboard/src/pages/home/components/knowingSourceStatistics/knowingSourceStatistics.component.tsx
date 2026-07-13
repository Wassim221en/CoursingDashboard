/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useKnowingSourceStatisticsQuery from 'apis/invitation-source/Invitation-source.queries';
import { IKnowingSourceStatistics } from 'apis/invitation-source/Invitation-source.interfaces';
import { getNameById } from 'hooks/use-generic-form/helpers';
import { KnowingSource } from 'constants/constants';

function KnowingSourceStatistics() {
  const { t } = useTranslation();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: knowingSourceStatistics,
    isLoading: isLoadingKnowingSourceStatistics,
  } = useKnowingSourceStatisticsQuery();

  const Columns = useMemo<MRT_ColumnDef<IKnowingSourceStatistics>[]>(
    () => [
      {
        accessorKey: 'knowingSource',
        header: t('statistics.knowingSource'),
        Cell: ({ cell }) => getNameById(KnowingSource, String(cell.getValue())),
      },
      {
        accessorKey: 'count',
        header: t('statistics.count'),
      },
    ],
    [t],
  );

  const KnowingSourceStatisticsTable =
    GenericTablePage<IKnowingSourceStatistics>;

  return (
    <Box>
      <KnowingSourceStatisticsTable
        form=""
        columns={Columns}
        data={knowingSourceStatistics || []}
        name={String(t('statistics.appKnowingSource'))}
        title={String(t('statistics.appKnowingSource'))}
        isLoading={isLoadingKnowingSourceStatistics}
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

export default KnowingSourceStatistics;
