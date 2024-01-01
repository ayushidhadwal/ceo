import {createSlice} from '@reduxjs/toolkit';

const langSlice = createSlice({
  name: 'lang',
  initialState: {
    lang: 'english',
    local: 'en',
  },
  reducers: {
    changeLanguage: (state, action: any) => {
      switch (action.payload.type) {
        case 'english': {
          return {
            ...state,
            lang: action.payload.lang,
            local: action.payload.local,
          };
        }
        case 'arabic': {
          return {
            ...state,
            lang: action.payload.lang,
            local: action.payload.local,
          };
        }
        default:
          return state;
      }
    },
  },
});

export default langSlice.reducer;

export const changeLanguage = langSlice.actions.changeLanguage;
