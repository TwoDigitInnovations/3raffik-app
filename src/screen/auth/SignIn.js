import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import { navigate, reset } from '../../../utils/navigationRef';
import Constants from '../../Assets/Helpers/constant';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
// import { OneSignal } from 'react-native-onesignal';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/auth/authAction';

const SignIn = () => {
  const [showPass, setShowPass] = useState(true);
  const [showSuspendedModal, setShowSuspendedModal] = useState(false);
  const dispatch = useDispatch();
  
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, assets) => {
      submit(values, assets)
    },
  });

  const submit = async (value, { resetForm }) => {
    console.log('enter')
    // const player_id = await OneSignal.User.pushSubscription.getIdAsync()
    // const device_token = await OneSignal.User.pushSubscription.getTokenAsync()

    //     value.player_id= player_id
    //     value.device_token =device_token,

    dispatch(login(value))
      .unwrap()
      .then(data => {
        console.log('data', data);
        resetForm();
      })
      .catch(error => {
        console.error('Signin failed:', error);
        
        // Check if account is suspended
        if (error?.isSuspended || 
            error?.message?.includes('suspended') ||
            error?.includes?.('suspended')) {
          setShowSuspendedModal(true);
        }
      });
  };
  
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
  
      <Image 
        source={require('../../Assets/Images/over3.png')} 
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          style={styles.scrollContainer}>

          <View style={styles.imgcov}>
            <Image source={require('../../Assets/Images/newprofile.png')} style={styles.proimg} />
          </View>
          <Text style={styles.headtxt}>Login</Text>

          
          <View style={styles.formContainer}>
            
            <Text style={styles.inptxt}>Email</Text>
            <View style={styles.inpcov}>
              <TextInput
                style={styles.inputfield}
                placeholder="Enter Email"
                textAlign='left'
                placeholderTextColor={Constants.customgrey2}
                value={formik.values.email}
                onChangeText={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
              />
            </View>
            {formik.touched.email && formik.errors.email &&
              <Text style={styles.require}>{formik.errors.email}</Text>
            }
            
            <Text style={styles.inptxt}>Password</Text>
            <View style={styles.inpcov}>
              <TextInput
                style={styles.inputfield}
                placeholder="Enter Password"
                secureTextEntry={showPass}
                placeholderTextColor={Constants.customgrey2}
                value={formik.values.password}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
              />

              <TouchableOpacity
                onPress={() => {
                  setShowPass(!showPass);
                }}
                style={[styles.iconView, { borderRightWidth: 0 }]}>
                <Image
                  source={
                    showPass
                      ? require('../../Assets/Images/eye-1.png')
                      : require('../../Assets/Images/eye.png')
                  }
                  style={{ height: 28, width: 28 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {formik.touched.password && formik.errors.password &&
              <Text style={styles.require}>{formik.errors.password}</Text>
            }

            <TouchableOpacity style={styles.btncov} onPress={formik.handleSubmit}>
              <Text style={styles.btntxt}>Login</Text>
            </TouchableOpacity>
            
            <Text style={styles.forgtxt} onPress={() => navigate('ForgotPassword')}>
              Forgot Password ?
            </Text>

            {!keyboardVisible && (
              <Text style={styles.textcov2} onPress={() => navigate('SignUp')}>
                <Text style={styles.lasttxt}>Don't have an account ? </Text>
                <Text style={[styles.lasttxt, { color: Constants.black, textDecorationLine: 'underline' }]}>Sign Up</Text>
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Suspended Account Modal */}
      <Modal
        visible={showSuspendedModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuspendedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Icon */}
            <View style={styles.modalIconContainer}>
              <Text style={styles.modalIcon}>⚠️</Text>
            </View>

            {/* Title */}
            <Text style={styles.modalTitle}>Account Suspended</Text>

            {/* Message */}
            <Text style={styles.modalMessage}>
              Your account has been suspended. You cannot login at this time. Please contact our support team for assistance.
            </Text>

            {/* Help Center Link */}
            <TouchableOpacity
              onPress={() => {
                setShowSuspendedModal(false);
                navigate('HelpCenter');
              }}
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              <Text style={[styles.modalMessage, { 
                color: Constants.primary, 
                textDecorationLine: 'underline',
                fontWeight: '600'
              }]}>
                Visit Help Center
              </Text>
            </TouchableOpacity>

            {/* Button */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowSuspendedModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SignIn;