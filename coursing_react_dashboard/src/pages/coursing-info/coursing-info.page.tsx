/* eslint-disable react/no-unstable-nested-components */
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { showSuccess } from 'libs/react.toastify';
import { useTranslation } from 'react-i18next';
import ProtectPage from 'components/common/protect-page/protectPage';
import { ControllersNames } from 'constants/constants';
import {
  ICoursingInfo,
  ICoursingInfoPayload,
} from 'apis/coursing-Info/coursing-info.interfaces';
import CoursingInfoForm from 'components/forms/coursing-info/coursing-info.form';
import coursingInfoApis from 'apis/coursing-Info/coursing-info.api';
import coursingInfoQueries from 'apis/coursing-Info/coursing-info.queries';
import { Link } from 'react-router-dom';
import useDebounce from 'hooks/use-debounce/useDebounce';
import FilterString from 'components/common/filter-string/filter-string.component';

function ContactInfo() {
  const {
    dispatchEditing,
    dispatchResetCrudState,
    getSelectedData,
    isDeleting,
    isAdding,
    isEditing,
  } = useCreateCrudState<ICoursingInfo>();

  const { t } = useTranslation();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [query, setQuery] = useState('');

  const queryString = useDebounce(query, 500);

  const {
    data: coursingInfo,
    isLoading: isLoadingCoursingInfo,
    refetch,
  } = coursingInfoQueries.useGetAllCoursingInfo({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
    search: queryString?.trim(),
  });

  const handleEditClick = useCallback(
    (data: ICoursingInfo) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleChangeValue = async ({
    data,
  }: TSubmitHandlerData<ICoursingInfoPayload>) => {
    try {
      const payload = {
        ...data,
        id: getSelectedData()?.id!,
        key: getSelectedData()?.key,
      };

      await coursingInfoApis.updateCoursingInfo(payload);
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataUpdatedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const CoursingInfoTable = GenericTablePage<ICoursingInfo>;

  const columns = useMemo<MRT_ColumnDef<ICoursingInfo>[]>(
    () => [
      {
        accessorKey: 'key',
        header: t('privacyAndTerms.key'),
      },
      {
        accessorKey: 'description',
        header: t('reports.description'),
      },
      {
        accessorKey: 'url',
        header: t('coursingInfo.youtubeLink'),
        Cell: ({ cell }) => (
          <Link to={cell.getValue<string>()}>{cell.getValue<string>()}</Link>
        ),
      },
    ],
    [t],
  );

  return (
    <CoursingInfoTable
      form={
        <CoursingInfoForm
          onSubmit={handleChangeValue}
          editItem={getSelectedData()}
        />
      }
      data={coursingInfo?.data || []}
      columns={columns}
      name={String(t('coursingInfo.coursingInfo'))}
      title={t('coursingInfo.coursingInfo')}
      isLoading={isLoadingCoursingInfo}
      handleEditClick={handleEditClick}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      actionModalTitle={
        isEditing ? getSelectedData()?.key.toLocaleUpperCase() : ''
      }
      setPagination={setPagination}
      pagination={pagination}
      totalRecords={coursingInfo?.totalRecords || 0}
      permissionName="forceAllow"
      extra={<FilterString query={query} setQuery={setQuery} />}
    />
  );
}

export default ProtectPage({
  Page: ContactInfo,
  controllerName: ControllersNames.ContactInfo,
});
