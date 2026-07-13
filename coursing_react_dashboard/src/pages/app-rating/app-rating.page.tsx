/* eslint-disable react/no-unstable-nested-components */
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { useTranslation } from 'react-i18next';
import { IStudentReviews } from 'apis/app-rating/app-rating.interfaces';
import appRatingQueries from 'apis/app-rating/app-rating.queries';
import { Rating } from '@mui/material';
import ProtectPage from 'components/common/protect-page/protectPage';
import { ControllersNames } from 'constants/constants';

function AppRating() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: appRating, isLoading: isLoadingAppRating } =
    appRatingQueries.useAppRatingQuery(pagination);

  const AppRatingTable = GenericTablePage<IStudentReviews>;

  const columns = useMemo<MRT_ColumnDef<IStudentReviews>[]>(
    () => [
      {
        accessorKey: 'student.fullName',
        header: t('students.fullName'),
      },
      {
        accessorKey: 'comment',
        header: t('appRating.comment'),
      },
      {
        accessorKey: 'rating',
        header: t('appRating.rating'),
        Cell: ({ cell }) => (
          <Rating readOnly value={cell.getValue<number>() || undefined} />
        ),
      },
    ],
    [t],
  );

  return (
    <AppRatingTable
      form={undefined}
      data={appRating?.studentReviews || []}
      columns={columns}
      name={String(t('appRating.appRating'))}
      title={t('appRating.appRating')}
      isLoading={isLoadingAppRating}
      setPagination={setPagination}
      pagination={pagination}
      permissionName="forceAllow"
      withoutActions
    />
  );
}

export default ProtectPage({
  Page: AppRating,
  controllerName: ControllersNames.AppRating,
});
