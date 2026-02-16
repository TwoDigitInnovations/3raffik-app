import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';

export const getAffiliateWallet = createAsyncThunk(
  'wallet/getAffiliateWallet',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get('wallet/affiliate');
      return data;
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getCompanyWallet = createAsyncThunk(
  'wallet/getCompanyWallet',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get('wallet/company');
      return data;
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

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
      const {data} = await axios.get(`order/company/orders?page=${params?.page || 1}`);
      return data;
    } catch (error) {
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
      const {data} = await axios.post('wallet/withdraw', params);
      showToaster('success', 'Withdrawal request submitted successfully');
      return data;
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getWithdrawalHistory = createAsyncThunk(
  'wallet/getWithdrawalHistory',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get('wallet/withdrawals');
      return data;
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
