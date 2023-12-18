import { configureStore } from '@reduxjs/toolkit';
import contact from './contact';
import contactDialog from './contact/dialog';

const store = configureStore({
  reducer: {
    contact,
    contactDialog,
  },
  devTools: true,
});

export default store;

/** Types */

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
