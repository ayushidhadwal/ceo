import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { getApi, getAuthApi } from '../../api/apiService';
// import { endPoint } from '../../api/endpoint';

const bookingSlice = createSlice({
  name: 'cart',
  initialState: {
    total_product_count: 0,
    vendor_id: null,
  },
  reducers: {
    addToCart: (state, action) => {
      return {
        ...state,
        total_product_count: action.payload?.total_product_count,
        vendor_id: action.payload?.vendor_id,
      };
    },
  },

  // extraReducers: builder => {
  //   builder
  //     .addCase(OCart.pending, (state: any) => {
  //       state.status = 'loading';
  //     })
  //     .addCase(OCart.fulfilled, (state: any, action) => {
  //       if (action.payload.length != 0) {
  //         (state.total_product_count = action.payload?.products?.length),
  //           (state.vendor_id = action.payload?.vendor_ids[0])
  //       }
  //       (state.status = 'success');
  //     })
  //     .addCase(OCart.rejected, (state: any) => {
  //       state.status = 'failed';
  //     });
  // },
});

export const { addToCart } = bookingSlice.actions;
export default bookingSlice.reducer;

// export const OCart = createAsyncThunk('ocart', async (data:any) => {

//   const {accessToken,tokenType}=data;
//   const response = await getAuthApi(endPoint.getCart(), accessToken, tokenType)


//   console.log("Cart State INITIALIZATION CALLEDDDDDD");
//   console.log(accessToken);
//   console.log(tokenType);

//   console.log(response);



//   return response;
// });

