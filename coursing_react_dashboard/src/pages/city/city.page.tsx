/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import cityQueries from 'apis/city/city.queries';
import { ICity, ICityPayloadForm } from 'apis/city/city.interfaces';
import { showSuccess } from 'libs/react.toastify';
import cityApi from 'apis/city/city.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import CityForm from 'components/forms/city/city.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

function CityPage() {
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
  } = useCreateCrudState<ICity>();

  const [showActionProgress, setShowActionProgress] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { t } = useTranslation();

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting({ actionId: id });
    },
    [dispatchDeleting],
  );

  const handleEditClick = useCallback(
    (data: ICity) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const {
    data: cities,
    refetch,
    isLoading,
  } = cityQueries.useCitiesQuery({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleRemoveCity = async () => {
    setShowActionProgress(true);

    try {
      await cityApi.removeCity(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.deleteSuccess', { var: t('cities.city') }));
      setShowActionProgress(false);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
      setShowActionProgress(false);
    }
  };

  const handleCityAction = async (
    payloadData: TSubmitHandlerData<ICityPayloadForm>,
  ) => {
    const { data } = payloadData;
    const formData = { ...data, countryId: data.countryId.id };

    try {
      if (getSelectedData()?.id) {
        const payload = { ...formData, id: getSelectedData()?.id };
        await cityApi.updateCity(payload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.updateSuccess', { var: t('cities.city') }));
      } else {
        await cityApi.addCity(formData);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.addSuccess', { var: t('cities.city') }));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<ICity>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('cities.name'),
      },
      {
        accessorKey: 'country.name',
        header: t('cities.country'),
      },
    ],
    [t],
  );

  const CityTable = GenericTablePage<ICity>;

  return (
    <CityTable
      form={
        <CityForm
          editItem={getSelectedData()}
          onSubmit={(data) => handleCityAction(data)}
        />
      }
      data={cities?.data || []}
      columns={columns}
      name={String(t('cities.city'))}
      title={String(t('cities.cities'))}
      isLoading={isLoading}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveCity}
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={cities?.totalRecords || 0}
      withActionProgress={showActionProgress}
      actionModalTitle={
        isEditing ? String(t('cities.editCity')) : String(t('cities.addCity'))
      }
      permissionName="City"
    />
  );
}

export default ProtectPage({
  Page: CityPage,
  controllerName: ControllersNames.City,
});
