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
import universityQueries from 'apis/university/university.queries';
import {
  IUniversity,
  IUniversityPayloadForm,
} from 'apis/university/university.interfaces';
import { showSuccess } from 'libs/react.toastify';
import universityApi from 'apis/university/university.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import CellImage from 'components/common/cell-image/cell-image.component';
import prepareUniversityFormData from 'components/forms/university/helper/prepare-university-form-data';
import UniversityForm from 'components/forms/university/university.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useNavigate } from 'react-router-dom';
import routesNames from 'routes/constants';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

function UniversityPage() {
  const [showActionProgress, setShowActionProgress] = useState(false);

  const { t } = useTranslation();
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
  } = useCreateCrudState<IUniversity>();

  const handleEditClick = useCallback(
    (data: IUniversity) => {
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
    (data: IUniversity) => {
      navigate(`${routesNames.colleges}?university=${data.id}`, {
        state: data.name,
      });
    },
    [navigate],
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [progress, setProgress] = useState<number>();

  const abortHandler = useRef<any>();

  const {
    data: universityDetails,
    isLoading: isLoadingUniversity,
    refetch: refetchDetails,
  } = universityQueries.useUniversityDetailsQuery(getSelectedData()?.id || 0);

  const isDetailsLoaded =
    !isLoadingUniversity && getSelectedData()?.id && universityDetails;

  const {
    data: universities,
    refetch,
    isLoading,
  } = universityQueries.useUniversitiesQuery({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleRemoveUniversity = async () => {
    setShowActionProgress(true);

    try {
      await universityApi.removeUniversity(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.deleteSuccess', { var: t('students.university') }));
      setShowActionProgress(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowActionProgress(false);
    }
  };

  const handleUniversityAction = async (
    onProgress: (p?: number) => void,
    abortHandlerRef: MutableRefObject<any>,
    payloadData: TSubmitHandlerData<IUniversityPayloadForm>,
  ) => {
    const { data, files, urlsForRemove } = payloadData;
    const formPayload = {
      ...data,
      cityIds: data.cityIds.length ? data.cityIds.map((city) => city.id) : [],
    };
    try {
      if (getSelectedData()?.id) {
        const payload = { ...formPayload, id: getSelectedData()?.id };
        const formData = prepareUniversityFormData({
          data: payload,
          files,
          urlsForRemove,
        });
        await universityApi.updateUniversity(
          formData,
          onProgress,
          (handler) => {
            abortHandlerRef.current = handler;
          },
        );
        await refetchDetails();
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const formData = prepareUniversityFormData({
          data: formPayload,
          files,
          urlsForRemove,
        });
        await universityApi.addUniversity(formData, onProgress, (handler) => {
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

  const columns = useMemo<MRT_ColumnDef<IUniversity>[]>(
    () => [
      {
        accessorKey: 'fileUrl',
        header: t('universities.image'),
        Cell: ({ cell }) => (
          <CellImage
            imageSrc={
              cell.getValue<string>()?.length
                ? cell.getValue<string>()
                : '/assets/images/book.png'
            }
          />
        ),
        muiTableBodyCellProps: { sx: { textAlign: 'start' } },
      },
      {
        accessorKey: 'name',
        header: t('universities.name'),
      },
    ],
    [t],
  );

  const UniversityTable = GenericTablePage<IUniversity>;

  return (
    <UniversityTable
      form={
        <UniversityForm
          editItem={isDetailsLoaded ? universityDetails! : null}
          progress={progress}
          onAbortClick={abortHandler.current}
          onSubmit={(data) =>
            handleUniversityAction(setProgress, abortHandler, data)
          }
        />
      }
      columns={columns}
      data={universities?.data || []}
      name={String(t('universities.university'))}
      title={String(t('universities.universities'))}
      isLoading={isLoading}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveUniversity}
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={universities?.totalRecords || 0}
      withActionProgress={showActionProgress}
      permissionName="University"
      actionModalTitle={
        isEditing
          ? String(t('universities.editUniversity'))
          : String(t('universities.addUniversity'))
      }
      loadingActionModal={isLoadingUniversity && !!getSelectedData()?.id}
      handleDetailsClick={handleDetailsClick}
      detailsTooltip="Show Colleges"
    />
  );
}

export default ProtectPage({
  Page: UniversityPage,
  controllerName: ControllersNames.University,
});
