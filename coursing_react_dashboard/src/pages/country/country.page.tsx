/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import countryQueries from 'apis/country/country.queries';
import { ICountry, ICountryPayload } from 'apis/country/country.interfaces';
import { showSuccess } from 'libs/react.toastify';
import countryApi from 'apis/country/country.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import CountryForm from 'components/forms/country/country.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

function CountryPage() {
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
  } = useCreateCrudState<ICountry>();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { t } = useTranslation();
  const [showActionProgress, setShowActionProgress] = useState(false);
  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting({ actionId: id });
    },
    [dispatchDeleting],
  );

  const handleEditClick = useCallback(
    (data: ICountry) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const {
    data: countries,
    refetch,
    isLoading,
  } = countryQueries.useCountriesQuery({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleRemoveCountry = async () => {
    setShowActionProgress(true);

    try {
      await countryApi.removeCountry(getActionId());
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

  const handleCountryAction = async (
    payloadData: TSubmitHandlerData<ICountryPayload>,
  ) => {
    const { data } = payloadData;
    try {
      if (getSelectedData()?.id) {
        const payload = { ...data, id: getSelectedData()?.id };
        await countryApi.updateCountry(payload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        await countryApi.addCountry(data);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const columns = useMemo<MRT_ColumnDef<ICountry>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('countries.name'),
      },
    ],
    [t],
  );

  const CountryTable = GenericTablePage<ICountry>;

  return (
    <CountryTable
      form={
        <CountryForm
          editItem={getSelectedData()}
          onSubmit={(data) => handleCountryAction(data)}
        />
      }
      data={countries?.data || []}
      columns={columns}
      name={String(t('countries.country'))}
      title={String(t('countries.countries'))}
      isLoading={isLoading}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      handleRemoveClick={handleRemoveClick}
      handleDeleteSubmit={handleRemoveCountry}
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={countries?.totalRecords || 0}
      withActionProgress={showActionProgress}
      permissionName="Country"
      actionModalTitle={
        isEditing
          ? String(t('countries.editCountry'))
          : String(t('countries.addCountry'))
      }
    />
  );
}

export default ProtectPage({
  Page: CountryPage,
  controllerName: ControllersNames.Country,
});
