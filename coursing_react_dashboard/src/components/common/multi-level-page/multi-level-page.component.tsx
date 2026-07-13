import { Box } from '@mui/material';
import React, { memo, ReactNode } from 'react';
import { IWebContentEnName } from 'apis/permissions/permissions.interfaces';
import LoadingPlaceholder from '../loading-placeholder/loading-placeholder.component';
import PageContainer, {
  PageContainerProps,
} from '../page-container/page-container.component';
import NestedItems, {
  TNestedItems,
} from './components/nested-items/nested-items.component';

type Props = Omit<PageContainerProps, 'children' | 'handleAddClick'> &
  TNestedItems & {
    form?: ReactNode;
    isLoading: boolean;
    handleAddClick: (parentId?: number | null) => void;
    children?: ReactNode;
    permissionName: IWebContentEnName;
  };

function MultiLevelPage({
  data,
  form,
  handleDeleteSubmit,
  handleRemoveClick,
  isLoading,
  name,
  openDeleteModal,
  setOpenDeleteModal,
  title,
  actionModalTitle,
  loadingActionModal,
  openActionModal,
  setOpenActionModal,
  handleAddClick,
  handleEditClick,
  children,
  permissionName,
}: Props) {
  return (
    <PageContainer
      title={title}
      name={name}
      actionModalTitle={actionModalTitle}
      loadingActionModal={loadingActionModal}
      handleDeleteSubmit={handleDeleteSubmit}
      openDeleteModal={openDeleteModal}
      setOpenDeleteModal={setOpenDeleteModal}
      openActionModal={openActionModal}
      setOpenActionModal={setOpenActionModal}
      form={form}
      permissionName={permissionName}
    >
      <Box mb={2}>{children && children}</Box>
      {isLoading ? (
        <LoadingPlaceholder />
      ) : (
        <NestedItems
          permissionName={permissionName}
          data={data}
          handleRemoveClick={handleRemoveClick}
          handleAddClick={handleAddClick}
          handleEditClick={handleEditClick}
        />
      )}
    </PageContainer>
  );
}

export default memo(MultiLevelPage);
