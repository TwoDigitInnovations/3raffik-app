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
import { ArrowRight } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { getProductCount } from '../../../redux/product/productAction';
import { sendConnectionRequest } from '../../../redux/notification/notificationAction';
import { navigate } from '../../../utils/navigationRef';

const CampaignDetail = (props) => {
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

  const handleConnectionRequest = () => {
    if (campaignData?.created_by?._id) {
      dispatch(sendConnectionRequest({ company_id: campaignData.created_by._id }))
        .unwrap()
        .then(() => {
          console.log('Connection request sent successfully');
        })
        .catch(error => {
          console.error('Send connection request failed:', error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Header item={"Campaigns Detail"} showback={true}/>
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
          <Text style={styles.verificationLabel}>Verification Status</Text>
          
          {/* Description */}
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.descriptionText}>
            {campaignData?.description || 
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity 
          style={styles.connectButton}
          onPress={handleConnectionRequest}
        >
          <Text style={styles.buttonText}>Connect Request</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.productsButton}
          onPress={() => navigate('Products', { campaign_id: campaignData?._id })}
        >
          <Text style={styles.buttonText}>Total Products {productCount}</Text>
          <ArrowRight size={20} color={Constants.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CampaignDetail;

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
  verificationLabel: {
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
    marginBottom: 20,
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
    paddingVertical: 25,
    gap: 15,
  },
  connectButton: {
    backgroundColor: '#FFCC00',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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