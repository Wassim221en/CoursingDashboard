/* eslint-disable no-nested-ternary */
import { Box } from '@mui/material';
import { ActionType } from 'constants/constants';
import GetUserPermission from 'utils/permissionsFunctions';
import { IWebContentEnName } from 'apis/permissions/permissions.interfaces';
import { HashLoader } from 'react-spinners';
import { ReactNode } from 'react';
import GenericActionButton from './component/generic-action-button.component';

type Properties<T> = {
  data: T;
  handleEditClick?:
    | null
    | ((
        data: T,
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      ) => void);
  handleRemoveClick?:
    | null
    | ((
        data: T,
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      ) => void);
  handleShowClick?:
    | null
    | ((
        data: T,
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      ) => void);
  handleAddClick?:
    | null
    | ((
        data: T,
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      ) => void);
  handleChangePasswordClick?:
    | null
    | ((
        data: T,
        event: React.MouseEvent<HTMLButtonElement>,
      ) => void);
  showDeletingSpinner?: boolean;
  detailsTooltip?: string;
  addTooltip?: string;
  editTooltip?: string;
  deleteTooltip?: string;
  changePasswordTooltip?: string;
  permissionName: IWebContentEnName;
  extraActions?: ReactNode;
};

export default function ActionCellButtons<T>({
  handleEditClick,
  handleRemoveClick,
  handleShowClick,
  handleAddClick,
  handleChangePasswordClick,
  data,
  showDeletingSpinner,
  detailsTooltip = 'details',
  addTooltip = 'add',
  editTooltip = 'edit',
  deleteTooltip = 'delete',
  changePasswordTooltip = 'change password',
  permissionName = '',
  extraActions,
}: Properties<T>) {
  const choosenPermission = GetUserPermission(permissionName);

  return (
    <Box display="flex" gap={0.5}>
      {handleAddClick && choosenPermission?.canAction && (
        <GenericActionButton
          actionType={ActionType.ADD}
          onClick={(e) => handleAddClick(data, e)}
          tooltip={addTooltip}
        />
      )}

      {!showDeletingSpinner &&
      handleRemoveClick &&
      choosenPermission?.canDelete ? (
        <GenericActionButton
          actionType={ActionType.DELETE}
          onClick={(e) => handleRemoveClick(data, e)}
          tooltip={deleteTooltip}
        />
      ) : showDeletingSpinner ? (
        <Box mt={0.7}>
          <HashLoader color="red" size={25} />
        </Box>
      ) : null}

      {handleEditClick && choosenPermission?.canAction && (
        <GenericActionButton
          actionType={ActionType.EDIT}
          onClick={(e) => handleEditClick(data, e)}
          tooltip={editTooltip}
        />
      )}
      {handleChangePasswordClick && choosenPermission?.canAction && (
        <GenericActionButton
          actionType={ActionType.CHANGE_PASSWORD}
          onClick={(e) => handleChangePasswordClick(data, e)}
          tooltip={changePasswordTooltip}
        />
      )}
      {handleShowClick && choosenPermission?.canAction && (
        <GenericActionButton
          actionType={ActionType.DETAILS}
          onClick={(e) => handleShowClick(data, e)}
          tooltip={detailsTooltip}
        />
      )}
      {extraActions}
    </Box>
  );
}
