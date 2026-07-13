/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useState } from 'react';
import schoolUnitQueries from 'apis/school-unit/school-unit.queries';
import {
  ISchoolUnit,
  ISchoolUnitPayloadForm,
} from 'apis/school-unit/school-unit.interfaces';
import { showSuccess } from 'libs/react.toastify';
import schoolUnitApi from 'apis/school-unit/school-unit.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import SchoolUnitForm from 'components/forms/school-unit/school-unit.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import MultiLevelPageComponent from 'components/common/multi-level-page/multi-level-page.component';
import { TNestedItemPage } from 'components/common/multi-level-page/components/nested-items/nested-items.component';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

const generateNestedItem = (data: ISchoolUnit): TNestedItemPage => ({
  id: data.id,
  name: data.title,
  parentId: data.parentId,
  children: data.children.map((c) => generateNestedItem(c)),
  description: data.description,
  subject: data.schoolSubject,
});

const generateUnitItem = (data: TNestedItemPage): ISchoolUnit => ({
  id: data.id,
  title: data.name,
  parentId: data.parentId,
  description: data.description || null,
  children: data.children.map((c) => generateUnitItem(c)),
  schoolSubject: data.subject || null,
});

function UnitPage() {
  const { t } = useTranslation();
  const gradeId = useSearchParams('grade');
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
  } = useCreateCrudState<ISchoolUnit>();

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

  if (!gradeId && !subjectId) return null;

  const {
    data: units,
    refetch,
    isLoading,
  } = schoolUnitQueries.useGradeSubjectUnitsQuery({
    gradeSubjectId: Number(subjectId) || 0,
  });

  const handleRemoveUnit = async () => {
    try {
      await schoolUnitApi.removeSchoolUnit(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataDeletedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleUnitAction = async ({
    data,
  }: TSubmitHandlerData<ISchoolUnitPayloadForm>) => {
    const formPayload = {
      ...data,
      gradeSubjectId: subjectId ? Number(subjectId) : 0,
      gradeId: gradeId || null,
    };
    try {
      if (getSelectedData()?.id) {
        const payload = {
          ...formPayload,
          id: getSelectedData()?.id,
          parentId: getSelectedData()?.parentId || null,
        };
        await schoolUnitApi.updateGradeUnit(payload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const payload = {
          ...formPayload,
          parentId: parentId || null,
        };
        await schoolUnitApi.addGradeUnit(payload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const grade = units?.data[0]?.grade?.name || '';
  const subject = units?.data[0]?.gradeSubject?.name || '';

  return (
    <MultiLevelPageComponent
      data={units?.data?.map((u) => generateNestedItem(u)) || []}
      permissionName="Grade"
      form={
        <SchoolUnitForm
          editItem={getSelectedData()}
          onSubmit={(data) => handleUnitAction(data)}
        />
      }
      name={grade ? `${grade}-${subject}` : String(t('exams.units'))}
      title={grade ? `${grade}-${subject}` : String(t('exams.units'))}
      isLoading={isLoading}
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
  controllerName: ControllersNames.Grade,
});
