/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from '@mui/material';
import React, { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'redux/hooks';

function LanguageButton() {
  // const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  // const queryClient = useQueryClient();

  const handleChangeLanguage = useCallback(() => {
    if (i18n.language === 'ar') {
      i18n.changeLanguage('en');
      window.localStorage.setItem('Localelanguage', 'en');
    } else {
      i18n.changeLanguage('ar');
      window.localStorage.setItem('Localelanguage', 'ar');
    }
  }, [i18n.language]);

  return (
    <Box
      component="div"
      onClick={handleChangeLanguage}
      sx={{ cursor: 'pointer' }}
    >
      {i18n.language === 'ar' ? 'EN' : 'AR'}
    </Box>
  );
}

export default LanguageButton;
