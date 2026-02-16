import { Animated, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import styles from './styles';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import Constants from '../../Assets/Helpers/constant';
import { signup } from '../../../redux/auth/authAction';
import { useDispatch } from 'react-redux';
import { navigate } from '../../../utils/navigationRef';
import { launchImageLibrary } from 'react-native-image-picker';

const SignUp = () => {
  const [showPass, setShowPass] = useState(true);
  const [documentFile, setDocumentFile] = useState(null);
  const dispatch = useDispatch();
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    conformpassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      conformpassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, assets) => {
      submit(values, assets)
    },
  });

  const handleDocumentPicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Alert.alert('Error', 'Failed to pick document');
      } else if (response.assets && response.assets[0]) {
        setDocumentFile(response.assets[0]);
      }
    });
  };

  const submit = async (value, { resetForm }) => {
    if (tabopt === 1 && !documentFile) {
      Alert.alert('Required', 'Please upload document verification for company registration');
      return;
    }

    if (documentFile) {
      // Create FormData for file upload (same as AddProduct.js)
      const formData = new FormData();
      formData.append('name', value.name);
      formData.append('email', value.email);
      formData.append('password', value.password);
      formData.append('role', tabopt === 1 ? 'company' : 'user');
      
      // Add image file (same format as AddProduct.js)
      formData.append('documentVerification', {
        uri: documentFile.uri,
        type: documentFile.type,
        name: documentFile.fileName || 'document.jpg'
      });
      
      dispatch(signup(formData))
        .unwrap()
        .then(data => {
          console.log('data', data);
          resetForm();
          setDocumentFile(null);
          navigate('SignIn');
        })
        .catch(error => {
          console.error('Signup failed:', error);
        });
    } else {
      // Regular JSON payload
      const payload = {
        name: value.name,
        email: value.email,
        password: value.password,
        role: tabopt === 1 ? 'company' : 'user',
      };

      dispatch(signup(payload))
        .unwrap()
        .then(data => {
          console.log('data', data);
          resetForm();
          navigate('SignIn');
        })
        .catch(error => {
          console.error('Signup failed:', error);
        });
    }
  };

  const [tabopt, settabopt] = useState(0);
  const toggleAnim = useRef(new Animated.Value(tabopt)).current;
  useEffect(() => {
    Animated.timing(toggleAnim, {
      toValue: tabopt,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [tabopt]);

  const translateX = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  return (
    <View style={styles.container}>
      {/* Background Image */}
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

          {/* Tab Toggle */}
          <View style={styles.btnCov}>
            {/* Animated sliding background */}
            <Animated.View
              style={[styles.slider, { transform: [{ translateX }] }]}
            />

            <TouchableOpacity
              style={styles.cencelBtn}
              onPress={() => settabopt(0)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.btntxt,
                  tabopt === 0 ? styles.activeText : styles.inactiveText,
                ]}
              >
                Affiliate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cencelBtn2}
              onPress={() => settabopt(1)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.btntxt,
                  tabopt === 1 ? styles.activeText : styles.inactiveText,
                ]}
              >
                Company
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <Text style={styles.inptxt}>Full Name</Text>
            <View style={styles.inpcov}>
              <TextInput
                style={styles.inputfield}
                placeholder="Enter full name"
                textAlign='left'
                placeholderTextColor={Constants.customgrey2}
                value={formik.values.name}
                onChangeText={formik.handleChange('name')}
                onBlur={formik.handleBlur('name')}
              />
            </View>
            {formik.touched.name && formik.errors.name &&
              <Text style={styles.require}>{formik.errors.name}</Text>
            }
            
            <Text style={styles.inptxt}>Email</Text>
            <View style={styles.inpcov}>
              <TextInput
                style={styles.inputfield}
                placeholder="Enter email"
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
                placeholder="Enter password"
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
            
            <Text style={styles.inptxt}>Confirm Password</Text>
            <View style={styles.inpcov}>
              <TextInput
                style={styles.inputfield}
                placeholder="Enter password"
                secureTextEntry={showPass}
                placeholderTextColor={Constants.customgrey2}
                value={formik.values.conformpassword}
                onChangeText={formik.handleChange('conformpassword')}
                onBlur={formik.handleBlur('conformpassword')}
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
            {formik.touched.conformpassword && formik.errors.conformpassword &&
              <Text style={styles.require}>{formik.errors.conformpassword}</Text>
            }

            {tabopt === 1 && (
              <>
                <Text style={styles.inptxt}>Document Verification</Text>
                <TouchableOpacity 
                  style={[styles.inpcov, { justifyContent: 'center', paddingVertical: 15 }]}
                  onPress={handleDocumentPicker}
                  activeOpacity={0.7}
                >
                  <Text style={{ 
                    flex: 1,
                    paddingHorizontal: 15,
                    color: documentFile ? Constants.black : Constants.customgrey2,
                    fontFamily: Constants.FONTS?.Medium || 'System',
                    fontSize: 16,
                  }}>
                    {documentFile ? (documentFile.fileName || documentFile.name || 'Document Selected') : 'Upload Document (Required for Company)'}
                  </Text>
                </TouchableOpacity>
                {documentFile && (
                  <Text style={[styles.require, { color: 'green', marginTop: 5 }]}>✓ {documentFile.fileName || 'Document uploaded'}</Text>
                )}
              </>
            )}
    
            <TouchableOpacity style={styles.btncov} onPress={formik.handleSubmit}>
              <Text style={styles.btntxt}>Create Account</Text>
            </TouchableOpacity>
    
            <Text style={styles.textcov2} onPress={()=>navigate('SignIn')}>
              <Text style={styles.lasttxt}>Have an account ? </Text>
              <Text style={[styles.lasttxt,{color:Constants.black,textDecorationLine:'underline'}]}>Sign In</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SignUp
