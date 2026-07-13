/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
import specializedQueries from 'apis/specialized/specialized.queries';
import {
  ISpecialized,
  ISpecializedPayloadForm,
} from 'apis/specialized/specialized.interfaces';
import { showSuccess } from 'libs/react.toastify';
import specializedApi from 'apis/specialized/specialized.api';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import MultiLevelPage from 'components/common/multi-level-page/multi-level-page.component';
import { TNestedItemPage } from 'components/common/multi-level-page/components/nested-items/nested-items.component';
import SpecializedForm from 'components/forms/specialized/specialized.form';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import prepareSpecializedFormData from 'components/forms/specialized/helper/prepare-specialized-formdata';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

export const makeNestedItemsFromSpecialized = (
  data: ISpecialized,
): TNestedItemPage => ({
  id: data.id,
  name: data.name,
  parentId: data.parentId,
  children: data.children.map((c) => makeNestedItemsFromSpecialized(c)),
});

const generateSpecializedItem = (data: TNestedItemPage): ISpecialized => ({
  id: data.id,
  name: data.name,
  parentId: data.parentId,
  children: data.children.map((d) => generateSpecializedItem(d)),
});

function SpecializedPage() {
  const [parentId, setParentId] = useState(0);
  const { t } = useTranslation();
  const {
    dispatchDeleting,
    dispatchResetCrudState,
    isDeleting,
    getActionId,
    isEditing,
    isAdding,
    getSelectedData,
    dispatchAdding,
    dispatchEditing,
  } = useCreateCrudState<ISpecialized>();

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting(id);
    },
    [dispatchDeleting],
  );

  const handleEditClick = useCallback(
    (data: TNestedItemPage) => {
      dispatchEditing({ selectedData: generateSpecializedItem(data) });
    },
    [dispatchEditing],
  );

  const {
    data: specialized,
    refetch,
    isLoading,
  } = specializedQueries.useSpecializedQuery();

  const { data: editData, isLoading: isLoadingEditData } =
    specializedQueries.useSpecializedDetailsQuery(
      Number(getSelectedData()?.id),
      !!getSelectedData()?.id,
    );

  const handleRemoveSpecialized = async () => {
    try {
      await specializedApi.removeSpecialized(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataDeletedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleSpecializedAction = async ({
    data,
    files,
    urlsForRemove,
  }: TSubmitHandlerData<ISpecializedPayloadForm>) => {
    try {
      if (getSelectedData()?.id) {
        const FormPayload = {
          ...data,
          parentId: getSelectedData()?.parentId || null,
          id: getSelectedData()?.id,
        };
        const payload = prepareSpecializedFormData({
          data: FormPayload,
          files,
          urlsForRemove,
        });
        await specializedApi.updateSpecialized(payload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const FormPayload = {
          ...data,
          parentId,
        };
        const payload = prepareSpecializedFormData({
          data: FormPayload,
          files,
        });
        await specializedApi.addSpecialized(payload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <MultiLevelPage
      data={
        specialized?.data?.map((s) => makeNestedItemsFromSpecialized(s)) || []
      }
      permissionName="Specialized"
      form={
        <SpecializedForm
          editItem={editData || null}
          onSubmit={(data) => handleSpecializedAction(data)}
        />
      }
      name={String(t('specialized.specialized'))}
      title={String(t('specialized.specialized'))}
      isLoading={isLoading}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveSpecialized}
      openActionModal={isAdding || isEditing}
      loadingActionModal={!!isLoadingEditData && !!getSelectedData()?.id}
      setOpenActionModal={dispatchResetCrudState}
      actionModalTitle={
        isEditing
          ? String(t('specialized.editSpecialized'))
          : String(t('specialized.addSpecialized'))
      }
      handleAddClick={(id) => {
        dispatchAdding();
        setParentId(id || 0);
      }}
      handleEditClick={handleEditClick}
    />
  );
}

export default ProtectPage({
  Page: SpecializedPage,
  controllerName: ControllersNames.Specialized,
});
