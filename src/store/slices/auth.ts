import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken(state: AuthState, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
});

export default authSlice;
