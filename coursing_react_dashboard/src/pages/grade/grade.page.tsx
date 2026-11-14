/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import React, {
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { Box, Chip, Typography } from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { useQueryClient } from '@tanstack/react-query';
import gradeQueries from 'apis/grade/grade.queries';
import educationalLevelQueries from 'apis/educational-level/educational-level.queries';
import {
  IGrade,
  IGradePayload,
  IGradePayloadForm,
} from 'apis/grade/grade.interfaces';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import FilterAutoComplete from 'components/common/filter-auto-complete/filter-auto-complete.component';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import routesNames from 'routes/constants';
import { showSuccess } from 'libs/react.toastify';
import gradeApi from 'apis/grade/grade.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import GradeForm from 'components/forms/grade/grade.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import prepareGradeFormData from 'components/forms/grade/helper/prepare-grade-formdata';
import CellImage from 'components/common/cell-image/cell-image.component';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

const LEVEL_FILTER_KEY = 'level';

/**
 * Builds the API payload from the form values.
 * - `order` is only sent when the user typed one (the backend rejects 0 and
 *   puts the grade last when it is missing).
 * - When a grade moves to another level without a new order, the old order is
 *   dropped: it belongs to the previous level, so the grade goes last instead
 *   of taking a stale slot in the new level.
 */
const buildGradePayload = (
  data: IGradePayloadForm,
  selected: IGrade | null,
): IGradePayload => {
  const levelId = data.educationLevel?.id || undefined;
  const rawOrder = data.order === '' ? NaN : Number(data.order);
  // Anything below 1 is treated as "not specified" (the API rejects 0).
  let order = rawOrder >= 1 ? Math.floor(rawOrder) : undefined;

  const levelChanged =
    !!selected &&
    levelId !== undefined &&
    levelId !== (selected.educationLevelId ?? undefined);
  if (levelChanged && order === selected?.order) order = undefined;

  return {
    ...(selected?.id ? { id: selected.id } : {}),
    name: data.name,
    educationLevelId: levelId,
    order,
  };
};

function GradePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showActionProgress, setShowActionProgress] = useState(false);

  const navigate = useNavigate();
  const levelFilterId = useSearchParams(LEVEL_FILTER_KEY);
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
  } = useCreateCrudState<IGrade>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [progress, setProgress] = useState<number>();

  const abortHandler = useRef<any>();

  const handleEditClick = useCallback(
    (data: IGrade) => {
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

  const handleDetailsClick = useCallback(
    (data: IGrade) => {
      navigate(`/grade/${data.id}`, {
        state: data.name,
      });
    },
    [navigate],
  );

  const { data: educationalLevels, isLoading: isLoadingLevels } =
    educationalLevelQueries.useEducationalLevelsQuery();

  const levelNames = useMemo(
    () => new Map((educationalLevels?.data || []).map((l) => [l.id, l.name])),
    [educationalLevels],
  );

  const levelFilter = useMemo<TAutoComplete | null>(
    () =>
      levelFilterId
        ? {
            id: levelFilterId,
            name: levelNames.get(levelFilterId) || '',
          }
        : null,
    [levelFilterId, levelNames],
  );

  const handleChangeLevelFilter = useCallback(
    (level: TAutoComplete | null) => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      navigate(
        level?.id
          ? `${routesNames.grades}?${LEVEL_FILTER_KEY}=${level.id}`
          : routesNames.grades,
      );
    },
    [navigate],
  );

  const { data: grades, isLoading } = gradeQueries.useGradesQuery({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
    educationLevelId: levelFilterId || undefined,
  });

  // Any add / edit / remove can shift the order of other grades (and the
  // grades listed under their level), so refetch instead of patching locally.
  const refreshGrades = useCallback(
    () =>
      Promise.all([
        queryClient.invalidateQueries(['get-grades']),
        queryClient.invalidateQueries(['get-educationalLevel-by-id']),
      ]),
    [queryClient],
  );

  const handleRemoveGrade = async () => {
    setShowActionProgress(true);

    try {
      await gradeApi.removeGrade(getActionId());
      await refreshGrades();
      dispatchResetCrudState();
      showSuccess(t('common.dataDeletedSuccessfully'));
      setShowActionProgress(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowActionProgress(false);
    }
  };

  const handleGradeAction = async (
    onProgress: (p?: number) => void,
    abortHandlerRef: MutableRefObject<any>,
    FormPayload: TSubmitHandlerData<IGradePayloadForm>,
  ) => {
    const { data, files, urlsForRemove } = FormPayload;
    try {
      if (getSelectedData()?.id) {
        const payload = buildGradePayload(data, getSelectedData());
        const formData = prepareGradeFormData({
          data: payload,
          files,
          urlsForRemove,
        });
        await gradeApi.updateGrade(formData, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        await refreshGrades();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const formData = prepareGradeFormData({
          data: buildGradePayload(data, null),
          files,
          urlsForRemove,
        });
        await gradeApi.addGrade(formData, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        await refreshGrades();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<IGrade>[]>(
    () => [
      {
        accessorKey: 'imageUrl',
        header: t('universities.image'),
        Cell: ({ cell }) =>
          cell.getValue<string>() ? (
            <CellImage imageSrc={cell.getValue<string>()} />
          ) : (
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '4px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'action.hover',
                color: 'text.disabled',
              }}
            >
              <SchoolOutlinedIcon fontSize="small" />
            </Box>
          ),
      },
      {
        accessorKey: 'name',
        header: t('grades.name'),
      },
      {
        accessorKey: 'educationLevelId',
        header: t('grades.educationalLevel'),
        Cell: ({ cell }) => {
          const levelName = levelNames.get(cell.getValue<number>());
          return levelName ? (
            <Chip label={levelName} size="small" variant="outlined" />
          ) : (
            <Typography variant="body2" color="text.disabled">
              {t('grades.noLevel')}
            </Typography>
          );
        },
      },
      {
        accessorKey: 'order',
        header: t('grades.order'),
        size: 80,
        Cell: ({ cell }) =>
          cell.getValue<number | null>() ? (
            <Chip
              label={cell.getValue<number>()}
              size="small"
              color="primary"
              sx={{ minWidth: 32, fontWeight: 600 }}
            />
          ) : (
            <Typography variant="body2" color="text.disabled">
              —
            </Typography>
          ),
      },
    ],
    [t, levelNames],
  );

  const GradeTable = GenericTablePage<IGrade>;

  return (
    <GradeTable
      form={
        <GradeForm
          editItem={getSelectedData()}
          defaultEducationLevelId={levelFilterId || undefined}
          onSubmit={(data) =>
            handleGradeAction(setProgress, abortHandler, data)
          }
          progress={progress}
          onAbortClick={abortHandler.current}
        />
      }
      columns={columns}
      data={grades?.data || []}
      name={String(t('grades.grade'))}
      title={String(t('grades.grades'))}
      isLoading={isLoading}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveGrade}
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={grades?.totalRecords || 0}
      withActionProgress={showActionProgress}
      actionModalTitle={
        isEditing ? String(t('grades.editGrade')) : String(t('grades.addGrade'))
      }
      handleDetailsClick={handleDetailsClick}
      detailsTooltip="Show Subjects"
      permissionName="Grade"
      loadingActionModal={isLoadingLevels}
      extra={
        <FilterAutoComplete
          defaultValue={levelFilterId}
          onChange={handleChangeLevelFilter}
          value={levelFilter}
          isLoading={isLoadingLevels}
          label={String(t('grades.filterByEducationalLevel'))}
          options={educationalLevels?.data || []}
        />
      }
    />
  );
}

export default ProtectPage({
  Page: GradePage,
  controllerName: ControllersNames.Grade,
});
