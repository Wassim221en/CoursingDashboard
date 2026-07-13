/* eslint-disable react/no-unstable-nested-components */
import { useCallback, useMemo, useState } from 'react';
import { MRT_ColumnDef } from 'material-react-table';
import { showError, showSuccess } from 'libs/react.toastify';
import { TSubmitHandlerData } from 'hooks/use-generic-form/use-generic-form';
import GenericTablePage from 'components/common/generic-table-page/generic-table-page.component';
import useCreateCrudState from 'hooks/use-create-crud-state/use-create-crud-state';
import {
  IActionInstructorPayload,
  IInstructor,
  IInstructorCertificatePayloadForm,
} from 'apis/instructor/instructor.interfaces';
import instructorQueries from 'apis/instructor/instructor.queries';
import instructorApi from 'apis/instructor/instructor.api';
import InstructorForm from 'components/forms/instructor/instructor.form';
import prepareInstructorFormData from 'components/forms/instructor/helper/prepare-instructor-form.data';
import InstructorCertificateForm from 'components/forms/instructor/instructor-certificate.form';
import FadeModal from 'components/common/generic-table-page/components/fade-modal/fade-modal.component';
import { useNavigate } from 'react-router-dom';
import routesNames from 'routes/constants';
import prepareInstructorCertificateFormData from 'components/forms/instructor/helper/prepare-instructor-certificate-form.data';
import { useTranslation } from 'react-i18next';
import ProtectPage from 'components/common/protect-page/protectPage';
import { ControllersNames } from 'constants/constants';
import { Box, Grid, Typography } from '@mui/material';
import NoData from 'components/common/no-data/no-data.component';
import InstructorCourseCard from './components/instructor-course-card';
import InstructorChangePasswordModal from './components/instructor-change-password-modal.component';

