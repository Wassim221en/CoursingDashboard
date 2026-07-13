import roomQueries from 'apis/room/room.queries';
import PageTitle from 'components/common/generic-table-page/components/page-title/page-title.component';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MRT_ColumnDef } from 'material-react-table';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { showSuccess } from 'libs/react.toastify';
import {
  IMember,
  IRoom,
  IUserRoomPayload,
  IUserRoomPayloadForm,
} from 'apis/room/room.interfaces';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import MembersForm from 'components/forms/members/members.form';
import { useTranslation } from 'react-i18next';
import roomApi from 'apis/room/room.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';
import RoomDetails from './components/room-details.components';

function RoomDetailsPage() {
  const {
    dispatchDeleting,
    dispatchResetCrudState,
    getActionId,
    isDeleting,
    isAdding,
    dispatchAdding,
  } = useCreateCrudState<IRoom>();
  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);

  const { id: roomID } = useParams();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: room,
    refetch,
    isLoading,
  } = roomQueries.useRoomDetailsQuery(Number(roomID));

  const columns = useMemo<MRT_ColumnDef<IMember>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('rooms.name'),
      },
    ],
    [t],
  );

  const handleRemoveMember = async () => {
    setShowActionProgress(true);

    try {
      await roomApi.removeUserRoom(getActionId(), Number(roomID));
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

  const handleRoomMemberAction = async ({
    data,
  }: TSubmitHandlerData<IUserRoomPayloadForm>) => {
    const payloadData: IUserRoomPayload = {
      roomId: Number(roomID),
      users: [data.users.id],
    };
    try {
      await roomApi.addUserRoom(payloadData);
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataAddedSuccessfully'));
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

  const MembersTable = GenericTablePage<IMember>;

  return isLoading ? (
    <LoadingPlaceholder />
  ) : (
    <>
      <PageTitle title={String(t('rooms.roomDetails'))} />
      {room && <RoomDetails room={room} />}
      <MembersTable
        form={<MembersForm onSubmit={handleRoomMemberAction} />}
        data={room?.members || []}
        columns={columns}
        name={String(t('rooms.members'))}
        title={String(t('rooms.roomMembers'))}
        isLoading={isLoading}
        openDeleteModal={isDeleting}
        setOpenDeleteModal={dispatchResetCrudState}
        handleRemoveClick={handleRemoveClick}
        handleDeleteSubmit={handleRemoveMember}
        openActionModal={isAdding}
        setOpenActionModal={dispatchResetCrudState}
        actionModalTitle={String(t('rooms.addRoomMembers'))}
        handleAddClick={dispatchAdding}
        setPagination={setPagination}
        pagination={pagination}
        withActionProgress={showActionProgress}
        permissionName="Room"
      />
    </>
  );
}

export default ProtectPage({
  Page: RoomDetailsPage,
  controllerName: ControllersNames.Room,
});
