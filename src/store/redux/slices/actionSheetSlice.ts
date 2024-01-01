import {createSlice} from '@reduxjs/toolkit';

const sheetSlice = createSlice({
  name: 'sheet',
  initialState: {
    isOpen: false,
  },
  reducers: {
    toggleSheet: (state, action) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export default sheetSlice.reducer;

export const toggleSheet = sheetSlice.actions.toggleSheet;
