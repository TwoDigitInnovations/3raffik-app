import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { useDispatch, useSelector } from 'react-redux';
import { getTermsConditions } from '../../../redux/policy/policyAction';
import Header from '../../Assets/Component/Header';

const TermsConditions = () => {
  const dispatch = useDispatch();
  const { termsConditions, loading, error } = useSelector(state => state.policy);

  useEffect(() => {
    dispatch(getTermsConditions());
  }, []);

  // Function to decode HTML entities and strip HTML tags
  const stripHtml = (html) => {
    if (!html) return '';
    
    // First decode HTML entities
    let decoded = html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');
    
    // Then strip HTML tags and format
    return decoded
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<li>/gi, '• ')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlayWrapper}>
        <View style={styles.overlayColor} />
      </View>
      
      <View style={styles.verticalOverlayWrapper}>
        <View style={styles.verticalOverlayColor} />
      </View>
      
      <View style={{ marginHorizontal: 20, zIndex: 2, paddingTop: 20 }}>
        <Header item={'Terms & Conditions'} showback={true} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Constants.custom_yellow} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : termsConditions?.content ? (
          <View style={styles.contentWrapper}>
            <Text style={styles.contentText}>
              {stripHtml(termsConditions.content)}
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No terms & conditions available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TermsConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  overlayWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 170,
    zIndex: 1,
    overflow: 'hidden',
    borderBottomLeftRadius: 100,
  },
  overlayColor: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFCC00',
  },
  verticalOverlayWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 80,
    zIndex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 50,
  },
  verticalOverlayColor: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFCC00',
  },
  scrollView: {
    zIndex: 2,
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  contentWrapper: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentText: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Regular,
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: Constants.customgrey2,
    fontFamily: FONTS.Medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: Constants.customgrey2,
    fontFamily: FONTS.Medium,
  },
});
