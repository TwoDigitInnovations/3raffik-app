import {createSlice} from '@reduxjs/toolkit';
import {createCampaign,getCampaignbyCompany,updateCampaign,deleteCampaign,getCampaignbyId } from './campaignAction';


const initialState = {
  isLoading: false,
  error: null,
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    //getCampaignbyCompany reducer
    builder.addCase(getCampaignbyCompany.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCampaignbyCompany.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCampaignbyCompany.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //getcampaignbyid reducer
    builder.addCase(getCampaignbyId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCampaignbyId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCampaignbyId.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //createcampaign reducer
    builder.addCase(createCampaign.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createCampaign.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(createCampaign.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //updatecampaign reducer
    builder.addCase(updateCampaign.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateCampaign.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(updateCampaign.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    //deleteCampaigb reducer
    builder.addCase(deleteCampaign.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteCampaign.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(deleteCampaign.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default campaignSlice.reducer;
