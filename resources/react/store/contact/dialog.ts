import { createSlice } from '@reduxjs/toolkit';
import { contactSubmit } from './index';

const initialState: ContactDialogState = {
  open: false,
  snackbarOpen: false,
};

export const contactDialogSlice = createSlice({
  name: 'contactDialog',
  initialState,
  reducers: {
    openDialog: (state) => {
      state.open = true;
    },
    closeDialog: (state) => {
      state.open = false;
    },
    closeSnackbar: (state) => {
      state.snackbarOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(contactSubmit.fulfilled, (state) => {
      state.open = false;
      state.snackbarOpen = true;
    });
  },
});

export default contactDialogSlice.reducer;

export const { openDialog, closeDialog, closeSnackbar } =
  contactDialogSlice.actions;

/** Types */

export interface ContactDialogState {
  open: boolean;
  snackbarOpen: boolean;
}
