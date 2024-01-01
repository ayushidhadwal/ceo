import {createSlice} from '@reduxjs/toolkit';

const langSlice = createSlice({
  name: 'lang',
  initialState: {
    lang: 'en',
  },
  reducers: {
    changeLang: (state, action) => {
      return {
        ...state,
        lang: action?.payload,
      };
    },
  },
});
export const {changeLang} = langSlice.actions;
export default langSlice.reducer;
