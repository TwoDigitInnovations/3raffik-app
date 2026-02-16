import {createAsyncThunk} from '@reduxjs/toolkit';
import {deleteAuthToken, getAuthToken, setAuthToken} from '../../utils/storage';
import {showToaster} from '../../utils/toaster';
import axios, { removeApiToken, setApiToken} from '../../utils/axios';
import {navigate, reset} from '../../utils/navigationRef';
import { updateOneSignalIdToBackend } from '../../src/services/oneSignalService';

// For Check user login or not
export const checkLogin = createAsyncThunk(
  'auth/checkLogin',
  async (_, thunkAPI) => {
    try {
      const token = await getAuthToken();
      console.log("token",token)
      if (!token) {
        await deleteAuthToken();
        reset('Auth');
        return null;
      }
      setApiToken(token);
      const {data} = await axios.get('auth/profile');
      if (data) {
        if (data?.role==='company') {
            // if (data?.status==='Approved') {
              reset('Company');
            // } else {
            //   navigate('Form')
            // }
          } else {
            reset('App');
          }
        return data;
      } else {
        await deleteAuthToken();
        reset('Auth');
        return null;
      }
    } catch (error) {
      await deleteAuthToken();
      reset('Auth');
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For login user
export const login = createAsyncThunk(
  'auth/login',
  async (params, thunkAPI) => {
    try {
      const res = await axios.post('auth/login', params);
      
      // Check if account is suspended
      if (res?.data?.status === 'suspended' || res?.status === false) {
        return thunkAPI.rejectWithValue({
          response: {
            data: {
              status: 'suspended',
              message: 'Your account has been suspended. Please contact support team.'
            }
          }
        });
      }
      
      if (res?.data) {
          console.log('=== LOGIN SUCCESS ===');
          console.log('User role:', res?.data?.user?.role);
          console.log('User ID:', res?.data?.user?.id);
          
          setApiToken(res?.data.token);
          console.log('logintoken',res?.data.token)
          await setAuthToken(res?.data.token);
          
          console.log('=== CALLING ONESIGNAL UPDATE ===');
          try {
            await updateOneSignalIdToBackend();
            console.log('OneSignal update completed');
          } catch (error) {
            console.log('=== ONESIGNAL UPDATE ERROR ===');
            console.log('Error:', error.message);
            console.log('Error stack:', error.stack);
          }
          
          if (res?.data?.user?.role==='company') {
              reset('Company');
          } else {
            reset('App');
          }
      }
      return res?.data;
    } catch (error) {
      // Check if error message contains suspended
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Login failed';
      
      if (errorMessage?.includes('suspended')) {
        // Don't show toast, let SignIn.js handle modal
        return thunkAPI.rejectWithValue({
          message: errorMessage,
          isSuspended: true
        });
      } else {
        showToaster('error', errorMessage);
      }
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For signup user
export const signup = createAsyncThunk(
  'auth/signup',
  async (params, thunkAPI) => {
    try {
      // Check if params contains FormData (for document upload) - same as createProduct
      if (params instanceof FormData) {
        // Use axios with FormData
        const response = await axios.post('auth/register', params, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showToaster('success', response?.data?.message || response?.message);
        return response?.data || response;
      } else {
        // Regular JSON request
        const res = await axios.post('auth/register', params);
        showToaster('success', res?.data?.message);
        return res?.data;
      }
    } catch (error) {
      showToaster('error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For sendOtp
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post('auth/sendOTP', params);
      showToaster('success',data?.message);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For verify Otp
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post('auth/verifyOtp', params);
      showToaster('success',data?.message);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For set new password
export const resetPassword = createAsyncThunk(
  'auth/changePassword',
  async (params, thunkAPI) => {
    try {
      const {data} = await axios.post(
        'auth/changePassword',
        params,
      );
      if (data) {
        navigate('SignIn');
      }
      showToaster('success',data?.message);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);
//For getprofile
export const getProfile = createAsyncThunk(
  'auth/getprofile',
  async (params, thunkAPI) => {
    try {
      const {data}= await axios.get('auth/profile',params,);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },)
//For updateprofile
export const updateProfile = createAsyncThunk(
  'auth/updateprofile',
  async (params, thunkAPI) => {
    try {
      const {data}= await axios.post('auth/updateprofile',params,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToaster('success',data?.message);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

//For getprofile
export const getAffilites = createAsyncThunk(
  'auth/getAllAffiliates',
  async (params, thunkAPI) => {
    try {
      const {data}= await axios.get(`auth/getAllAffiliates?page=${params?.p}`);
      return data;
    } catch (error) {
      showToaster('error',error);
      return thunkAPI.rejectWithValue(error);
    }
  },)

//For logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (params, thunkAPI) => {
    removeApiToken();
    await deleteAuthToken();
    reset('Auth');
  },
);

