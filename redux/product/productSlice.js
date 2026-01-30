import {createSlice} from '@reduxjs/toolkit';
import {createProduct,getProductbyCompany,updateProduct,deleteProduct,getProductbyId } from './productAction';


const initialState = {
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    //getProductbyCompany reducer
    builder.addCase(getProductbyCompany.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProductbyCompany.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getProductbyCompany.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //getProductbyId reducer
    builder.addCase(getProductbyId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProductbyId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getProductbyId.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //createproduct reducer
    builder.addCase(createProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //updateproduct reducer
    builder.addCase(updateProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //deleteCampaigb reducer
    builder.addCase(deleteProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default productSlice.reducer;
