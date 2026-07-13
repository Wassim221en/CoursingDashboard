/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable import/no-named-as-default */
import { CssBaseline } from '@mui/material';
import { FC, PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MaterialThemeProvider from 'theme/material-theme-provider';
import { persistor, store } from 'redux/store';
import RoutingLoadingIndicator from 'layout/components/routing-loading-indicator/routing-loading-indicator.component';
import 'react-toastify/dist/ReactToastify.css';
import 'theme/global.styles.css';

import { BrowserRouter } from 'react-router-dom';
import Layout from 'layout/layout';
import { I18nextProvider, useTranslation } from 'react-i18next';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import { Toaster } from 'react-hot-toast';
import { CacheProvider } from '@emotion/react';
import reacti18n from '../../../locales/i18n';

const Wrapper: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  const { i18n } = useTranslation();
  const lang = i18n.language;

  const cacheRtl = createCache({
    key: `mui-style-${lang === 'ar' && 'rtl'}`,
    stylisPlugins: [prefixer, ...(lang === 'ar' ? [stylisRTLPlugin] : [])],
  });

  useEffect(() => {
    const newDir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelector('html')?.setAttribute('dir', newDir);
    document.querySelector('html')?.setAttribute('lang', lang);
  }, [lang]);

  return (
    <CacheProvider value={cacheRtl}>
      <MaterialThemeProvider>
        <BrowserRouter>
          <Provider store={store}>
            <PersistGate persistor={persistor}>
              <I18nextProvider i18n={reacti18n}>
                <QueryClientProvider client={queryClient}>
                  <Toaster position="top-right" reverseOrder={false} />
                  <CssBaseline />
                  <Layout>
                    <Suspense fallback={<RoutingLoadingIndicator />}>
                      {children}
                    </Suspense>
                  </Layout>
                </QueryClientProvider>
              </I18nextProvider>
            </PersistGate>
          </Provider>
        </BrowserRouter>
      </MaterialThemeProvider>
    </CacheProvider>
  );
};
export default Wrapper;
