/* eslint-disable react/no-unstable-nested-components */
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { showSuccess } from 'libs/react.toastify';
import { useTranslation } from 'react-i18next';

import {
  IContactInfo,
  IContactInfoPayload,
} from 'apis/contact-info/contact-info.interfaces';
import contactInfoQueries from 'apis/contact-info/contact-info.queries';
import ContactInfoForm from 'components/forms/contact-info/contact-info.form';
import contactInfoApis from 'apis/contact-info/contact-info.api';
import ProtectPage from 'components/common/protect-page/protectPage';
import { ControllersNames } from 'constants/constants';

function ContactInfo() {
  const {
    dispatchEditing,
    dispatchResetCrudState,
    getSelectedData,
    isDeleting,
    isAdding,
    isEditing,
  } = useCreateCrudState<IContactInfo>();

  const { t } = useTranslation();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: contactInfo,
    isLoading: isLoadingContactInfo,
    refetch,
  } = contactInfoQueries.useContactInfoQuery({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleEditClick = useCallback(
    (data: IContactInfo) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleChangeContactValue = async ({
    data,
  }: TSubmitHandlerData<IContactInfoPayload>) => {
    try {
      const payload = {
        ...data,
        key: getSelectedData()?.key!,
        id: getSelectedData()?.id!,
      };

      await contactInfoApis.updateAllContactInfo(payload);
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataUpdatedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const ContactInfoTable = GenericTablePage<IContactInfo>;

  const columns = useMemo<MRT_ColumnDef<IContactInfo>[]>(
    () => [
      {
        accessorKey: 'key',
        header: t('privacyAndTerms.key'),
      },
      {
        accessorKey: 'value',
        header: t('privacyAndTerms.value'),
      },
    ],
    [t],
  );

  return (
    <ContactInfoTable
      form={
        <ContactInfoForm
          onSubmit={handleChangeContactValue}
          editItem={getSelectedData()}
        />
      }
      data={contactInfo?.data || []}
      columns={columns}
      name={String(t('contactInfo.contactInfo'))}
      title={t('contactInfo.contactInfo')}
      isLoading={isLoadingContactInfo}
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
      totalRecords={contactInfo?.totalRecords || 0}
      permissionName="forceAllow"
    />
  );
}

export default ProtectPage({
  Page: ContactInfo,
  controllerName: ControllersNames.ContactInfo,
});
