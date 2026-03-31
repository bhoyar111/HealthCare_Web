import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timezone: localStorage.getItem('appTimezone') || 'America/New_York'
};

const timezoneSlice = createSlice({
  name: 'timezone',
  initialState,
  reducers: {
    setTimezone: (state, action) => {
      state.timezone = action.payload;
      // Optional: persist to localStorage
      localStorage.setItem('appTimezone', action.payload);
    },
  },
});

export const { setTimezone } = timezoneSlice.actions;
export default timezoneSlice.reducer;


