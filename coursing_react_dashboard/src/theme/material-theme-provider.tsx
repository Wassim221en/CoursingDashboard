/* eslint-disable arrow-body-style */
import { ThemeProvider, createTheme } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import ThemeVariables from './theme-variables';

const MaterialThemeProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const theme = createTheme({
    direction: lang === 'ar' ? 'rtl' : 'ltr',
    typography: {
      fontFamily: 'Tajawal-Regular',
    },
    palette: {
      primary: {
        main: ThemeVariables.PRIMARY_COLOR,
      },
      secondary: {
        main: ThemeVariables.SECONDARY_COLOR,
      },
      error: {
        main: ThemeVariables.ERROR_COLOR,
      },
      background: {
        default: '#fff',
      },
    },
    shape: {
      borderRadius: 5,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div>{children}</div>
    </ThemeProvider>
  );
};

export default MaterialThemeProvider;
