import { Animated, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import styles from './styles';
import * as Yup from 'yup';
import { Formik, useFormik } from 'formik';
import Constants from '../../Assets/Helpers/constant';
import { signup } from '../../../redux/auth/authAction';
import { useDispatch } from 'react-redux';
import { navigate } from '../../../utils/navigationRef';

const SignUp = () => {
  const [showPass, setShowPass] = useState(true);
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
        name: '',
        email: '',
        password: '',
        conformpassword:'',
      },
      validationSchema: validationSchema,
      onSubmit: (values, assets) => {
        submit(values, assets)
      },
    });
  
   const submit = async (value, { resetForm }) => {
  
      dispatch(signup({ ...value, role: tabopt === 1 ? 'company' : 'user' }))
        .unwrap()
        .then(data => {
          console.log('data', data);
          resetForm();
          navigate('SignIn');
        })
        .catch(error => {
          console.error('Signin failed:', error);
        });
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
      <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}
            >
      <ScrollView showsVerticalScrollIndicator={false}>
    
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

            <Text style={styles.inptxt}>Full Name</Text>
            <View style={styles.inpcov}>
              <TextInput
                style={styles.inputfield}
                placeholder="Enter Full Name"
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
            <Text style={styles.inptxt}>Confirm Password</Text>
            <View style={styles.inpcov}>
              <TextInput
                style={styles.inputfield}
                placeholder="Enter Confirm Password"
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
    
                <TouchableOpacity style={styles.btncov} onPress={formik.handleSubmit}>
                  <Text style={styles.btntxt}>Create Account</Text>
                </TouchableOpacity>
    
                <Text style={styles.textcov2} onPress={()=>navigate('SignUp')}>
                  <Text style={styles.lasttxt}>Have an account ? </Text>
                  <Text style={[styles.lasttxt,{color:Constants.black,textDecorationLine:'underline'}]}>Sign In</Text>
                </Text>
          </ScrollView>
          </KeyboardAvoidingView>
  )
}

export default SignUp
