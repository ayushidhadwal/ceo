

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// import {postApi} from '../../api/apiService';
// import {endPoint} from '../../api/endpoint';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    data: {},
  },
  reducers: {
    auth: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
  // extraReducers: builder => {
  //   builder
  //     .addCase(OAuth.pending, (state: any) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(OAuth.fulfilled, (state: any, action) => {
  //       (state.data = action.payload), (state.status = 'success');
  //     })
  //     .addCase(OAuth.rejected, (state: any) => {
  //       state.status = 'failed';
  //     });
  // },
});

export const {auth} = authSlice.actions;
export default authSlice.reducer;

// export const OAuth = createAsyncThunk('oauth', async () => {
 

//   const response = await postApi(endPoint.oauth2(), {
//     old_token: '',
//     grant_type: 'client_credentials',
//   })

  
//   console.log("HElooooooooooooooooooooooooooooooooooooooo");
//   console.log("Generated token is:- ");
//   console.log(response);
 
//   response.isGuest = true;
//   response.isLogin = false;

//   return response;
// });
