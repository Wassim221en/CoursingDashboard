/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback } from 'react';
import { showSuccess } from 'libs/react.toastify';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import PageContainer from 'components/common/page-container/page-container.component';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import NoData from 'components/common/no-data/no-data.component';
import CollapseList from 'components/common/collapse-list/collapse-list.component';
import { useTranslation } from 'react-i18next';
import { ControllersNames, PrivacyAndTerms } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';
import {
  IPrivacyAndTerms,
  IPrivacyAndTermsPayload,
  IPrivacyAndTermsPayloadForm,
} from 'apis/privacyAndTerms/privacyAndTerms.interfaces';
import PrivacyAndTermsQueries from 'apis/privacyAndTerms/privacyAndTerms.queries';
import PrivacyAndTermsApis from 'apis/privacyAndTerms/privacyAndTerms.api';
import PrivacyAndTermsForm from 'components/forms/privacy-and-terms/privacy-and-terms.form';
import { getNameById } from 'hooks/use-generic-form/helpers';
import preparePrivacyAndTermsFormData from 'components/forms/privacy-and-terms/helper/prepare-privacy-and-terms-form-data';

function PrivacyAndtermsPage() {
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
  } = useCreateCrudState<IPrivacyAndTerms>();

  const { t } = useTranslation();

  const handleEditClick = useCallback(
    (data) => {
      dispatchEditing({
        selectedData: {
          id: data.id,
          key: data.title,
          value: data.description,
        },
      });
    },
    [dispatchEditing],
  );

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting(id);
    },
    [dispatchDeleting],
  );

  const {
    data: privacyAndTerms,
    isLoading,
    refetch,
  } = PrivacyAndTermsQueries.usePrivacyAndTermsQuery();

  const noData = !privacyAndTerms?.length && !isLoading;

  const handleRemovePrivacyAndTerms = async () => {
    try {
      await PrivacyAndTermsApis.removePrivacyAndTerms(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataDeletedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handlePrivacyAndTermsAction = async ({
    data,
  }: TSubmitHandlerData<IPrivacyAndTermsPayloadForm>) => {
    const payloadData: IPrivacyAndTermsPayload = {
      ...data,
      key: data.key.id,
    };

    try {
      if (getSelectedData()?.id) {
        const payload = { ...payloadData, id: getSelectedData()?.id };
        const formDataPayload = preparePrivacyAndTermsFormData({
          data: payload,
        });
        await PrivacyAndTermsApis.updatePrivacyAndTerms(formDataPayload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const formDataPayload = preparePrivacyAndTermsFormData({
          data: payloadData,
        });
        await PrivacyAndTermsApis.addPrivacyAndTerms(formDataPayload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataAddedSuccessfully'));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <PageContainer
      title={String(t('privacyAndTerms.privacyAndTerms'))}
      name={String(t('privacyAndTerms.privacyAndTerms'))}
      handleAddClick={dispatchAdding}
      actionModalTitle={
        isEditing
          ? String(t('privacyAndTerms.editPrivacyAndTerms'))
          : String(t('privacyAndTerms.addPrivacyAndTerms'))
      }
      handleDeleteSubmit={handleRemovePrivacyAndTerms}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      form={
        <PrivacyAndTermsForm
          editItem={getSelectedData()}
          onSubmit={handlePrivacyAndTermsAction}
        />
      }
      permissionName="Privacy"
    >
      {isLoading && <LoadingPlaceholder />}
      {noData && <NoData />}
      <CollapseList
        items={
          privacyAndTerms?.map((item) => ({
            id: item?.id,
            title: t(getNameById(PrivacyAndTerms, String(item.key))),
            description: item?.value,
          })) || []
        }
        handleEditClick={handleEditClick as any}
        handleRemoveClick={handleRemoveClick}
        permissionName="Privacy"
      />
    </PageContainer>
  );
}

export default ProtectPage({
  Page: PrivacyAndtermsPage,
  controllerName: ControllersNames.Privacy,
});
