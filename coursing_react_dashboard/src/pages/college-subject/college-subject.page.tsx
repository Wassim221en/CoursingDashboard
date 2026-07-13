/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import collegeSubjectQueries from 'apis/college-subject/college-subject.queries';
import {
  ICollegeSubject,
  ICollegeSubjectPayloadForm,
} from 'apis/college-subject/college-subject.interfaces';
import { showSuccess } from 'libs/react.toastify';
import collegeSubjectApi from 'apis/college-subject/college-subject.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import prepareCollegeSubjectFormData from 'components/forms/college-subject/helper/prepare-college-subject-form-data';
import CollegeSubjectForm from 'components/forms/college-subject/college-subject.form';
import routesNames from 'routes/constants';
import { useNavigate } from 'react-router-dom';
import FilterAutoComplete from 'components/common/filter-auto-complete/filter-auto-complete.component';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import collegeQueries from 'apis/college/college.queries';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

function CollegeSubjectPage() {
  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);
  const navigate = useNavigate();

  const collegeId = useSearchParams('college');

  const [college, setCollege] = useState<TAutoComplete | null>(null);

  useEffect(() => {
    if (collegeId) {
      setCollege({
        id: Number(collegeId),
        name: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: options, isLoading: isLoadingCollege } =
    collegeQueries.useCollegesQuery();

  const {
    dispatchAdding,
    dispatchDeleting,
    dispatchResetCrudState,
    getSelectedData,
    isAdding,
    isDeleting,
    getActionId,
    isEditing,
  } = useCreateCrudState<ICollegeSubject>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting(id);
    },
    [dispatchDeleting],
  );

  const handleChangeCollege = useCallback(
    (data: TAutoComplete | null) => {
      if (data?.id) {
        setCollege(data);
        navigate(`${routesNames.collegeSubjects}?college=${data.id}`);
      } else {
        setCollege(null);
        navigate(routesNames.collegeSubjects);
      }
    },
    [navigate],
  );

  const {
    data: subjectDetails,
    isLoading: isLoadingSubject,
    refetch: refetchDetails,
  } = collegeSubjectQueries.useCollegeSubjectDetailsQuery(
    getSelectedData()?.id || 0,
    !!getSelectedData()?.id,
  );

  const {
    data: subjects,
    refetch,
    isLoading,
  } = collegeSubjectQueries.useCollegeSubjectsQuery({
    collegeId: Number(collegeId) || 0,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleRemoveSubject = async () => {
    setShowActionProgress(true);

    try {
      await collegeSubjectApi.removeCollegeSubject(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.deleteSuccess', { var: t('exams.subject') }));
      setShowActionProgress(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowActionProgress(false);
    }
  };

  const handleSubjectAction = async ({
    data,
    files,
    urlsForRemove,
  }: TSubmitHandlerData<ICollegeSubjectPayloadForm>) => {
    try {
      if (getSelectedData()?.id) {
        const payload = { ...data, id: getSelectedData()?.id };
        const formData = prepareCollegeSubjectFormData({
          data: payload,
          files,
          urlsForRemove,
        });
        await collegeSubjectApi.updateCollegeSubject(formData);
        await refetchDetails();
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const formData = prepareCollegeSubjectFormData({
          data,
          files,
          urlsForRemove,
        });
        await collegeSubjectApi.addCollegeSubject(formData);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<ICollegeSubject>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('subjects.name'),
      },
    ],
    [t],
  );

  const SubjectTable = GenericTablePage<ICollegeSubject>;

  return (
    <SubjectTable
      form={
        <CollegeSubjectForm
          editItem={subjectDetails}
          onSubmit={handleSubjectAction}
        />
      }
      columns={columns}
      data={subjects?.data || []}
      name={String(t('subjects.subject'))}
      title={String(t('subjects.subjects'))}
      isLoading={isLoading}
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
      actionModalTitle={
        isEditing
          ? String(t('subjects.editSubject'))
          : String(t('subjects.addSubject'))
      }
      loadingActionModal={isLoadingSubject && !!getSelectedData()?.id}
      detailsTooltip="Subject Details"
      withActionProgress={showActionProgress}
      permissionName="College"
      extra={
        <FilterAutoComplete
          defaultValue={college?.id || 0}
          onChange={handleChangeCollege}
          value={college}
          isLoading={isLoadingCollege}
          label={String(t('flters.filterByColleges'))}
          options={options?.data || []}
        />
      }
    />
  );
}

export default ProtectPage({
  Page: CollegeSubjectPage,
  controllerName: ControllersNames.College,
});
