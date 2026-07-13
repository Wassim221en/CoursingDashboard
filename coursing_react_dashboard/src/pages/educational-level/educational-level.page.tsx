/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import educationalLevelQueries from 'apis/educational-level/educational-level.queries';
import {
  IEducationalLevel,
  IEducationalLevelPayloadForm,
} from 'apis/educational-level/educational-level.interfaces';
import { showSuccess } from 'libs/react.toastify';
import educationalLevelApi from 'apis/educational-level/educational-level.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import EducationalLevelForm from 'components/forms/educational-level/educational-level.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

function EducationalLevelPage() {
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
  } = useCreateCrudState<IEducationalLevel>();

  const [showActionProgress, setShowActionProgress] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleEditClick = useCallback(
    (data: IEducationalLevel) => {
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
    data: educationalLevelDetails,
    isLoading: isLoadingEducationalLevel,
    refetch: refetchDetails,
  } = educationalLevelQueries.useEducationalLevelDetailsQuery(
    getSelectedData()?.id || 0,
    {
      pageNumber: pagination.pageIndex,
      pageSize: pagination.pageSize,
    },
  );

  const isDetailsLoaded =
    !isLoadingEducationalLevel &&
    getSelectedData()?.id &&
    educationalLevelDetails;

  const {
    data: educationalLevels,
    refetch,
    isLoading,
  } = educationalLevelQueries.useEducationalLevelsQuery({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleRemoveEducationalLevel = async () => {
    setShowActionProgress(true);

    try {
      await educationalLevelApi.removeEducationalLevel(getActionId());
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

  const handleEducationalLevelAction = async ({
    data,
  }: TSubmitHandlerData<IEducationalLevelPayloadForm>) => {
    const formPayload = {
      ...data,
      gradesIds: data.gradesIds.length
        ? data.gradesIds.map((grade) => grade.id)
        : [],
    };
    try {
      if (getSelectedData()?.id) {
        const payload = { ...formPayload, id: getSelectedData()?.id };
        await educationalLevelApi.updateEducationalLevel(payload);
        await refetchDetails();
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        await educationalLevelApi.addEducationalLevel(formPayload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<IEducationalLevel>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('educationalLevels.name'),
      },
    ],
    [t],
  );

  const EducationalLevelTable = GenericTablePage<IEducationalLevel>;

  return (
    <EducationalLevelTable
      form={
        <EducationalLevelForm
          editItem={isDetailsLoaded ? educationalLevelDetails! : null}
          onSubmit={(data) => handleEducationalLevelAction(data)}
        />
      }
      columns={columns}
      data={educationalLevels?.data || []}
      name={String(t('educationalLevels.educationalLevel'))}
      title={String(t('educationalLevels.educationalLevels'))}
      isLoading={isLoading}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveEducationalLevel}
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={educationalLevels?.totalRecords || 0}
      withActionProgress={showActionProgress}
      permissionName="EducationalLevel"
      actionModalTitle={
        isEditing
          ? String(t('educationalLevels.editEducationalLevel'))
          : String(t('educationalLevels.addEducationalLevel'))
      }
      loadingActionModal={isLoadingEducationalLevel && !!getSelectedData()?.id}
    />
  );
}

export default ProtectPage({
  Page: EducationalLevelPage,
  controllerName: ControllersNames.EducationalLevel,
});
