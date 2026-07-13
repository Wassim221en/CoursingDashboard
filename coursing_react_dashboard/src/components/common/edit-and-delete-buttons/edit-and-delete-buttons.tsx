/* eslint-disable no-nested-ternary */
import { Box, SxProps, Theme } from '@mui/material';
import { ActionType } from 'constants/constants';
import React from 'react';
import { HashLoader } from 'react-spinners';
import GenericActionButton from '../action-cell-buttons/component/generic-action-button.component';

type Props = {
  color?: string;
  handleEditClick?: () => void;
  handleRemoveClick?: () => void;
  sx?: SxProps<Theme>;
  showDeletingSpinner?: boolean;
  showDeleteButton?: boolean;
  showEditButton?: boolean;
};

function EditAndDeleteButtons({
  color,
  handleEditClick,
  handleRemoveClick,
  showDeletingSpinner,
  showDeleteButton = true,
  showEditButton = true,
  sx,
}: Props) {
  return (
    <Box display="flex" sx={sx}>
      {showEditButton && (
        <GenericActionButton
          color={color}
          actionType={ActionType.EDIT}
          onClick={handleEditClick}
          tooltip="edit"
        />
      )}
      {!showDeletingSpinner && showDeleteButton ? (
        <GenericActionButton
          color={color}
          actionType={ActionType.DELETE}
          onClick={handleRemoveClick}
          tooltip="delete"
        />
      ) : showDeletingSpinner ? (
        <Box mt={0.7}>
          <HashLoader color="red" size={25} />
        </Box>
      ) : null}
    </Box>
  );
}

export default EditAndDeleteButtons;
