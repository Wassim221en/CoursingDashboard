/* eslint-disable react/no-unstable-nested-components */
import React, {
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import collegeQueries from 'apis/college/college.queries';
import { ICollege, ICollegePayloadForm } from 'apis/college/college.interfaces';
import { showSuccess } from 'libs/react.toastify';
import collegeApi from 'apis/college/college.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import CellImage from 'components/common/cell-image/cell-image.component';
import prepareCollegeFormData from 'components/forms/college/helper/prepare-college-form-data';
import CollegeForm from 'components/forms/college/college.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useLocation, useNavigate } from 'react-router-dom';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import universityQueries from 'apis/university/university.queries';
import FilterAutoComplete from 'components/common/filter-auto-complete/filter-auto-complete.component';
import routesNames from 'routes/constants';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

function CollegePage() {
  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);
  const { state: universityName } = useLocation();
  const navigate = useNavigate();
  const universityId = useSearchParams('university');

  const initialUniversity: TAutoComplete = {
    id: Number(universityId),
    name: universityName,
  };

  const [university, setUniversity] = useState<TAutoComplete | null>(
    initialUniversity,
  );

  const [progress, setProgress] = useState<number>();

  const abortHandler = useRef<any>();

  const { data: options, isLoading: isLoadingUniversity } =
    universityQueries.useUniversitiesQuery();

  const handleChangeUniversity = useCallback(
    (data: TAutoComplete | null) => {
      if (data?.id) {
        setUniversity(data);
        navigate(`${routesNames.colleges}?university=${data.id}`);
      } else {
        setUniversity(null);
        navigate(routesNames.colleges);
      }
    },
    [navigate],
  );

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
  } = useCreateCrudState<ICollege>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleEditClick = useCallback(
    (data: ICollege) => {
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
    (data: ICollege) => {
      navigate(`${routesNames.colleges}/${data.id}`);
    },
    [navigate],
  );

  const {
    data: collegeDetails,
    isLoading: isLoadingCollege,
    refetch: refetchDetails,
  } = collegeQueries.useCollegeDetailsQuery(getSelectedData()?.id || 0);

  const isDetailsLoaded =
    !isLoadingCollege && getSelectedData()?.id && collegeDetails;

  const {
    data: colleges,
    refetch,
    isLoading,
  } = collegeQueries.useCollegesQuery({
    universityId: Number(universityId) || university?.id || 0,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleRemoveCollege = async () => {
    setShowActionProgress(true);

    try {
      await collegeApi.removeCollege(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(
        t('common.deleteSuccess', { var: t('universities.college') }),
      );
      setShowActionProgress(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowActionProgress(false);
    }
  };

  const handleCollegeAction = async (
    onProgress: (p?: number) => void,
    abortHandlerRef: MutableRefObject<any>,
    payloadData: TSubmitHandlerData<ICollegePayloadForm>,
  ) => {
    const { data, files, urlsForRemove } = payloadData;
    const formPayload = {
      ...data,
      universityId: data.universityId?.id || null,
    };
    try {
      if (getSelectedData()?.id) {
        const payload = { ...formPayload, id: getSelectedData()?.id };
        const formData = prepareCollegeFormData({
          data: payload,
          files,
          urlsForRemove,
        });
        await collegeApi.updateCollege(formData, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        await refetch();
        await refetchDetails();
        dispatchResetCrudState();
        showSuccess(
          t('common.updateSuccess', { var: t('universities.college') }),
        );
      } else {
        const formData = prepareCollegeFormData({
          data: formPayload,
          files,
          urlsForRemove,
        });
        await collegeApi.addCollege(formData, onProgress, (handler) => {
          abortHandlerRef.current = handler;
        });
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.addSuccess', { var: t('universities.college') }));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<ICollege>[]>(
    () => [
      {
        accessorKey: 'filesUrl',
        header: t('universities.image'),
        Cell: ({ cell }) => (
          <CellImage
            imageSrc={
              cell.getValue<string>()[0]?.length
                ? cell.getValue<string[]>()[0]
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
      {
        accessorKey: 'university.name',
        header: t('universities.university'),
      },
    ],
    [t],
  );

  const CollegeTable = GenericTablePage<ICollege>;

  return (
    <CollegeTable
      form={
        <CollegeForm
          editItem={isDetailsLoaded ? collegeDetails! : null}
          onSubmit={(data) =>
            handleCollegeAction(setProgress, abortHandler, data)
          }
          progress={progress}
          onAbortClick={abortHandler.current}
          universityId={universityId || initialUniversity.id || 0}
        />
      }
      columns={columns}
      data={colleges?.data || []}
      name={String(t('universities.college'))}
      title={String(t('universities.colleges'))}
      isLoading={isLoading}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveCollege}
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      actionModalTitle={
        isEditing
          ? String(t('universities.editCollege'))
          : String(t('universities.addCollege'))
      }
      loadingActionModal={isLoadingCollege && !!getSelectedData()?.id}
      handleDetailsClick={handleDetailsClick}
      detailsTooltip="Show Subjects"
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={colleges?.totalRecords || 0}
      withActionProgress={showActionProgress}
      permissionName="College"
      extra={
        <FilterAutoComplete
          defaultValue={Number(universityId) || 0}
          onChange={handleChangeUniversity}
          value={university}
          isLoading={isLoadingUniversity}
          label={String(t('flters.filterBYUniversity'))}
          options={options?.data || []}
          disabled={!!universityName}
        />
      }
    />
  );
}

export default ProtectPage({
  Page: CollegePage,
  controllerName: ControllersNames.College,
});
