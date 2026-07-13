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
import gradeQueries from 'apis/grade/grade.queries';
import { IGrade, IGradePayloadForm } from 'apis/grade/grade.interfaces';
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

function GradePage() {
  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);

  const navigate = useNavigate();
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

  const {
    data: grades,
    refetch,
    isLoading,
  } = gradeQueries.useGradesQuery({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleRemoveGrade = async () => {
    setShowActionProgress(true);

    try {
      await gradeApi.removeGrade(getActionId());
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

  const handleGradeAction = async (
    onProgress: (p?: number) => void,
    abortHandlerRef: MutableRefObject<any>,
    FormPayload: TSubmitHandlerData<IGradePayloadForm>,
  ) => {
    const { data, files, urlsForRemove } = FormPayload;
    try {
      if (getSelectedData()?.id) {
        const payload = { ...data, id: getSelectedData()?.id };
        const formData = prepareGradeFormData({
          data: payload,
          files,
          urlsForRemove,
        });
        await gradeApi.updateGrade(formData, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const formData = prepareGradeFormData({
          data,
          files,
          urlsForRemove,
        });
        await gradeApi.addGrade(formData, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        await refetch();
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
        Cell: ({ cell }) => <CellImage imageSrc={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'name',
        header: t('grades.name'),
      },
    ],
    [t],
  );

  const GradeTable = GenericTablePage<IGrade>;

  return (
    <GradeTable
      form={
        <GradeForm
          editItem={getSelectedData()}
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
    />
  );
}

export default ProtectPage({
  Page: GradePage,
  controllerName: ControllersNames.Grade,
});
