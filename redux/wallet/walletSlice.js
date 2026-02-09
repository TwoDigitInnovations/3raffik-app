import {createSlice} from '@reduxjs/toolkit';
import {
  getAffiliateCommissions,
  getCompanyOrders,
  getAffiliateCommissionedProducts,
  requestWithdrawal
} from './walletAction';

const initialState = {
  isLoading: false,
  commissions: [],
  totalCommission: 0,
  orders: [],
  totalRevenue: 0,
  commissionedProducts: [],
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletData: (state) => {
      state.commissions = [];
      state.totalCommission = 0;
      state.orders = [];
      state.totalRevenue = 0;
      state.commissionedProducts = [];
      state.error = null;
    }
  },
  extraReducers: builder => {
    // Get Affiliate Commissions
    builder.addCase(getAffiliateCommissions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAffiliateCommissions.fulfilled, (state, action) => {
      state.commissions = action.payload?.commissions || [];
      state.totalCommission = action.payload?.totalCommission || 0;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getAffiliateCommissions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Get Company Orders
    builder.addCase(getCompanyOrders.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCompanyOrders.fulfilled, (state, action) => {
      state.orders = action.payload?.orders || [];
      state.totalRevenue = action.payload?.totalRevenue || 0;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCompanyOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Get Affiliate Commissioned Products
    builder.addCase(getAffiliateCommissionedProducts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAffiliateCommissionedProducts.fulfilled, (state, action) => {
      state.commissionedProducts = action.payload?.products || [];
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getAffiliateCommissionedProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Request Withdrawal
    builder.addCase(requestWithdrawal.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(requestWithdrawal.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(requestWithdrawal.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { clearWalletData } = walletSlice.actions;
export default walletSlice.reducer;