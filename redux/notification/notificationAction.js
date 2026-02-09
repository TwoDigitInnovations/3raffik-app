import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';

export const sendConnectionRequest = createAsyncThunk(
  'notification/sendConnectionRequest',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post('notification/sendConnectionRequest', params);
      showToaster('success', data?.message);
      return data;
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getNotifications = createAsyncThunk(
  'notification/getNotifications',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get(`notification/getnotificationforapp?page=${params?.p}`);
      return data;
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const updateNotificationStatus = createAsyncThunk(
  'notification/updateStatus',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post('notification/updateStatus', params);
      showToaster('success', data?.message);
      return data;
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);