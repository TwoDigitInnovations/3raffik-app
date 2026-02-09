import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import { goBack } from '../../../utils/navigationRef';
import { useDispatch, useSelector } from 'react-redux';
import { submitInquiry } from '../../../redux/inquiry/inquiryAction';

const HelpCenter = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inquiryModel, setInquiryModel] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });

  const handleSubmit = async () => {
    if (!inquiryModel.name || !inquiryModel.email || !inquiryModel.subject || !inquiryModel.message) {
      setSubmitted(true);
      return;
    }

    try {
      setLoading(true);
      await dispatch(submitInquiry(inquiryModel)).unwrap();
      
      Alert.alert(
        'Success',
        'Your inquiry has been submitted successfully. We will get back to you soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Submit inquiry error:', error);
      Alert.alert('Error', typeof error === 'string' ? error : 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setInquiryModel({
      name: user?.name || '',
      email: user?.email || '',
      subject: '',
      message: '',
    });
    setSubmitted(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header item={'Help Center'} showback={true} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How can we help you?</Text>
            <Text style={styles.infoText}>
              Fill out the form below and our support team will get back to you as soon as possible.
            </Text>
          </View>

         
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your name"
                placeholderTextColor={Constants.customgrey2}
                value={inquiryModel.name}
                onChangeText={name => setInquiryModel({...inquiryModel, name})}
              />
            </View>
            {submitted && !inquiryModel.name && (
              <Text style={styles.errorText}>Name is required</Text>
            )}
          </View>

        
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor={Constants.customgrey2}
                keyboardType="email-address"
                autoCapitalize="none"
                value={inquiryModel.email}
                onChangeText={email => setInquiryModel({...inquiryModel, email})}
              />
            </View>
            {submitted && !inquiryModel.email && (
              <Text style={styles.errorText}>Email is required</Text>
            )}
          </View>

        
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter subject"
                placeholderTextColor={Constants.customgrey2}
                value={inquiryModel.subject}
                onChangeText={subject => setInquiryModel({...inquiryModel, subject})}
              />
            </View>
            {submitted && !inquiryModel.subject && (
              <Text style={styles.errorText}>Subject is required</Text>
            )}
          </View>

       
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message *</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Describe your issue or question..."
                placeholderTextColor={Constants.customgrey2}
                multiline={true}
                numberOfLines={6}
                value={inquiryModel.message}
                onChangeText={message => setInquiryModel({...inquiryModel, message})}
              />
            </View>
            {submitted && !inquiryModel.message && (
              <Text style={styles.errorText}>Message is required</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}>
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting...' : 'Submit Inquiry'}
            </Text>
          </TouchableOpacity>

          {/* <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Other ways to reach us:</Text>
            <Text style={styles.contactText}>Email: support@3ruffik.com</Text>
            <Text style={styles.contactText}>Phone: +91-8957958547</Text>
          </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default HelpCenter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
  },
  headerContainer: {
    backgroundColor: '#FFCC00',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  infoCard: {
    backgroundColor: '#FFF9E6',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFCC00',
  },
  infoTitle: {
    fontSize: 18,
    color: Constants.black,
    fontFamily: FONTS.Bold,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Constants.customgrey2,
    fontFamily: FONTS.Regular,
    lineHeight: 20,
  },
  inputGroup: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#F9F7ED',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Regular,
  },
  textAreaContainer: {
    minHeight: 120,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'flex-start',
  },
  textArea: {
    textAlignVertical: 'top',
    width: '100%',
    height: 100,
  },
  errorText: {
    color: Constants.red,
    fontFamily: FONTS.Regular,
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#FFCC00',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  contactInfo: {
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  contactTitle: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: Constants.customgrey2,
    fontFamily: FONTS.Regular,
    marginBottom: 8,
  },
});
