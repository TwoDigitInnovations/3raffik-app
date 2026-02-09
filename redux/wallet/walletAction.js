import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';


export const getAffiliateCommissions = createAsyncThunk(
  'wallet/getAffiliateCommissions',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get(`order/affiliate/commissions?page=${params?.page || 1}`);
      return data;
    } catch (error) {
      showToaster('error', error.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);


export const getCompanyOrders = createAsyncThunk(
  'wallet/getCompanyOrders',
  async (params, thunkAPI) => {
    try {
      console.log('Company Orders Action - Making API call');
      const {data} = await axios.get(`order/company/orders?page=${params?.page || 1}`);
      console.log('Company Orders Action - Response:', data);
      return data;
    } catch (error) {
      console.error('Company Orders Action - Error:', error.response?.data || error.message);
      showToaster('error', error.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);


export const getAffiliateCommissionedProducts = createAsyncThunk(
  'wallet/getAffiliateCommissionedProducts',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get(`order/affiliate/commissioned-products?page=${params?.page || 1}`);
      return data;
    } catch (error) {
      showToaster('error', error.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);


export const requestWithdrawal = createAsyncThunk(
  'wallet/requestWithdrawal',
  async (params, thunkAPI) => {
    try {
     
      showToaster('success', 'Withdrawal request submitted successfully');
      return { message: 'Withdrawal request submitted' };
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);