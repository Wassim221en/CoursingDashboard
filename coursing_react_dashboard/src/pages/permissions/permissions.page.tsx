/* eslint-disable no-nested-ternary */
import { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import usersQueries from 'apis/users/users.queries';
import { IRoles } from 'apis/users/users.interfaces';
import { useNavigate } from 'react-router-dom';
import routesNames from 'routes/constants';

function PremissionPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: roles, isLoading: isLoadingRoles } =
    usersQueries.useAllRolesQueries();

  const handleEditClick = useCallback(
    (data: IRoles) => {
      navigate(`${routesNames.userRolesAndPermissions}/action?role=${data.id}`);
    },
    [navigate],
  );

  const Columns = useMemo<MRT_ColumnDef<IRoles>[]>(
    () => [
      {
        accessorKey: 'roleName',
        header: t('rolesAndPermissions.role'),
      },
    ],
    [t],
  );

  const PermissionTable = GenericTablePage<IRoles>;

  return (
    <Box>
      <PermissionTable
        form=""
        columns={Columns}
        data={roles || []}
        name={String(t('permissions'))}
        title={String(t('rolesAndPermissions.rolesAndPermissions'))}
        isLoading={isLoadingRoles}
        handleEditClick={handleEditClick}
        withActionProgress={false}
        pagination={pagination}
        width={800}
        permissionName="Account"
        setPagination={setPagination}
      />
    </Box>
  );
}

export default PremissionPage;
