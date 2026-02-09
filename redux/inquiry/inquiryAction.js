import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { showToaster } from '../../utils/toaster';

export const submitInquiry = createAsyncThunk(
  'inquiry/submit',
  async (data, thunkAPI) => {
    try {
      const response = await axios.post('inquiry/submit', data);
      showToaster('success', 'Inquiry submitted successfully');
      return response.data;
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error?.message || 'Failed to submit inquiry');
    }
  }
);
