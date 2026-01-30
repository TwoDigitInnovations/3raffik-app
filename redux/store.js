import {
  useSelector as useAppSelector,
  useDispatch as useAppDispatch,
} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import campaignSlice from './campaign/campaignSlice';
import productSlice from './product/productSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    campaign: campaignSlice,
    product: productSlice,
  },
});

export const useDispatch = () => useAppDispatch();
export const useSelector = useAppSelector;
