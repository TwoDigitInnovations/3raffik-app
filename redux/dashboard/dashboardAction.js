import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';

// Get Company Dashboard Stats
export const getCompanyDashboard = createAsyncThunk(
  'dashboard/getCompanyDashboard',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get('dashboard/company');
      return data;
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

// Get Affiliate Dashboard Stats
export const getAffiliateDashboard = createAsyncThunk(
  'dashboard/getAffiliateDashboard',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get('dashboard/affiliate');
      return data;
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
