import {createSlice} from '@reduxjs/toolkit';
// import {getApi} from '../../api/apiService';
// import {endPoint} from '../../api/endpoint';

const masterSlice = createSlice({
  name: 'master',
  initialState: {
    isOpen: false,
    showRegisterForm: false,
    appData: {Partner_contract_url: '', Trainer_contract_url: ''},
    initialFromValues: {
      name: '',

      email: '',

      mobileNumber: '',

      password: '',

      otp: '',

      query: '',
    },
    selectedCountry: {
      title_en: 'Kuwait',
    },
    allCountries: [],
  },
  reducers: {
    // area: (state, action) => {
    //   return {
    //     ...state,
    //     areaList: action.payload,
    //   };
    // },
    toggleSheet: (state, action) => {
      // if (state.isOpen) {
      state.initialFromValues = {
        name: '',

        email: '',

        mobileNumber: '',

        password: '',

        otp: '',

        query: '',
      };
      console.log('Form values cleared!!!');
      // }
      state.isOpen = !state.isOpen;
    },

    toggleShowRegisterForm: (state, action) => {
      state.showRegisterForm = action.payload;
    },

    setAppData: (state, action) => {
      state.appData = action.payload;
    },

    setSelectedCountry: (state, action) => {
      state.selectedCountry = action.payload;
    },

    setAllCountry: (state, action) => {
      state.allCountries = action.payload;
    },
  },
  // extraReducers: builder => {
  //   builder
  //     .addCase(getArea.pending, state => {
  //       state.status = 'loading';
  //     })
  //     .addCase(getArea.fulfilled, (state: any, action) => {
  //       (state.data = action.payload), (state.status = 'success');
  //     })
  //     .addCase(getArea.rejected, state => {
  //       state.status = 'failed';
  //     });
  // },
});

export const {
  toggleSheet,
  setAppData,
  toggleShowRegisterForm,
  setSelectedCountry,
  setAllCountry,
} = masterSlice.actions;
export default masterSlice.reducer;

// export const getArea = createAsyncThunk('areas', () => {

//   const response = getApi(endPoint.areas());

//   return response;
// });
