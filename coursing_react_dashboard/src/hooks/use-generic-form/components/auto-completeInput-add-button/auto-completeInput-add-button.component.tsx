import Add from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import React from 'react';

type Props = {
  onClick: () => void;
};

function AutoCompleteInputAddButton({ onClick }: Props) {
  return (
    <IconButton onClick={onClick} size="small">
      <Add sx={{ fontSize: 18 }} />
    </IconButton>
  );
}

export default AutoCompleteInputAddButton;
