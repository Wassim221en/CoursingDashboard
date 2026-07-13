import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  text?: string;
  height?: string;
};

function NoData({ text, height }: Props) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        height: height || '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography>{text || t('common.no-data')}</Typography>
      </Box>
    </Box>
  );
}

export default NoData;
