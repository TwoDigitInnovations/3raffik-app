import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState} from 'react';
import Constants, { FONTS} from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import { ArrowRight, Pencil } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { getProductCount } from '../../../redux/product/productAction';
import { navigate } from '../../../utils/navigationRef';

const CompanyCampaignDetail = (props) => {
  const campaignData = props?.route?.params;
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const [productCount, setProductCount] = useState(0);
  
  const isValidUrl = (url) =>
    typeof url === 'string' && /^https?:\/\//i.test(url);

  useEffect(() => {
    if (campaignData?._id) {
      dispatch(getProductCount(campaignData._id))
        .unwrap()
        .then(data => {
          setProductCount(data.count);
        })
        .catch(error => {
          console.error('Get Product Count failed:', error);
        });
    }
  }, [campaignData]);

  return (
    <View style={styles.container}>
      <Header item={"Campaign Detail"} showback={true}/>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        
        {/* Campaign Image */}
        <Image 
          source={
            !imageError && isValidUrl(campaignData?.photo)
              ? { uri: campaignData.photo }
              : require('../../Assets/Images/cambacg.png')
          } 
          style={styles.campaignImage}
          onError={() => setImageError(true)}
          resizeMode="cover"
        />

        <View style={styles.contentContainer}>
          {/* Campaign Name */}
          <Text style={styles.campaignName}>{campaignData?.name || 'Beauty Product'}</Text>
          
          {/* Website URL */}
          <Text style={styles.websiteLabel}>Website url - 
            <Text style={styles.websiteUrl}> {campaignData?.web_url || 'https://abcss'}</Text>
          </Text>
          
          {/* Verification Status */}
          <View style={styles.verificationContainer}>
            <Text style={styles.verificationLabel}>Verification Status</Text>
            <Text style={[styles.verificationBadge, {
              backgroundColor: campaignData?.verified_status === 'Verified' ? '#4CAF50' : 
                             campaignData?.verified_status === 'Rejected' ? '#F44336' : '#EAAA00'
            }]}>
              {campaignData?.verified_status || 'Pending'}
            </Text>
          </View>
          
          {/* Description */}
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.descriptionText}>
            {campaignData?.description || 
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text'}
          </Text>
        </View>
      </ScrollView>

   
      <View style={styles.bottomButtonsContainer}>
      
        
        <TouchableOpacity 
          style={styles.productsButton}
          onPress={() => navigate('ProductList', { campaign_id: campaignData?._id })}
        >
          <Text style={styles.buttonText}>Total Products {productCount}</Text>
          <ArrowRight size={20} color={Constants.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CompanyCampaignDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    padding: 20,
  },
  scrollView: {
    flex: 1,
    marginTop: 15,
  },
  campaignImage: {
    height: 250,
    width: '100%',
    borderRadius: 15,
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 5,
  },
  campaignName: {
    fontSize: 24,
    fontFamily: FONTS.Bold,
    color: Constants.black,
    marginBottom: 15,
  },
  websiteLabel: {
    fontSize: 16,
    fontFamily: FONTS.Medium,
    color: Constants.customgrey2,
    marginBottom: 20,
  },
  websiteUrl: {
    color: Constants.black,
    fontFamily: FONTS.Medium,
  },
  verificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  verificationLabel: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
  verificationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 12,
    fontFamily: FONTS.SemiBold,
    color: Constants.white,
  },
  descriptionLabel: {
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    color: Constants.customgrey2,
    lineHeight: 22,
    marginBottom: 10,
  },
  bottomButtonsContainer: {
    paddingVertical: 55,
   
  },
  editButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  productsButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
});