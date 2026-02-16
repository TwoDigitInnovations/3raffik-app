import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import { ArrowRight } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { getProductCount } from '../../../redux/product/productAction';
import { sendConnectionRequest, checkCampaignConnection } from '../../../redux/notification/notificationAction';
import { navigate } from '../../../utils/navigationRef';

const CampaignDetail = (props) => {
  const campaignData = props?.route?.params;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [imageError, setImageError] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('not_requested');
  const [isConnected, setIsConnected] = useState(false);
  
  const isValidUrl = (url) =>
    typeof url === 'string' && /^https?:\/\//i.test(url);

  useEffect(() => {
    if (campaignData?._id && isFocused) {
      checkConnection();
      
      dispatch(getProductCount(campaignData._id))
        .unwrap()
        .then(data => {
          setProductCount(data.count);
        })
        .catch(error => {
          console.error('Get Product Count failed:', error);
        });
    }
  }, [campaignData?._id, isFocused]);

  const checkConnection = () => {
    if (campaignData?._id) {
      dispatch(checkCampaignConnection(campaignData._id))
        .unwrap()
        .then(data => {
          console.log('Connection status:', data);
          setIsConnected(data.connected);
          setConnectionStatus(data.status);
        })
        .catch(error => {
          console.error('Check connection failed:', error);
          setConnectionStatus('not_requested');
          setIsConnected(false);
        });
    }
  };

  const handleConnectionRequest = () => {
    if (campaignData?._id) {
      dispatch(sendConnectionRequest({ campaign_id: campaignData._id }))
        .unwrap()
        .then(() => {
          Alert.alert('Success', 'Connection request sent successfully');
          setConnectionStatus('pending');
          checkConnection();
        })
        .catch(error => {
          Alert.alert('Error', error.message || 'Failed to send connection request');
        });
    }
  };

  const handleProductsClick = () => {
    if (!isConnected) {
      Alert.alert(
        'Access Denied',
        'You need to send a connection request and wait for the company to accept it before viewing products.',
        [{ text: 'OK' }]
      );
      return;
    }
    navigate('Products', { campaign_id: campaignData?._id });
  };

  const getConnectionButtonText = () => {
    switch (connectionStatus) {
      case 'pending':
        return 'Request Pending';
      case 'accepted':
        return 'Connected';
      case 'rejected':
        return 'Request Rejected';
      default:
        return 'Connect Request';
    }
  };

  return (
    <View style={styles.container}>
      <Header item={"Campaigns Detail"} showback={true}/>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        
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
          <Text style={styles.campaignName}>{campaignData?.name || 'Beauty Product'}</Text>
          
          <Text style={styles.websiteLabel}>Website url - 
            <Text style={styles.websiteUrl}> {campaignData?.web_url || 'https://abcss'}</Text>
          </Text>
          
          <Text style={styles.verificationLabel}>Verification Status</Text>
          
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.descriptionText}>
            {campaignData?.description || 
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity 
          style={[
            styles.connectButton,
            (connectionStatus === 'pending' || connectionStatus === 'accepted') && styles.disabledButton
          ]}
          onPress={handleConnectionRequest}
          disabled={connectionStatus === 'pending' || connectionStatus === 'accepted'}
        >
          <Text style={styles.buttonText}>{getConnectionButtonText()}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.productsButton}
          onPress={handleProductsClick}
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
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
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