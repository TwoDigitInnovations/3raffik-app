import {createAsyncThunk} from '@reduxjs/toolkit';
import {showToaster} from '../../utils/toaster';
import axios from '../../utils/axios';

//For get Campaign
export const getCampaignbyCompany = createAsyncThunk(
  'campaign/getCampaignbyCompany',
  async (params, thunkAPI) => {
    try {
      let url =`campaign/getCampaignByCompany?page=${params?.p}`
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

//For get All Campaigns
export const getAllCampaigns = createAsyncThunk(
  'campaign/getAllCampaigns',
  async (params, thunkAPI) => {
    try {
      let url =`campaign/getAllCampaigns?page=${params?.p}`
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

export const getMyCampaigns = createAsyncThunk(
  'campaign/getMyCampaigns',
  async (params, thunkAPI) => {
    try {
      let url =`campaign/getMyCampaigns?page=${params?.p}`
      if (params?.text) {
        url +=`&key=${params.text}`
      } 

      const {data} = await axios.get(url);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
export const getCampaignbyId = createAsyncThunk(
  'campaign/getCampaignbyId',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.get(`campaign/${params}`);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For create Campaign
export const createCampaign = createAsyncThunk(
  'campaign/create-campaign',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post(`campaign/create-campaign`,params,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },});
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
//For update Campaign
export const updateCampaign = createAsyncThunk(
  'campaign/update',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post(`campaign/update`,params,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },});
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
//For delete Campaign
export const deleteCampaign = createAsyncThunk(
  'campaign/delete',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.delete(`campaign/delete/${params}`,params);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);


