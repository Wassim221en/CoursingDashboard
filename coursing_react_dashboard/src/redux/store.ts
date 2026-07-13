// eslint-disable-next-line import/no-extraneous-dependencies
import { createLogger } from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './root-reduser';

const logger = createLogger();

const persistedRootReducer = persistReducer(
  { key: 'root', storage, whitelist: ['auth'] },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      // using `any` as a temp solution
      // will try to dump redux soon in favor of zustand
      ...(process.env.NODE_ENV === 'development' ? [logger as any] : []),
    ),
});

export const getStore = () => store;

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
