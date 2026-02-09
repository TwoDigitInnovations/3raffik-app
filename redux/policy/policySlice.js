import { createSlice } from '@reduxjs/toolkit';
import { getPrivacyPolicy, getTermsConditions } from './policyAction';

const initialState = {
  privacyPolicy: null,
  termsConditions: null,
  loading: false,
  error: null,
};

const policySlice = createSlice({
  name: 'policy',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Privacy Policy
      .addCase(getPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.privacyPolicy = action.payload; // Direct payload, not payload.data
        console.log('📦 Redux State Updated - Privacy Policy:', action.payload);
      })
      .addCase(getPrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Terms & Conditions
      .addCase(getTermsConditions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTermsConditions.fulfilled, (state, action) => {
        state.loading = false;
        state.termsConditions = action.payload; // Direct payload, not payload.data
        console.log('📦 Redux State Updated - Terms & Conditions:', action.payload);
      })
      .addCase(getTermsConditions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default policySlice.reducer;
