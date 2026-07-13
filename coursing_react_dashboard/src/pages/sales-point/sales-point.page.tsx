/* eslint-disable react/no-unstable-nested-components */
import { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { showSuccess } from 'libs/react.toastify';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import {
  ISalesPoint,
  ISalesPointPayload,
  ISalesPointPayloadForm,
} from 'apis/sales-point/sales-point.interfaces';
import salesPointQueries from 'apis/sales-point/sales-point.queries';
import salesPointApi from 'apis/sales-point/sales-point.api';
import SalesPointForm from 'components/forms/sales-point/sales-point.form';
import FilterAutoComplete from 'components/common/filter-auto-complete/filter-auto-complete.component';
import { TAutoComplete } from 'hooks/use-generic-form/types';
import cityQueries from 'apis/city/city.queries';
import routesNames from 'routes/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDateFromObject, ITime } from 'utils/helpers';
import useSearchParams from 'hooks/use-search-params/use-search-params';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

function SalesPointPage() {
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
  } = useCreateCrudState<ISalesPoint>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);

  const cityId = useSearchParams('city');

  const { state: cityName } = useLocation();

  const initialCity: TAutoComplete = { id: Number(cityId), name: cityName };

  const [city, setCity] = useState<TAutoComplete | null>(initialCity);

  const { data: options, isLoading: isLoadingCity } =
    cityQueries.useCitiesQuery({
      pageNumber: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });

  const navigate = useNavigate();

  const handleChangeCity = useCallback(
    (data: TAutoComplete | null) => {
      if (data?.id) {
        setCity(data);
        navigate(`${routesNames.salesPoint}?city=${data.id}`);
      } else {
        setCity(null);
        navigate(routesNames.salesPoint);
      }
    },
    [navigate],
  );

  const handleEditClick = useCallback(
    (data: ISalesPoint) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleDetailsClick = useCallback(
    (data: ISalesPoint) => {
      navigate(`${routesNames.salesPoint}/${data.id}`);
    },
    [navigate],
  );

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting(id);
    },
    [dispatchDeleting],
  );

  const {
    data: salesPoints,
    refetch,
    isLoading,
  } = salesPointQueries.useSalesPointQuery({
    cityId: city?.id,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleRemoveSalesPoint = async () => {
    setShowActionProgress(true);

    try {
      await salesPointApi.removeSalesPoint(getActionId());
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

  const handleSalesPointAction = async ({
    data,
  }: TSubmitHandlerData<ISalesPointPayloadForm>) => {
    try {
      const formPayload: ISalesPointPayload = {
        name: data.name,
        address: data.address,
        city: data.city.name,
        cityId: data.city.id,
        timeOfClose: {
          houres: new Date(data.timeOfClose).getHours(),
          minutes: new Date(data.timeOfClose).getMinutes(),
          seconds: new Date(data.timeOfClose).getSeconds(),
        },
        timeOfOpen: {
          houres: new Date(data.timeOfOpen).getHours(),
          minutes: new Date(data.timeOfOpen).getMinutes(),
          seconds: new Date(data.timeOfOpen).getSeconds(),
        },
      };
      if (getSelectedData()?.id) {
        const payload: ISalesPointPayload = {
          ...formPayload,
          salesPointId: getSelectedData()?.id,
        };
        await salesPointApi.updateSalesPoint(payload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        await salesPointApi.addSalesPoint(formPayload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<ISalesPoint>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('salesPoints.name'),
      },
      {
        accessorKey: 'address',
        header: t('salesPoints.address'),
      },
      {
        accessorKey: 'city',
        header: t('salesPoints.city'),
      },
      {
        accessorKey: 'timeOfOpen',
        header: t('salesPoints.timeOfOpen'),
        Cell: ({ cell }) => (
          <span>
            {new Date(
              getDateFromObject(cell.getValue<ITime>()),
            ).toLocaleTimeString()}{' '}
          </span>
        ),
      },
      {
        accessorKey: 'timeOfClose',
        header: t('salesPoints.timeOfClose'),
        Cell: ({ cell }) => (
          <span>
            {new Date(
              getDateFromObject(cell.getValue<ITime>()),
            ).toLocaleTimeString()}{' '}
          </span>
        ),
      },
    ],
    [t],
  );

  const SalesPointTable = GenericTablePage<ISalesPoint>;

  return (
    <SalesPointTable
      form={
        <SalesPointForm
          editItem={getSelectedData()!}
          onSubmit={handleSalesPointAction}
          cityId={city?.id || cityId || 0}
        />
      }
      columns={columns}
      data={salesPoints?.data || []}
      name={String(t('salesPoints.salesPoint'))}
      title={String(t('salesPoints.salesPoints'))}
      isLoading={isLoading}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveSalesPoint}
      handleAddClick={dispatchAdding}
      handleDetailsClick={handleDetailsClick}
      extra={
        <FilterAutoComplete
          defaultValue={city?.id || 0}
          onChange={handleChangeCity}
          value={city}
          isLoading={isLoadingCity}
          label={String(t('flters.filterByCity'))}
          options={options?.data || []}
        />
      }
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={salesPoints?.totalRecords || 0}
      withActionProgress={showActionProgress}
      actionModalTitle={
        isEditing
          ? String(t('salesPoints.editSalesPoint'))
          : String(t('salesPoints.addSalesPoint'))
      }
      permissionName="SalesPoint"
    />
  );
}

export default ProtectPage({
  Page: SalesPointPage,
  controllerName: ControllersNames.SalesPoint,
});
