/* eslint-disable react/no-unstable-nested-components */
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import {
  IRoom,
  IRoomPayload,
  IRoomPayloadForm,
} from 'apis/room/room.interfaces';
import RoomsForm from 'components/forms/rooms/rooms.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import roomQueries from 'apis/room/room.queries';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import roomApi from 'apis/room/room.api';
import { showSuccess } from 'libs/react.toastify';
import PasswordCell from 'components/common/password-cell/password-cell.component';
import { useNavigate } from 'react-router-dom';
import routesNames from 'routes/constants';
import { useTranslation } from 'react-i18next';
import ProtectPage from 'components/common/protect-page/protectPage';
import { ControllersNames } from 'constants/constants';

function Rooms() {
  const {
    dispatchAdding,
    dispatchDeleting,
    dispatchEditing,
    dispatchResetCrudState,
    getActionId,
    getSelectedData,
    isDeleting,
    isAdding,
    isEditing,
  } = useCreateCrudState<IRoom>();
  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: rooms,
    refetch,
    isLoading,
  } = roomQueries.useRoomQuery({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting({ actionId: id });
    },
    [dispatchDeleting],
  );

  const handleEditClick = useCallback(
    (data: IRoom) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleRemoveRoom = async () => {
    setShowActionProgress(true);
    try {
      await roomApi.removeRoom(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataDeletedSuccessfully'));
      setShowActionProgress(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);

      setShowActionProgress(false);
    }
  };

  const handleRoomsAction = async ({
    data,
  }: TSubmitHandlerData<IRoomPayloadForm>) => {
    const payloadData: IRoomPayload = {
      ...data,
      adminId: data.adminId.id,
      usersId: [],
    };
    try {
      if (getSelectedData()?.id) {
        const payload = { ...payloadData, id: getSelectedData()?.id };
        await roomApi.updateRoom(payload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        await roomApi.addRoom(payloadData);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const handleDetailsClick = useCallback(
    (data: IRoom) => {
      navigate(`${routesNames.rooms}/${data.id}`);
    },
    [navigate],
  );

  const RoomsTable = GenericTablePage<IRoom>;

  const columns = useMemo<MRT_ColumnDef<IRoom>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('rooms.name'),
      },
      {
        accessorKey: 'admin.name',
        header: t('rooms.admin'),
      },
      {
        accessorKey: 'password',
        header: t('rooms.password'),
        Cell: ({ cell }) => <PasswordCell password={cell.getValue<string>()} />,
      },
    ],
    [t],
  );

  return (
    <RoomsTable
      form={
        <RoomsForm editItem={getSelectedData()} onSubmit={handleRoomsAction} />
      }
      data={rooms?.data || []}
      columns={columns}
      name={String(t('common.room'))}
      title={t('common.rooms')}
      isLoading={isLoading}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveRoom}
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      actionModalTitle={
        isEditing ? String(t('rooms.editRoom')) : String(t('rooms.addRoom'))
      }
      detailsTooltip="Show Students"
      handleDetailsClick={handleDetailsClick}
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={rooms?.totalRecords || 0}
      withActionProgress={showActionProgress}
      permissionName="Room"
    />
  );
}

export default ProtectPage({
  Page: Rooms,
  controllerName: ControllersNames.Room,
});
