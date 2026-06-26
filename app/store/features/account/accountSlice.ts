import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';

interface AccountState {
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  loading: false,
  error: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    createAccountStart(state, action: PayloadAction<FormData>) {
      void action;
      state.loading = true;
      state.error = null;
    },
    createAccountSuccess(state) {
      state.loading = false;
    },
    createAccountFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { createAccountStart, createAccountSuccess, createAccountFailure } = accountSlice.actions;

export const selectAccountLoading = (state: RootState) => state.account.loading;
export const selectAccountError = (state: RootState) => state.account.error;

export default accountSlice.reducer;
