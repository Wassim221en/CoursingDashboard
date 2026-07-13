/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import React, { useCallback } from 'react';
import faqQueries from 'apis/faq/faq.queries';
import { IFaq, IFaqPayload } from 'apis/faq/faq.interfaces';
import { showSuccess } from 'libs/react.toastify';
import faqApi from 'apis/faq/faq.api';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import FaqForm from 'components/forms/faq/faq.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import PageContainer from 'components/common/page-container/page-container.component';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import NoData from 'components/common/no-data/no-data.component';
import CollapseList from 'components/common/collapse-list/collapse-list.component';
import { TCollapseItem } from 'components/common/collapse-list/components/collapse-item/collapse-item.component';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

function FaqPage() {
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
  } = useCreateCrudState<IFaq>();

  const { t } = useTranslation();

  const handleEditClick = useCallback(
    (data: TCollapseItem) => {
      dispatchEditing({
        selectedData: {
          id: data.id,
          answer: data.description,
          question: data.title,
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

  const { data: faqs, refetch, isLoading } = faqQueries.useFaqsQuery();

  const noData = !faqs?.data.length && !isLoading;

  const handleRemoveFaq = async () => {
    try {
      await faqApi.removeFaq(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataDeletedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleFaqAction = async ({
    data: formPayload,
  }: TSubmitHandlerData<IFaqPayload>) => {
    try {
      if (getSelectedData()?.id) {
        const payload = { ...formPayload, id: getSelectedData()?.id };
        await faqApi.updateFaq(payload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        await faqApi.addFaq(formPayload);
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
      title={String(t('faqs.faqs'))}
      name={String(t('faqs.faq'))}
      handleAddClick={dispatchAdding}
      actionModalTitle={
        isEditing ? String(t('faqs.editFaq')) : String(t('faqs.addFaq'))
      }
      handleDeleteSubmit={handleRemoveFaq}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      form={<FaqForm editItem={getSelectedData()} onSubmit={handleFaqAction} />}
      permissionName="FAQ"
    >
      {isLoading && <LoadingPlaceholder />}
      {noData && <NoData />}
      <CollapseList
        items={
          faqs?.data.map((faq) => ({
            id: faq?.id,
            title: faq?.question,
            description: faq?.answer,
          })) || []
        }
        handleEditClick={handleEditClick}
        handleRemoveClick={handleRemoveClick}
        permissionName="FAQ"
      />
    </PageContainer>
  );
}

export default ProtectPage({
  Page: FaqPage,
  controllerName: ControllersNames.FAQ,
});
