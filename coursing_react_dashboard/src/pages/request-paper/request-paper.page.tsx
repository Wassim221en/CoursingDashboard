/* eslint-disable react/no-unstable-nested-components */
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import RequestPaperApis from 'apis/request-paper/request-paper.api';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { showSuccess } from 'libs/react.toastify';
import { useTranslation } from 'react-i18next';
import {
  IRequestPaper,
  IRequestPaperPayload,
  IRequestPaperPayloadForm,
} from 'apis/request-paper/request-paper.interfaces';
import requestPapersQueries from 'apis/request-paper/request-paper-queries';
import { getNameById } from 'hooks/use-generic-form/helpers';
import {
  ControllersNames,
  RequestPaperCopyStatus,
  RequestPaperCopyType,
} from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';
import RequestPaperForm from 'components/forms/request-paper/request-paper.form';
import StatusBadge from './components/badge';

function RequestPaper() {
  const {
    dispatchEditing,
    dispatchResetCrudState,
    getSelectedData,
    isDeleting,
    isAdding,
    isEditing,
  } = useCreateCrudState<IRequestPaper>();
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: requestedPapers,
    isLoading: isLoadingRequestPaper,
    refetch,
  } = requestPapersQueries.useRequestPaperQuery({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleEditClick = useCallback(
    (data: IRequestPaper) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleChangeStatusAction = async ({
    data,
  }: TSubmitHandlerData<IRequestPaperPayloadForm>) => {
    const payloadData: IRequestPaperPayload = {
      ...data,
      status: data.status.id,
    };
    try {
      const payload = { ...payloadData, requestPaperId: getSelectedData()?.id };

      await RequestPaperApis.updatePaperRequestStatus(payload);
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataUpdatedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const RequestPaperTable = GenericTablePage<IRequestPaper>;

  const columns = useMemo<MRT_ColumnDef<IRequestPaper>[]>(
    () => [
      {
        accessorKey: 'user.name',
        header: t('requestPaper.user'),
      },
      {
        accessorKey: 'deliveredName',
        header: t('requestPaper.deliveredName'),
      },
      {
        accessorKey: 'phoneNumber',
        header: t('requestPaper.phoneNumber'),
      },
      {
        accessorKey: 'address',
        header: t('salesPoints.address'),
      },
      {
        accessorKey: 'countOfCopy',
        header: t('salesPoints.countOfCopy'),
      },
      {
        accessorKey: 'examTitle',
        header: t('requestPaper.exam'),
      },
      {
        accessorKey: 'fileTitle',
        header: t('requestPaper.file'),
      },
      {
        accessorKey: 'courseTitle',
        header: t('requestPaper.course'),
      },
      {
        accessorKey: 'lessonTitle',
        header: t('requestPaper.lesson'),
      },
      {
        accessorKey: 'type',
        header: t('requestPaper.type'),
        Cell: ({ cell }) =>
          t(getNameById(RequestPaperCopyType, String(cell.getValue()))),
      },
      {
        accessorKey: 'status',
        header: t('requestPaper.status'),
        Cell: ({ cell }) => (
          <StatusBadge
            text={t(
              getNameById(RequestPaperCopyStatus, String(cell.getValue())),
            )}
            status={Number(cell.getValue())}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <RequestPaperTable
      form={
        <RequestPaperForm
          onSubmit={handleChangeStatusAction}
          editItem={getSelectedData()}
        />
      }
      data={requestedPapers?.data || []}
      columns={columns}
      name={String(t('requestPaper.requestPaper'))}
      title={t('requestPaper.requestPaper')}
      isLoading={isLoadingRequestPaper}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      actionModalTitle={isEditing ? String(t('requestPaper.changeStatus')) : ''}
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={requestedPapers?.totalRecords || 0}
      permissionName="RequestPaperCopy"
    />
  );
}

export default ProtectPage({
  Page: RequestPaper,
  controllerName: ControllersNames.RequestPaperCopy,
});
