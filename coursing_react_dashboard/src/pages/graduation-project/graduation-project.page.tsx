/* eslint-disable react/no-unstable-nested-components */
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import {
  IGraduationProject,
  IGraduationProjectPayload,
  IGraduationProjectPayloadForm,
} from 'apis/graduation-project/graduation-project.interfaces';
import GraduationProjectForm from 'components/forms/graduation-project/graduation-project.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import graduationProjectQueries from 'apis/graduation-project/graduation-project.queries';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import graduationProjectApi from 'apis/graduation-project/graduation-project.api';
import { showSuccess } from 'libs/react.toastify';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import { ControllersNames, Years } from 'constants/constants';
import prepareGraduationProjectFormData from 'components/forms/graduation-project/helper/prepare-graduation-project-form';
import FilterAutoComplete from 'components/common/filter-auto-complete/filter-auto-complete.component';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import routesNames from 'routes/constants';
import collegeQueries from 'apis/college/college.queries';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ProtectPage from 'components/common/protect-page/protectPage';

function GraduationProject() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
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
  } = useCreateCrudState<IGraduationProject>();

  const [showActionProgress, setShowActionProgress] = useState(false);

  const { state: collegeName } = useLocation();
  const navigate = useNavigate();

  const collegeId = searchParams.get('collegeId');

  const yearParam = searchParams.get('year');

  const initialColleges: TAutoComplete = {
    id: Number(collegeId),
    name: collegeName,
  };

  const initialYear: TAutoComplete = {
    id: Number(yearParam),
    name: collegeName,
  };

  const [college, setCollege] = useState<TAutoComplete | null>(initialColleges);

  const [Year, setYear] = useState<TAutoComplete | null>(initialYear);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: projects,
    refetch,
    isLoading: isLoadingProjects,
  } = graduationProjectQueries.useGraduationProjectByGradeIdQuery({
    collegeId: college?.id || null,
    year: Year?.id || null,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const { data: colleges, isLoading: isLoadingCollege } =
    collegeQueries.useCollegesQuery();

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting({ actionId: id });
    },
    [dispatchDeleting],
  );

  const handleEditClick = useCallback(
    (data: IGraduationProject) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleRemoveProject = async () => {
    setShowActionProgress(true);

    try {
      await graduationProjectApi.removeGraduationProject(getActionId());
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

  const handleProjectsAction = async (
    payloadData: TSubmitHandlerData<IGraduationProjectPayloadForm>,
  ) => {
    const { data, files, urlsForRemove } = payloadData;
    const formPayload: IGraduationProjectPayload = {
      ...data,
      collegeId: data.collegeId.id,
      year: data.year.id,
    };
    try {
      if (getSelectedData()?.id) {
        const payload = { ...formPayload, id: getSelectedData()?.id };
        const formData = prepareGraduationProjectFormData({
          data: payload,
          files,
          urlsForRemove,
        });
        await graduationProjectApi.updateGraduationProject(formData);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('yearlyProjects.projectEditedSuccessfully'));
      } else {
        const formData = prepareGraduationProjectFormData({
          data: formPayload,
          files,
          urlsForRemove,
        });
        await graduationProjectApi.addGraduationProject(formData);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('yearlyProjects.projectEditedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleChangeCollege = useCallback(
    (data: TAutoComplete | null) => {
      if (data?.id) {
        setCollege(data);
        navigate(`${routesNames.graduationProject}?collegeId=${data.id}`);
      } else {
        setCollege(null);
        navigate(routesNames.graduationProject);
      }
    },
    [navigate],
  );

  const handleChangeYear = useCallback(
    (data: TAutoComplete | null) => {
      if (data?.id) {
        setYear(data);
        setSearchParams(
          {
            ...Object.fromEntries(searchParams.entries()),
            year: data.id.toString(),
          },
          { replace: true },
        );
      } else {
        setYear(null);
        navigate(routesNames.graduationProject);
      }
    },
    [navigate, searchParams, setSearchParams],
  );

  const GraduationProjectTable = GenericTablePage<IGraduationProject>;

  const columns = useMemo<MRT_ColumnDef<IGraduationProject>[]>(
    () => [
      {
        accessorKey: 'college.name',
        header: t('yearlyProjects.college'),
      },
      {
        accessorKey: 'title',
        header: t('yearlyProjects.name'),
      },
      {
        accessorKey: 'description',
        header: t('yearlyProjects.description'),
      },
      {
        accessorKey: 'year',
        header: t('yearlyProjects.year'),
      },
    ],
    [t],
  );

  return (
    <GraduationProjectTable
      form={
        <GraduationProjectForm
          editItem={getSelectedData()}
          onSubmit={handleProjectsAction}
        />
      }
      data={projects?.data || []}
      columns={columns}
      name={String(t('yearlyProjects.yearlyProject'))}
      title={String(t('yearlyProjects.yearlyProjects'))}
      isLoading={isLoadingProjects}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveProject}
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={projects?.totalRecords || 0}
      withActionProgress={showActionProgress}
      actionModalTitle={
        isEditing
          ? String(t('yearlyProjects.editYearlyProject'))
          : String(t('yearlyProjects.addYearlyProject'))
      }
      detailsTooltip="Show Graduation Project"
      permissionName="GraduationProjects"
      extra={
        <Box display="flex" gap={1}>
          <FilterAutoComplete
            defaultValue={Number(collegeId) || 0}
            onChange={handleChangeCollege}
            value={college}
            isLoading={isLoadingCollege}
            label={String(t('flters.filterByColleges'))}
            options={colleges?.data || []}
          />
          <FilterAutoComplete
            defaultValue={Number(initialYear) || 1}
            onChange={handleChangeYear}
            value={Year}
            isLoading={isLoadingCollege}
            label={String(t('flters.filterByYear'))}
            options={Years.map((year) => ({
              id: year.id,
              name: t(year.name),
            }))}
            disabled={!colleges}
          />
        </Box>
      }
    />
  );
}

export default ProtectPage({
  Page: GraduationProject,
  controllerName: ControllersNames.GraduationProjects,
});
