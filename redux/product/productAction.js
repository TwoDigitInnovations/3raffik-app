import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';

//For get Product
export const getProductbyCompany = createAsyncThunk(
  'product/getProductbyCompany',
  async (params, thunkAPI) => {
    try {
      let url =`product/getProductByCompany?campaign_id=${params?.campaign_id}&page=${params?.p}`
      if (params?.text) {
        url +=`&key=${params.text}`
      } 
      if (params?.selectedStatus) {
        url +=`&selectedStatus=${params?.selectedStatus}`
      } 
      if (params?.selectedVerification) {
        url +=`&selectedVerification=${params?.selectedVerification}`
      } 

      const {data} = await axios.get(url);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getProductbyId = createAsyncThunk(
  'product/getProductbyId',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get(`product/${params}`);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For create Product with FormData support
export const createProduct = createAsyncThunk(
  'product/create-product',
  async (params, thunkAPI) => {
    try {
      // Check if params contains FormData (for image upload)
      if (params instanceof FormData) {
        // Use axios with FormData
        const response = await axios.post(`product/create-product`, params, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response;
      } else {
        // Regular JSON request
        const {data} = await axios.post(`product/create-product`, params);
        return data;
      }
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For update Product with FormData support
export const updateProduct = createAsyncThunk(
  'product/update',
  async (params, thunkAPI) => {
    try {
      // Check if params contains FormData (for image upload)
      if (params instanceof FormData) {
        // Use axios with FormData
        const response = await axios.post(`product/update`, params, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response;
      } else {
        // Regular JSON request
        const {data} = await axios.post(`product/update`, params);
        return data;
      }
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For delete Product
export const deleteProduct = createAsyncThunk(
  'product/delete',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.delete(`product/delete/${params}`,params);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getProductCount = createAsyncThunk(
  'product/getProductCount',
  async (campaign_id, thunkAPI) => {
    try {
      const {data} = await axios.get(`product/count/${campaign_id}`);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);


