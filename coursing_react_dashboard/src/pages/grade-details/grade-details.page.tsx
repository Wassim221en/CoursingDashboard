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
import { showSuccess } from 'libs/react.toastify';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import CellImage from 'components/common/cell-image/cell-image.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useNavigate, useParams } from 'react-router-dom';
import routesNames from 'routes/constants';
import GradeSubjectForm from 'components/forms/grade/grade-subject.form';
import gradeQueries from 'apis/grade/grade.queries';
import gradeApi from 'apis/grade/grade.api';
import {
  IGradeSubjectPayloadForm,
  IGradeSubjectPayload,
  IGradeSubject,
} from 'apis/grade/grade.interfaces';
import prepareGradeSubjectFormData from 'components/forms/grade/helper/prepare-grade-subject-form-data';
import { sanitizeHtml } from 'utils/helpers';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

function GradeDetailsPage() {
  const [showActionProgress, setShowActionProgress] = useState(false);

  const { t } = useTranslation();

  const navigate = useNavigate();

  const param = useParams();

  const gradeId = param.id;

  const [progress, setProgress] = useState<number>();

  const abortHandler = useRef<any>();

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
  } = useCreateCrudState<IGradeSubject>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleEditClick = useCallback(
    (data: IGradeSubject) => {
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
    (data: IGradeSubject) => {
      navigate(`${routesNames.schoolSubjectsDetails}?subject=${data.id}`);
    },
    [navigate],
  );

  const {
    data: subjectDetails,
    isLoading: isLoadingSubject,
    refetch: refetchDetails,
  } = gradeQueries.useGradeSubjectDetailsQuery(
    getSelectedData()?.id || 0,
    !!getSelectedData()?.id,
  );

  const isDetailsLoaded =
    !isLoadingSubject && getSelectedData()?.id && subjectDetails;

  const {
    data: subjects,
    refetch,
    isLoading,
  } = gradeQueries.useGradeSubjectsQuery(
    {
      gradeId: gradeId ? Number(gradeId) : 0,
      pageNumber: pagination.pageIndex,
      pageSize: pagination.pageSize,
    },
    false,
  );

  const handleRemoveSubject = async () => {
    setShowActionProgress(true);

    try {
      await gradeApi.removeGradeSubject(getActionId());
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
    onProgress: (p?: number) => void,
    abortHandlerRef: MutableRefObject<any>,
    {
      data,
      files,
      urlsForRemove,
    }: TSubmitHandlerData<IGradeSubjectPayloadForm>,
  ) => {
    const formPayload: IGradeSubjectPayload = {
      ...data,
      gradeId: Number(gradeId) ?? 0,
      schoolSubjectId: data.schoolSubjectId.id,
    };

    try {
      if (getSelectedData()?.id) {
        const payload = { ...formPayload, id: getSelectedData()?.id || 0 };
        const formData = prepareGradeSubjectFormData({
          data: payload,
          files,
          urlsForRemove,
        });
        await gradeApi.updateGradeSubject(formData, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        await refetchDetails();
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const formData = prepareGradeSubjectFormData({
          data: formPayload,
          files,
          urlsForRemove,
        });
        await gradeApi.addGradeSubject(formData, onProgress, (handler) => {
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

  const SubjectTable = GenericTablePage<IGradeSubject>;

  const columns = useMemo<MRT_ColumnDef<IGradeSubject>[]>(
    () => [
      {
        accessorKey: 'fileUrl',
        header: t('grades.image'),
        Cell: ({ cell }) => <CellImage imageSrc={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'description',
        header: t('grades.description'),
        Cell: ({ cell }) => sanitizeHtml(cell.getValue<string>()),
      },
      {
        accessorKey: 'subject.name',
        header: t('grades.gradeSubject'),
      },
    ],
    [t],
  );

  return (
    <SubjectTable
      form={
        <GradeSubjectForm
          editItem={isDetailsLoaded ? subjectDetails! : null}
          onSubmit={(data) =>
            handleSubjectAction(setProgress, abortHandler, data)
          }
          progress={progress}
          onAbortClick={abortHandler.current}
        />
      }
      columns={columns}
      data={subjects?.data || []}
      name={String(t('grades.gradeSubject'))}
      title={subjects?.data[0]?.grade?.name ?? t('grades.gradeSubjects')}
      isLoading={isLoading}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveSubject}
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      actionModalTitle={
        isEditing
          ? String(t('grades.editGradeSubject'))
          : String(t('grades.addGradeSubject'))
      }
      loadingActionModal={isLoadingSubject && !!getSelectedData()?.id}
      handleDetailsClick={handleDetailsClick}
      setPagination={setPagination}
      pagination={pagination}
      withActionProgress={showActionProgress}
      permissionName="Grade"
    />
  );
}

export default ProtectPage({
  Page: GradeDetailsPage,
  controllerName: ControllersNames.Grade,
});
