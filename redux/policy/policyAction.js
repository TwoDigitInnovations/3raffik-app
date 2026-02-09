import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { showToaster } from '../../utils/toaster';

// Get Privacy Policy
export const getPrivacyPolicy = createAsyncThunk(
  'policy/getPrivacyPolicy',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('policy/privacy');
      return data;
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error?.message || 'Failed to load privacy policy');
    }
  }
);

// Get Terms & Conditions
export const getTermsConditions = createAsyncThunk(
  'policy/getTermsConditions',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('policy/terms');
      return data;
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error?.message || 'Failed to load terms & conditions');
    }
  }
);
