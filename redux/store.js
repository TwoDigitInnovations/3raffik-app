import {
  useSelector as useAppSelector,
  useDispatch as useAppDispatch,
} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import campaignSlice from './campaign/campaignSlice';
import productSlice from './product/productSlice';
import walletSlice from './wallet/walletSlice';
import policySlice from './policy/policySlice';
import dashboardSlice from './dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    campaign: campaignSlice,
    product: productSlice,
    wallet: walletSlice,
    policy: policySlice,
    dashboard: dashboardSlice,
  },
});

export const useDispatch = () => useAppDispatch();
export const useSelector = useAppSelector;