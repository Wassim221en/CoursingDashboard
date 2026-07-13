/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import schoolSubjectQueries from 'apis/school-subject/school-subject.queries';
import {
  ISchoolSubject,
  ISchoolSubjectPayload,
} from 'apis/school-subject/school-subject.interfaces';
import { showSuccess } from 'libs/react.toastify';
import schoolSubjectApi from 'apis/school-subject/school-subject.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import prepareSchoolSubjectFormData from 'components/forms/school-subject/helper/prepare-school-subject-form-data';
import SchoolSubjectForm from 'components/forms/school-subject/school-subject.form';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

function SchoolSubjectPage() {
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
  } = useCreateCrudState<ISchoolSubject>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { t } = useTranslation();

  const [showActionProgress, setShowActionProgress] = useState(false);

  const handleEditClick = useCallback(
    (data: ISchoolSubject) => {
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
    data: subjectDetails,
    isLoading: isLoadingSubject,
    refetch: refetchDetails,
  } = schoolSubjectQueries.useSchoolSubjectDetailsQuery(
    getSelectedData()?.id || 0,
    !!getSelectedData()?.id,
  );

  const isDetailsLoaded =
    !isLoadingSubject && getSelectedData()?.id && subjectDetails;

  const {
    data: subjects,
    refetch,
    isLoading,
  } = schoolSubjectQueries.useSchoolSubjectsQuery({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleRemoveSubject = async () => {
    setShowActionProgress(true);

    try {
      await schoolSubjectApi.removeSchoolSubject(getActionId());
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

  const handleSubjectAction = async (
    payloadData: TSubmitHandlerData<ISchoolSubjectPayload>,
  ) => {
    const { data: formPayload, files, urlsForRemove } = payloadData;
    try {
      if (getSelectedData()?.id) {
        const payload = { ...formPayload, id: getSelectedData()?.id };
        const formData = prepareSchoolSubjectFormData({
          data: payload,
          files,
          urlsForRemove,
        });
        await schoolSubjectApi.updateSchoolSubject(formData);
        await refetch();
        await refetchDetails();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const formData = prepareSchoolSubjectFormData({
          data: formPayload,
          files,
          urlsForRemove,
        });
        await schoolSubjectApi.addSchoolSubject(formData);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<ISchoolSubject>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('subjects.name'),
      },
    ],
    [t],
  );

  const SubjectTable = GenericTablePage<ISchoolSubject>;

  return (
    <SubjectTable
      form={
        <SchoolSubjectForm
          editItem={isDetailsLoaded ? subjectDetails! : null}
          onSubmit={handleSubjectAction}
        />
      }
      columns={columns}
      data={subjects?.data || []}
      name={String(t('subjects.subject'))}
      title={String(t('subjects.subjects'))}
      isLoading={isLoading}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveSubject}
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={subjects?.totalRecords || 0}
      withActionProgress={showActionProgress}
      permissionName="SchoolingSubject"
      actionModalTitle={
        isEditing
          ? String(t('subjects.editSubject'))
          : String(t('subjects.addSubject'))
      }
      loadingActionModal={isLoadingSubject && !!getSelectedData()?.id}
    />
  );
}

export default ProtectPage({
  Page: SchoolSubjectPage,
  controllerName: ControllersNames.SchoolingSubject,
});
