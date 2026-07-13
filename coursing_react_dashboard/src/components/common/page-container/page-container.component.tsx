import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useTranslation } from 'react-i18next';
import React, { ReactNode } from 'react';
import { IWebContentEnName } from 'apis/permissions/permissions.interfaces';
import GetUserPermission from 'utils/permissionsFunctions';
import DeleteDialog from '../generic-table-page/components/delete-diaolg/delete-diaolg.component';
import FadeModal from '../generic-table-page/components/fade-modal/fade-modal.component';
import PageTitle from '../generic-table-page/components/page-title/page-title.component';

export type PageContainerProps = {
  title: string;
  name?: string;
  handleAddClick?: () => void;
  children: ReactNode;
  openActionModal?: boolean;
  setOpenActionModal?: () => void;
  actionModalTitle?: string;
  loadingActionModal?: boolean;
  openDeleteModal?: boolean;
  setOpenDeleteModal?: () => void;
  handleDeleteSubmit?: () => void;
  form?: ReactNode;
  extra?: React.ReactNode;
  width?: number;
  permissionName: IWebContentEnName;
  extraButtons?: ReactNode;
};

function PageContainer({
  title,
  name,
  handleAddClick,
  children,
  openActionModal,
  setOpenActionModal,
  actionModalTitle,
  loadingActionModal,
  openDeleteModal,
  setOpenDeleteModal,
  handleDeleteSubmit,
  form,
  extra,
  permissionName = '',
  width = 500,
  extraButtons,
}: PageContainerProps) {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const choosenPermission = GetUserPermission(permissionName);

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      <PageTitle
        title={title}
        addButtonText={
          name && `${currentLanguage === 'en' ? 'Add' : 'اضافة'} ${name}`
        }
        handleAddClick={handleAddClick!}
        extra={extra}
        canAction={choosenPermission?.canAction || false}
        extraButtons={extraButtons}
      />
      <Box mt={5}>{children}</Box>
      {setOpenActionModal && form && (
        <FadeModal
          width={width}
          open={openActionModal!}
          setOpen={setOpenActionModal}
          modalTitle={actionModalTitle}
          isLoading={loadingActionModal}
        >
          {form}
        </FadeModal>
      )}
      <DeleteDialog
        open={openDeleteModal!}
        setOpen={setOpenDeleteModal!}
        ButtonAcceptClick={handleDeleteSubmit}
      />
    </Container>
  );
}

export default PageContainer;
