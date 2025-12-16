import {
  useSelector as useAppSelector,
  useDispatch as useAppDispatch,
} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import campaignSlice from './campaign/campaignSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    campaign: campaignSlice,
  },
});

export const useDispatch = () => useAppDispatch();
export const useSelector = useAppSelector;
