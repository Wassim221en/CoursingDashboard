/* eslint-disable import/no-named-as-default */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import {
  MaterialReactTable,
  MaterialReactTableProps,
  MRT_ColumnDef,
} from 'material-react-table';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IWebContentEnName } from 'apis/permissions/permissions.interfaces';
import { motion } from 'framer-motion';
import { FramerAnimationEnd, FramerAnimationStart } from 'constants/constants';
import ActionCellButtons from '../action-cell-buttons/action-cell-buttons.component';
import PageContainer, {
  PageContainerProps,
} from '../page-container/page-container.component';

type Props<T extends Record<string, any>> = Omit<
  PageContainerProps,
  'children'
> & {
  tableProps?: Omit<MaterialReactTableProps<T>, 'columns' | 'data' | 'table'>;
  form: ReactNode;
  columns: MRT_ColumnDef<T>[];
  data: T[];
  isLoading: boolean;
  enableTopToolbar?: boolean;
  handleRemoveClick?: (id: number) => void;
  handleEditClick?: (data: T) => void;
  handleDetailsClick?: (data: T) => void;
  handleChangePasswordClick?: (data: T) => void;
  handleAddItemClick?: (data: T) => void;
  detailsTooltip?: string;
  changePasswordTooltip?: string;
  addTooltip?: string;
  withActionProgress?: boolean;
  withoutActions?: boolean;
  idProperty?: string;
  children?: ReactNode;
  permissionName: IWebContentEnName;
  setPagination?: Dispatch<
    SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  totalRecords?: number;
  extraActions?: (data: T) => ReactNode;
  extraButtons?: ReactNode;
};

function GenericTablePage<T extends Record<string, any>>({
  columns,
  data,
  form,
  handleAddClick,
  handleDeleteSubmit,
  name,
  openDeleteModal,
  setOpenDeleteModal,
  title,
  actionModalTitle,
  loadingActionModal,
  openActionModal,
  setOpenActionModal,
  tableProps,
  isLoading,
  handleRemoveClick,
  handleEditClick,
  handleDetailsClick,
  handleChangePasswordClick,
  detailsTooltip,
  changePasswordTooltip,
  children,
  handleAddItemClick,
  addTooltip,
  withActionProgress = false,
  extra,
  withoutActions = false,
  width,
  idProperty = 'id',
  setPagination,
  pagination,
  totalRecords,
  enableTopToolbar,
  permissionName,
  extraActions,
  extraButtons,
}: Props<T>) {
  const { t } = useTranslation();

  return (
    <motion.div
      animate={FramerAnimationEnd}
      initial={FramerAnimationStart}
      transition={{ delay: 0.3 }}
    >
      <PageContainer
        title={title}
        name={name}
        handleAddClick={handleAddClick}
        actionModalTitle={actionModalTitle}
        loadingActionModal={loadingActionModal}
        handleDeleteSubmit={handleDeleteSubmit}
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        openActionModal={openActionModal}
        setOpenActionModal={setOpenActionModal}
        form={form}
        extra={extra}
        width={width}
        permissionName={permissionName}
        extraButtons={extraButtons}
      >
        <Box mb={2}>{children && children}</Box>

        <MaterialReactTable
          enableTopToolbar={enableTopToolbar}
          {...tableProps}
          muiTableContainerProps={{
            sx: { maxHeight: 'calc(85vh - 300px)' },
          }}
          muiTableBodyCellProps={({ column, cell, table }) =>
            cell?.getValue() ||
            cell?.getValue() === 0 ||
            !column.getCanHide() ||
            table.getState().showSkeletons
              ? {
                  sx: {
                    textAlign: 'start',
                  },
                }
              : {
                  // sx: {
                  //   textAlign: 'start',
                  //   position: 'relative',
                  //   ':after': {
                  //     visibility: 'visible',
                  //     position: 'absolute',
                  //     content: '"N/A"',
                  //     top: '50%',
                  //     // transform: 'translateY(-50%)',
                  //     align: 'center',
                  //   },
                  // },
                }
          }
          positionActionsColumn="last"
          data={data}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              header: String(t('common.muiAction')),
            },
          }}
          enableRowActions={!withoutActions}
          state={{
            showSkeletons: isLoading,
            pagination,
            isLoading: withActionProgress,
          }}
          onPaginationChange={setPagination}
          manualPagination
          enableFullScreenToggle={false}
          enableColumnActions={false}
          enableGlobalFilter={false}
          enableColumnFilters={false}
          rowCount={totalRecords || data.length}
          paginationDisplayMode="pages"
          renderRowActions={({ row }) =>
            ActionCellButtons({
              permissionName,
              data: row.original,
              handleEditClick,
              handleRemoveClick: handleRemoveClick
                ? (rowData) => {
                    handleRemoveClick(rowData[idProperty]);
                  }
                : null,
              handleShowClick: handleDetailsClick,
              handleChangePasswordClick: handleChangePasswordClick
                ? (rowData) => {
                    handleChangePasswordClick(rowData);
                  }
                : null,
              handleAddClick: handleAddItemClick,
              addTooltip,
              detailsTooltip,
              changePasswordTooltip,
              extraActions: extraActions?.(row.original),
            })
          }
          defaultColumn={{
            minSize: 40,
            maxSize: 1000,
            size: 100,
            enableResizing: true,
          }}
          columns={columns}
          muiPaginationProps={{
            rowsPerPageOptions: [10, 20, 50, 100],
            color: 'primary',
            shape: 'rounded',
            variant: 'text',
          }}
        />
      </PageContainer>
    </motion.div>
  );
}

export default GenericTablePage;
