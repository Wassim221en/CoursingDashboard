/* eslint-disable react/no-unstable-nested-components */
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { MRT_ColumnDef } from 'material-react-table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import usersQueries from 'apis/users/users.queries';
import {
  IRoles,
  IUser,
  IUserPayload,
  IUserPayloadForm,
} from 'apis/users/users.interfaces';
import authApi from 'apis/auth/auth.api';
import { showSuccess } from 'libs/react.toastify';
import UsersForm from 'components/forms/users/user.form';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import usersApis from 'apis/users/users.api';
import ProtectPage from 'components/common/protect-page/protectPage';
import { ControllersNames } from 'constants/constants';

function UsersPage() {
  const { t } = useTranslation();
  const {
    dispatchResetCrudState,
    isEditing,
    dispatchDeleting,
    isDeleting,
    getActionId,
    dispatchAdding,
    getSelectedData,
    dispatchEditing,
    isAdding,
  } = useCreateCrudState<IUser>();

  const [showActionProgress, setShowActionProgress] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: users,
    isLoading: isLoadingUsers,
    refetch,
  } = usersQueries.useUsersQueries({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleUserAction = async ({
    data,
  }: TSubmitHandlerData<IUserPayloadForm>) => {
    const formPayload: IUserPayload = {
      ...data,
      roleId: data.roleId.id,
    };

    try {
      if (getSelectedData()?.id) {
        const payload = { ...formPayload, id: getSelectedData()?.id };
        await usersApis.updateUser(payload);
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
        await refetch();
      } else {
        await usersApis.addUser(formPayload);
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
        await refetch();
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting({ actionId: id });
    },
    [dispatchDeleting],
  );

  const handleRemoveUser = async () => {
    setShowActionProgress(true);
    try {
      await authApi.removeAccount(getActionId(), false);
      await refetch();
      showSuccess(t('common.dataDeletedSuccessfully'));
      setShowActionProgress(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowActionProgress(false);
    }
  };

  const handleEditClick = useCallback(
    (data: IUser) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const columns = useMemo<MRT_ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: t('common.fullName'),
      },
      {
        accessorKey: 'userName',
        header: t('instructors.username'),
      },
      {
        accessorKey: 'email',
        header: t('users.email'),
      },
      {
        accessorKey: 'phoneNumber',
        header: t('users.phoneNumber'),
      },
      {
        accessorKey: 'roles',
        header: t('users.roles'),
        Cell: ({ cell }) =>
          cell.getValue<IRoles[]>().map((role) => role.roleName),
      },
    ],
    [t],
  );

  const UsersTable = GenericTablePage<IUser>;

  return (
    <UsersTable
      form={
        <UsersForm editItem={getSelectedData()} onSubmit={handleUserAction} />
      }
      columns={columns}
      data={users?.data || []}
      name={String(t('users.user'))}
      title={t('users.users')}
      handleAddClick={dispatchAdding}
      actionModalTitle={
        isEditing ? String(t('users.editUser')) : String(t('users.addUser'))
      }
      handleEditClick={handleEditClick}
      openActionModal={isEditing || isAdding}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      setOpenActionModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      setPagination={setPagination}
      handleDeleteSubmit={handleRemoveUser}
      isLoading={isLoadingUsers}
      pagination={pagination}
      totalRecords={users?.totalRecords || 0}
      withActionProgress={showActionProgress}
      permissionName="Account"
    />
  );
}

export default ProtectPage({
  Page: UsersPage,
  controllerName: ControllersNames.Account,
});
