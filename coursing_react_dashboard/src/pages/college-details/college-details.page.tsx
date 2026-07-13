/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
import collegeDetailsApi from 'apis/college-details/college-details.api';
import {
  ICollegeDetails,
  ICollegeDetailsPayload,
  ICollegeDetailsPayloadForm,
  ICollegeDetailsSubjectPayload,
  ICollegeDetailsSubjectPayloadForm,
} from 'apis/college-details/college-details.interfaces';
import collegeDetailsQueries from 'apis/college-details/college-details.queries';
import { ICollegeSubjectDetails } from 'apis/college-subject/college-subject.interfaces';
import DeleteDialog from 'components/common/generic-table-page/components/delete-diaolg/delete-diaolg.component';
import FadeModal from 'components/common/generic-table-page/components/fade-modal/fade-modal.component';
import LoadingPlaceholder from 'components/common/loading-placeholder/loading-placeholder.component';
import NoData from 'components/common/no-data/no-data.component';
import PageContainer from 'components/common/page-container/page-container.component';
import CollegeDetailsSubjectForm from 'components/forms/college-details/college-details-subject.form';
import CollegeDetailsForm from 'components/forms/college-details/college-details.form';
import prepareCollegeDetailsFormData from 'components/forms/college-details/helpers/prepare-college-details-form-data';
import prepareCollegeDetailsSubjectFormData from 'components/forms/college-details/helpers/prepare-college-details-subject-form-data';
import CollegeDetailsList from 'pages/college-details/components/college-details-list.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import { showSuccess } from 'libs/react.toastify';
import React, { MutableRefObject, useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import collegeSubjectApi from 'apis/college-subject/college-subject.api';
import { useTranslation } from 'react-i18next';
import { ControllersNames } from 'constants/constants';
import ProtectPage from 'components/common/protect-page/protectPage';

function CollegeDetailsPage() {
  const { t } = useTranslation();
  const { id: collegeId } = useParams();

  const [wantedToEditSubject, setWantedToEditSubject] =
    useState<ICollegeSubjectDetails | null>(null);

  const [wantedToRemoveSubject, setWantedToRemoveSubject] = useState(0);

  const [collegeDetailsId, setCollegeDetailsId] = useState(0);

  const [openSubjectModal, setOpenSubjectModal] = useState(false);

  const [openDeleteSubjectModal, setOpenDeleteSubjectModal] = useState(false);

  const [progress, setProgress] = useState<number>();

  const abortHandler = useRef<any>();

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
  } = useCreateCrudState<ICollegeDetails>();

  const {
    data: collegeDetails,
    isLoading,
    refetch,
  } = collegeDetailsQueries.useGetAllCollegeDetailsQuery({
    collegeId: Number(collegeId),
  });
  const noData = !collegeDetails?.data && !isLoading;

  const handleEditClick = useCallback(
    (data: ICollegeDetails) => {
      dispatchEditing({
        selectedData: data,
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

  const handleRemoveCollegeDetails = async () => {
    try {
      await collegeDetailsApi.removeCollegeDetails(getActionId());
      await refetch();
      dispatchResetCrudState();
      showSuccess(
        t('common.deleteSuccess', { var: t('universities.collegeDetails') }),
      );
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleCollegeDetailsAction = async ({
    data,
  }: TSubmitHandlerData<ICollegeDetailsPayloadForm>) => {
    const formPayload: ICollegeDetailsPayload = {
      ...data,
      collegeSubjectIds: getSelectedData()?.subjects.length
        ? getSelectedData()?.subjects.map((s) => s.id) || []
        : [],
      collegeId: Number(collegeId),
      year: data.year.id || null,
      semesterId: data?.semesterId?.id || null,
    };

    try {
      if (getSelectedData()?.id) {
        const payload = { ...formPayload, id: getSelectedData()?.id };
        const formData = prepareCollegeDetailsFormData({ data: payload });
        await collegeDetailsApi.updateCollegeDetails(formData);
        await refetch();
        dispatchResetCrudState();
        showSuccess(
          t('common.updateSuccess', { var: t('universities.collegeDetails') }),
        );
      } else {
        const formData = prepareCollegeDetailsFormData({ data: formPayload });
        await collegeDetailsApi.addCollegeDetails(formData);
        await refetch();
        dispatchResetCrudState();
        showSuccess(
          t('common.addSuccess', { var: t('universities.collegeDetails') }),
        );
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleSubjectEditClick = ({
    collegeDetailsId: detailsId,
    data,
  }: {
    collegeDetailsId: number;
    data: ICollegeSubjectDetails | null;
  }) => {
    setOpenSubjectModal(true);
    setWantedToEditSubject(data);
    setCollegeDetailsId(detailsId);
  };

  const handleSubjectRemoveClick = ({
    collegeDetailsId: _collegeDetailsId,
    subjectId,
  }: {
    subjectId: number;
    collegeDetailsId: number;
  }) => {
    setWantedToRemoveSubject(subjectId);
    setCollegeDetailsId(_collegeDetailsId);
    setOpenDeleteSubjectModal(true);
  };

  const handleDeleteSubject = async () => {
    try {
      await collegeDetailsApi.removeCollegeDetailsSubject(
        wantedToRemoveSubject,
      );
      setWantedToRemoveSubject(0);
      setOpenDeleteSubjectModal(false);
      refetch();
      showSuccess(t('common.deleteSuccess', { var: t('exams.subject') }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleSubjectAction = async (
    onProgress: (p?: number) => void,
    abortHandlerRef: MutableRefObject<any>,
    {
      data,
      files,
      urlsForRemove,
    }: TSubmitHandlerData<ICollegeDetailsSubjectPayloadForm>,
  ) => {
    let formPayload: ICollegeDetailsSubjectPayload = {
      ...data,
      CollegeSubjectId:
        wantedToEditSubject?.id || data.CollegeSubjectId?.id || 0,
      CollegeDetailsId: collegeDetailsId,
    };

    if (data.CollegeSubjectId?.id === 0) {
      try {
        const formData = new FormData();
        formData.append('name', data.CollegeSubjectId.name);
        const { id: CollegeSubjectId } =
          await collegeSubjectApi.addCollegeSubject(formData);
        formPayload = { ...formPayload, CollegeSubjectId };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }

    try {
      if (wantedToEditSubject?.id) {
        const formData = prepareCollegeDetailsSubjectFormData({
          data: {
            ...formPayload,
            id: wantedToEditSubject?.id,
            CollegeDetailsId: 0,
            CollegeSubjectId: 0,
          },
          files,
          urlsForRemove,
        });
        await collegeDetailsApi.updateCollegeDetailsSubject(
          formData,
          onProgress,
          (handler) => {
            abortHandlerRef.current = handler;
          },
        );
        await refetch();
        setWantedToEditSubject(null);
        setOpenSubjectModal(false);
        showSuccess(t('common.updateSuccess', { var: t('exams.subject') }));
      } else {
        const formData = prepareCollegeDetailsSubjectFormData({
          data: formPayload,
          files,
          urlsForRemove,
        });
        await collegeDetailsApi.addCollegeDetailsSubject(
          formData,
          onProgress,
          (handler) => {
            abortHandlerRef.current = handler;
          },
        );
        await refetch();
        setWantedToEditSubject(null);
        setOpenSubjectModal(false);
        showSuccess(t('common.addSuccess', { var: t('exams.subject') }));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <PageContainer
      title={
        collegeDetails?.data[0]?.collegeName || t('universities.collegeDetails')
      }
      name={t('subjects.subject') || 'add subject'}
      handleAddClick={dispatchAdding}
      actionModalTitle={
        isEditing
          ? t('subjects.editSubject').toString()
          : t('subjects.addSubject').toString()
      }
      handleDeleteSubmit={handleRemoveCollegeDetails}
      openDeleteModal={isDeleting}
      setOpenDeleteModal={dispatchResetCrudState}
      openActionModal={isAdding || isEditing}
      setOpenActionModal={dispatchResetCrudState}
      permissionName="College"
      form={
        <CollegeDetailsForm
          editItem={getSelectedData()}
          onSubmit={handleCollegeDetailsAction}
          collegeId={Number(collegeId)}
        />
      }
    >
      {isLoading && <LoadingPlaceholder />}
      {noData && <NoData />}
      <CollegeDetailsList
        items={collegeDetails?.data || []}
        handleEditClick={handleEditClick}
        handleRemoveClick={handleRemoveClick}
        handleSubjectEditClick={handleSubjectEditClick}
        handleSubjectRemoveClick={handleSubjectRemoveClick}
        collegeId={Number(collegeId)}
      />
      <FadeModal
        width={500}
        open={openSubjectModal}
        setOpen={setOpenSubjectModal}
        modalTitle={
          wantedToEditSubject?.id
            ? wantedToEditSubject.name
            : t('subjects.addSubject').toString()
        }
        onClose={() => {
          setWantedToEditSubject(null);
        }}
      >
        <CollegeDetailsSubjectForm
          onSubmit={(data) =>
            handleSubjectAction(setProgress, abortHandler, data)
          }
          progress={progress}
          onAbortClick={abortHandler.current}
          editItem={wantedToEditSubject}
        />
      </FadeModal>
      <DeleteDialog
        open={openDeleteSubjectModal}
        setOpen={setOpenDeleteSubjectModal}
        ButtonAcceptClick={handleDeleteSubject}
      />
    </PageContainer>
  );
}

export default ProtectPage({
  Page: CollegeDetailsPage,
  controllerName: ControllersNames.College,
});
