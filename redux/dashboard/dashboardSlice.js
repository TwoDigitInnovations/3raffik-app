import {createSlice} from '@reduxjs/toolkit';
import {getCompanyDashboard, getAffiliateDashboard} from './dashboardAction';

const initialState = {
  companyStats: null,
  affiliateStats: null,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Company Dashboard
    builder.addCase(getCompanyDashboard.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCompanyDashboard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.companyStats = action.payload;
      state.error = null;
    });
    builder.addCase(getCompanyDashboard.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Affiliate Dashboard
    builder.addCase(getAffiliateDashboard.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAffiliateDashboard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.affiliateStats = action.payload;
      state.error = null;
    });
    builder.addCase(getAffiliateDashboard.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default dashboardSlice.reducer;
