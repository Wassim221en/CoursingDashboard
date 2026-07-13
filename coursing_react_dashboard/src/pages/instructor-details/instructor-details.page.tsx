import instructorApi from 'apis/instructor/instructor.api';
import {
  IInstructorCertificate,
  IInstructorCertificatePayloadForm,
} from 'apis/instructor/instructor.interfaces';
import instructorQueries from 'apis/instructor/instructor.queries';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import PageContainer from 'components/common/page-container/page-container.component';
import prepareInstructorCertificateFormData from 'components/forms/instructor/helper/prepare-instructor-certificate-form.data';
import InstructorCertificateForm from 'components/forms/instructor/instructor-certificate.form';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { useTranslation } from 'react-i18next';
import { showSuccess } from 'libs/react.toastify';
import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';
import InstructorCertificateList from './components/instructor-certificate-list.component';

function InstructorDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    dispatchAdding,
    dispatchDeleting,
    dispatchResetCrudState,
    dispatchEditing,
    isDeleting,
    getActionId,
    getSelectedData,
    isAdding,
    isEditing,
  } = useCreateCrudState<IInstructorCertificate>();

  const {
    data: certificates = [],
    isLoading,
    refetch,
  } = instructorQueries.useInstructorCertificatesQuery(Number(id));

  const handleEditClick = useCallback(
    (data: IInstructorCertificate) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleRemoveClick = useCallback(
    (instructorId: number) => {
      dispatchDeleting(instructorId);
    },
    [dispatchDeleting],
  );

  const handleRemoveInstructorCertificate = async () => {
    try {
      await instructorApi.removeInstructorCertificate(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataDeletedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleCertificateAction = async ({
    data,
    files,
  }: TSubmitHandlerData<IInstructorCertificatePayloadForm>) => {
    try {
      if (getSelectedData()?.id) {
        const formPayload = {
          ...data,
          instructorId: Number(id),
          id: getSelectedData()?.id,
        };
        const payload = prepareInstructorCertificateFormData({
          data: formPayload,
          files,
        });
        await instructorApi.updateInstructorCertificate(payload);
        await refetch();
        dispatchResetCrudState();
        showSuccess(t('common.dataUpdatedSuccessfully'));
      } else {
        const formPayload = {
          ...data,
          instructorId: Number(id),
        };
        const payload = prepareInstructorCertificateFormData({
          data: formPayload,
          files,
        });
        await instructorApi.addInstructorCertificate(payload);
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
      form={
        <InstructorCertificateForm
          onSubmit={handleCertificateAction}
          editItem={getSelectedData()!}
        />
      }
      name={String(t('instructors.instructorcertificate'))}
      title={String(t('instructors.instructorcertificate'))}
      actionModalTitle={
        isEditing
          ? String(t('instructors.editInstructorcertificate'))
          : String(t('instructors.addInstructorcertificate'))
      }
      handleAddClick={dispatchAdding}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      handleDeleteSubmit={handleRemoveInstructorCertificate}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      permissionName="Instructor"
    >
      {isLoading && <LoadingPlaceholder />}
      <InstructorCertificateList
        items={certificates}
        handleEditClick={handleEditClick}
        handleRemoveClick={handleRemoveClick}
      />
    </PageContainer>
  );
}

export default ProtectPage({
  Page: InstructorDetailsPage,
  controllerName: ControllersNames.Instructor,
});
