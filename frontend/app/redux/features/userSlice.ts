import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  email: string;
}

const initialState: UserState = {
  email: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEmailAddress: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearEmailAddress: (state) => {
      state.email = initialState.email; 
    },
  },
});

export const { setEmailAddress, clearEmailAddress } = userSlice.actions;

export default userSlice.reducer;
