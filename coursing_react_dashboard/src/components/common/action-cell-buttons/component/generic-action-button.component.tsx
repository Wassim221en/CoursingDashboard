/* eslint-disable react/jsx-props-no-spreading */
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DetailsIcon from '@mui/icons-material/Visibility';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ActionType } from 'constants/constants';
import { Add } from '@mui/icons-material';

interface GenericActionButtonProps {
  id?: string;
  onClickActionButton?: () => void;
  actionType?: ActionType;
  disabled?: boolean;
  tooltip: string;
  [key: string]: any;
}

function GenericActionButton({
  onClickActionButton,
  actionType,
  disabled = false,
  tooltip,
  ...props
}: GenericActionButtonProps) {
  return (
    <Tooltip title={tooltip}>
      <IconButton disabled={disabled} onClick={onClickActionButton} {...props}>
        {actionType === ActionType.EDIT && <EditIcon color="primary" />}
        {actionType === ActionType.DELETE && <DeleteIcon color="error" />}
        {actionType === ActionType.DETAILS && <DetailsIcon color="info" />}
        {actionType === ActionType.ADD && <Add color="primary" />}
        {actionType === ActionType.CHANGE_PASSWORD && (
          <LockOutlinedIcon color="secondary" />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default GenericActionButton;