function InstructorPage() {
  const { t } = useTranslation();

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
  } = useCreateCrudState<IInstructor>();
  const [openCertificateModal, setOpenCertificateModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [changePasswordTargetUserId, setChangePasswordTargetUserId] =
    useState<number | null>(null);
  const [instructorId, setInstructorId] = useState(0);
  const navigate = useNavigate();
  const [showActionProgress, setShowActionProgress] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: instructors,
    refetch,
    isLoading,
  } = instructorQueries.useInstructorQuery({
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });

  const handleCertificateAction = async ({
    data,
    files,
  }: TSubmitHandlerData<IInstructorCertificatePayloadForm>) => {
    try {
      const payload = { ...data, instructorId };
      const formPayload = prepareInstructorCertificateFormData({
        data: payload,
        files,
      });

      await instructorApi.addInstructorCertificate(formPayload);
      await refetch();
      dispatchResetCrudState();
      showSuccess(t('common.dataAddedSuccessfully'));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleDetailsClick = useCallback(
    (data: IInstructor) => {
      navigate(`${routesNames.instructors}/${data.id}`);
    },
    [navigate],
  );

  const handleChangePasswordClick = useCallback((data: IInstructor) => {
    setChangePasswordTargetUserId(data.id);
    setOpenChangePasswordModal(true);
  }, []);

  const setChangePasswordModalOpen = useCallback((open: boolean) => {
    setOpenChangePasswordModal(open);
    if (!open) {
      setChangePasswordTargetUserId(null);
    }
  }, []);

  const handleInstructorAction = async (
    payloadData: TSubmitHandlerData<IActionInstructorPayload>,
  ) => {
    const { data, files, urlsForRemove } = payloadData;

    if (payloadData.data.userName?.split(' ').length !== 1) {
      showError(t('common.usernameIsValidate'));
    } else {
      try {
        if (getSelectedData()?.id) {
          const formData = prepareInstructorFormData({
            data: {
              ...data,
              id: getSelectedData()?.id!,
            },
            files,
            urlsForRemove,
          });
          await instructorApi.updateInstructor(formData);
          await refetch();
          dispatchResetCrudState();
          showSuccess(t('common.dataUpdatedSuccessfully'));
        } else {
          const formData = prepareInstructorFormData({
            data,
            files,
            urlsForRemove,
          });
          await instructorApi.addInstructor(formData);
          await refetch();
          dispatchResetCrudState();
          showSuccess(t('common.dataAddedSuccessfully'));
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  };

  const handleEditClick = useCallback(
    (data: IInstructor) => {
      dispatchEditing({ selectedData: data });
    },
    [dispatchEditing],
  );

  const handleRemoveClick = useCallback(
    (id: number) => {
      dispatchDeleting({ actionId: id });
    },
    [dispatchDeleting],
  );

  const handleRemoveInstructor = async () => {
    setShowActionProgress(true);
    try {
      await instructorApi.removeInstructor(getActionId());
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

  const columns = useMemo<MRT_ColumnDef<IInstructor>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: t('instructors.fullName'),
      },
      {
        accessorKey: 'userName',
        header: t('instructors.username'),
      },
      {
        accessorKey: 'aboutInstructor',
        header: t('instructors.aboutInstructor'),
      },
      // {
      //   accessorKey: 'rating',
      //   header: t('instructors.rating'),
      //   Cell: ({ cell }) => (
      //     <RatingComponent
      //       value={cell.getValue<number>()}
      //       precision={0.5}
      //       readonly
      //     />
      //   ),
      // },
      {
        accessorKey: 'birthDate',
        header: t('instructors.birthdate'),
        Cell: ({ cell }) =>
          cell.getValue<Date>() ? (
            <span>{new Date(cell.getValue<Date>()).toLocaleDateString()} </span>
          ) : (
            ''
          ),
      },
    ],
    [t],
  );

  const InstructorTablePage = GenericTablePage<IInstructor>;

  return (
    <>
      <InstructorTablePage
        form={
          <InstructorForm
            onSubmit={handleInstructorAction}
            editItem={getSelectedData()}
          />
        }
        columns={columns}
        data={instructors?.data || []}
        name={String(t('common.instructor'))}
        title={String(t('common.instructors'))}
        isLoading={isLoading}
        handleAddClick={dispatchAdding}
        openActionModal={isAdding || isEditing}
        handleEditClick={handleEditClick}
        openDeleteModal={isDeleting}
        setOpenDeleteModal={dispatchResetCrudState}
        handleRemoveClick={handleRemoveClick}
        handleDeleteSubmit={handleRemoveInstructor}
        setOpenActionModal={dispatchResetCrudState}
        actionModalTitle={
          isEditing
            ? String(t('instructors.editInstructor'))
            : String(t('instructors.addInstructor'))
        }
        handleDetailsClick={handleDetailsClick}
        handleChangePasswordClick={handleChangePasswordClick}
        changePasswordTooltip={String(t('instructors.changePasswordMenu'))}
        setPagination={setPagination}
        pagination={pagination}
        totalRecords={instructors?.totalRecords || 0}
        withActionProgress={showActionProgress}
        permissionName="Instructor"
        tableProps={{
          renderDetailPanel: ({ row }) => (
            <Box>
              {row.original?.instructorCourses?.length ? (
                <Box>
                  <Typography sx={{ fontWeight: 600, paddingBottom: 2 }}>
                    {t('instructors.instructorCourses')}
                  </Typography>
                  <Grid container spacing={2}>
                    {row.original?.instructorCourses?.map((course) => (
                      <Grid key={course.id} item xs={12} sm={4} md={3}>
                        <InstructorCourseCard instructorCourse={course} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <NoData />
              )}
            </Box>
          ),
        }}
      />
      <FadeModal
        width={500}
        open={openCertificateModal!}
        setOpen={setOpenCertificateModal}
        modalTitle={String(t('instructors.addInstructorCertificate'))}
      >
        <InstructorCertificateForm
          onSubmit={handleCertificateAction}
          editItem={null}
        />
      </FadeModal>
      <InstructorChangePasswordModal
        open={openChangePasswordModal}
        setOpen={setChangePasswordModalOpen}
        targetUserId={changePasswordTargetUserId}
      />
    </>
  );
}

export default ProtectPage({
  Page: InstructorPage,
  controllerName: ControllersNames.Instructor,
});
