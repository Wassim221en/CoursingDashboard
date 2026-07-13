/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import semesterQueries from 'apis/semester/semester.queries';
import { ISemester, ISemesterPayload } from 'apis/semester/semester.interfaces';
import { showSuccess } from 'libs/react.toastify';
import semesterApi from 'apis/semester/semester.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import SemesterForm from 'components/forms/semester/semester.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

function SemesterPage() {
  const { t } = useTranslation();
  const {
    dispatchAdding,
    dispatchDeleting,
    dispatchEditing,
    dispatchResetCrudState,
    getSelectedData,
    isAdding,
    isDeleting,
    getActionId,
    isEditing,
  } = useCreateCrudState<ISemester>();

  const [showActionProgress, setShowActionProgress] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleEditClick = useCallback(
    (data: ISemester) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting(id);
    },
    [dispatchDeleting],
  );

  const {
    data: semesters,
    refetch,
    isLoading,
  } = semesterQueries.useSemestersQuery({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleRemoveSemester = async () => {
    setShowActionProgress(true);

    try {
      await semesterApi.removeSemester(getActionId());
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

  const handleSemesterAction = async (
    payloadData: TSubmitHandlerData<ISemesterPayload>,
  ) => {
    const { data } = payloadData;
    try {
      if (getSelectedData()?.id) {
        const payload = { ...data, id: getSelectedData()?.id };
        await semesterApi.updateSemester(payload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        await semesterApi.addSemester(data);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<ISemester>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
    ],
    [],
  );

  const SemesterTable = GenericTablePage<ISemester>;

  return (
    <SemesterTable
      form={
        <SemesterForm
          editItem={getSelectedData()}
          onSubmit={(data) => handleSemesterAction(data)}
        />
      }
      columns={columns}
      data={semesters?.data || []}
      name={String(t('universities.semester'))}
      title={String(t('universities.semesters'))}
      isLoading={isLoading}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveSemester}
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={semesters?.totalRecords || 0}
      withActionProgress={showActionProgress}
      permissionName="Semester"
      actionModalTitle={
        isEditing
          ? String(t('universities.editSemester'))
          : String(t('universities.addSemester'))
      }
    />
  );
}

export default ProtectPage({
  Page: SemesterPage,
  controllerName: ControllersNames.Semester,
});
