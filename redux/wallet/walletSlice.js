import {createSlice} from '@reduxjs/toolkit';
import {
  getAffiliateWallet,
  getCompanyWallet,
  getAffiliateCommissions,
  getCompanyOrders,
  getAffiliateCommissionedProducts,
  requestWithdrawal,
  getWithdrawalHistory
} from './walletAction';

const initialState = {
  isLoading: false,
  commissions: [],
  totalCommission: 0,
  availableBalance: 0,
  totalWithdrawn: 0,
  orders: [],
  totalRevenue: 0,
  commissionedProducts: [],
  withdrawals: [],
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletData: (state) => {
      state.commissions = [];
      state.totalCommission = 0;
      state.availableBalance = 0;
      state.totalWithdrawn = 0;
      state.orders = [];
      state.totalRevenue = 0;
      state.commissionedProducts = [];
      state.withdrawals = [];
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder.addCase(getAffiliateWallet.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAffiliateWallet.fulfilled, (state, action) => {
      state.commissions = action.payload?.commissions || [];
      state.totalCommission = action.payload?.totalCommission || 0;
      state.availableBalance = action.payload?.availableBalance || 0;
      state.totalWithdrawn = action.payload?.totalWithdrawn || 0;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getAffiliateWallet.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(getCompanyWallet.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCompanyWallet.fulfilled, (state, action) => {
      state.orders = action.payload?.orders || [];
      state.totalRevenue = action.payload?.totalRevenue || 0;
      state.availableBalance = action.payload?.availableBalance || 0;
      state.totalWithdrawn = action.payload?.totalWithdrawn || 0;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getCompanyWallet.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

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

    builder.addCase(getWithdrawalHistory.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getWithdrawalHistory.fulfilled, (state, action) => {
      state.withdrawals = action.payload || [];
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getWithdrawalHistory.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { clearWalletData } = walletSlice.actions;
export default walletSlice.reducer;
