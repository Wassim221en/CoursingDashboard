import { Add } from '@mui/icons-material';
import { Box, SxProps } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const BUTTON: SxProps = {
  width: '100%',
  p: 1.3,
  cursor: 'pointer',
  borderRadius: 2,
  transition: '0.4s',
  display: 'flex',
  gap: 1,
  alignItems: 'center',
  ':hover': {
    bgcolor: 'rgba(16, 24, 64, 0.08)',
  },
};

function AddButton({ handleAddClick }: { handleAddClick: () => void }) {
  const { t } = useTranslation();
  return (
    <Box sx={BUTTON} onClick={handleAddClick}>
      <Add sx={{ color: '#000a' }} />
      {t('specialized.add')}
    </Box>
  );
}

export default AddButton;
