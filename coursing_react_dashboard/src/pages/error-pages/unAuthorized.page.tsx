import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LockPersonIcon from '@mui/icons-material/LockPerson';

function UnAuthorizedPage() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h6"
        style={{ color: 'black', textAlign: 'center', paddingBottom: 10 }}
      >
        {t('errorpages.oops')}
      </Typography>
      <Box py={1}>
        <LockPersonIcon style={{ fontSize: '140px' }} />
      </Box>
      <Typography variant="h6" style={{ color: 'black' }}>
        {t('errorpages.accessDenied')}
      </Typography>
    </Box>
  );
}

export default UnAuthorizedPage;
