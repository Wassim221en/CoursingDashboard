/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
import {
  ICollegeUnit,
  ICollegeUnitPayloadForm,
} from 'apis/college-unit/college-unit.interfaces';
import { showSuccess } from 'libs/react.toastify';
import collegeUnitApi from 'apis/college-unit/college-unit.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import CollegeUnitForm from 'components/forms/college-unit/college-unit.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import MultiLevelPageComponent from 'components/common/multi-level-page/multi-level-page.component';
import { TNestedItemPage } from 'components/common/multi-level-page/components/nested-items/nested-items.component';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import unitQueries from 'apis/college-unit/college-unit.queries';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

const generateNestedItem = (data: ICollegeUnit): TNestedItemPage => ({
  id: data.id,
  name: data.title,
  parentId: data.parentId,
  children: data.children.map((c) => generateNestedItem(c)),
  description: data.description,
  subject: data.collegeSubject,
});

const generateUnitItem = (data: TNestedItemPage): ICollegeUnit => ({
  id: data.id,
  title: data.name,
  parentId: data.parentId,
  description: data.description || null,
  children: data.children.map((c) => generateUnitItem(c)),
  collegeSubject: data.subject || null,
});

type Props = {
  extendedPageTitle?: string;
};

function UnitPage({ extendedPageTitle }: Props) {
  const { t } = useTranslation();
  const subjectId = useSearchParams('subject');

  const [parentId, setParentId] = useState(0);

  const {
    dispatchAdding,
    dispatchDeleting,
    dispatchEditing,
    dispatchResetCrudState,
    getSelectedData,
    getActionId,
    isAdding,
    isDeleting,
    isEditing,
  } = useCreateCrudState<ICollegeUnit>();

  const handleEditClick = useCallback(
    (data: TNestedItemPage) => {
      dispatchEditing({ selectedData: generateUnitItem(data) });
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
    data: subjectDetails,
    isLoading: isLoadingCollegeSubjectsUnits,
    refetch,
  } = unitQueries.useUnitsQuery({
    collegeDetailsSubjectId: subjectId,
  });

  const handleRemoveUnit = async () => {
    try {
      await collegeUnitApi.removeCollegeUnit(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.deleteSuccess', { var: t('exams.unit') }));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleUnitAction = async (
    payloadData: TSubmitHandlerData<ICollegeUnitPayloadForm>,
  ) => {
    const { data } = payloadData;
    const formPayload = {
      ...data,
      collegeDetailsSubjectId: Number(subjectId) || null,
    };
    try {
      if (getSelectedData()?.id) {
        const payload = {
          ...formPayload,
          id: getSelectedData()?.id,
          parentId: getSelectedData()?.parentId || null,
        };
        await collegeUnitApi.updateCollegeUnit(payload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        await collegeUnitApi.addCollegeUnit({ ...formPayload, parentId });
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
    <MultiLevelPageComponent
      data={subjectDetails?.data?.map((u) => generateNestedItem(u)) || []}
      permissionName="College"
      form={
        <CollegeUnitForm
          editItem={getSelectedData()}
          onSubmit={(data) => handleUnitAction(data)}
        />
      }
      name="Unit"
      title={`${t('exams.units')} ${
        extendedPageTitle?.length ? `/${extendedPageTitle}` : ``
      }`}
      isLoading={isLoadingCollegeSubjectsUnits}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveUnit}
      handleAddClick={(id) => {
        setParentId(id || 0);
        dispatchAdding();
      }}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      actionModalTitle={
        isEditing
          ? t('unit-form.edit-unit').toString()
          : t('unit-form.add-unit').toString()
      }
    />
  );
}

export default ProtectPage({
  Page: UnitPage,
  controllerName: ControllersNames.College,
});
