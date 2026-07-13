import { Add } from '@mui/icons-material';
import { Box, Stack, SxProps, Typography } from '@mui/material';
import React from 'react';

const CONTAINER: SxProps = {
  cursor: 'pointer',
  bgcolor: '#eee',
  height: '250px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: '0.3s',
  textAlign: 'center',
  ':hover': {
    bgcolor: '#ccc',
  },
  borderRadius: '12px',
};

const ICON: SxProps = {
  width: 50,
  height: 50,
  color: '#000a',
  m: 'auto',
};

type Props = {
  onClick: () => void;
  title?: string;
};

function AddCard({ onClick, title }: Props) {
  return (
    <Box onClick={onClick} sx={CONTAINER}>
      <Stack>
        <Add sx={ICON} />
        <Typography>{title}</Typography>
      </Stack>
    </Box>
  );
}

export default AddCard;
