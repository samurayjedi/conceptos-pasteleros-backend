import _ from 'lodash';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

const initialState: ContactState = {
  email: '',
  full_name: '',
  country: 'US',
  phone: '',
  description: '',
};

export const contactSubmit = createAsyncThunk<
  void,
  Record<string, any>,
  { state: RootState }
>('@contact/submit', (opts, { getState }) => {
  const { contact } = getState();

  const promise = new Promise<void>((resolve, reject) => {
    resolve();
  });

  return promise;
});

export const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    RFF_UPDATE_STATE: (state, action: PayloadAction<ContactState>) => {
      return action.payload;
    },
  },
});

export const { RFF_UPDATE_STATE } = contactSlice.actions;

export default contactSlice.reducer;

export interface ContactState {
  email: string;
  full_name: string;
  country: string;
  phone: string;
  description: string;
}
