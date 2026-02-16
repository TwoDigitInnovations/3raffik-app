import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Track click when QR is scanned or link is shared
export const trackClick = createAsyncThunk(
  'click/trackClick',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post('click/track', params);
      return data;
    } catch (error) {
      console.error('Track click error:', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
