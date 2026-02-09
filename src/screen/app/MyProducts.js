import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { hp, wp } from '../../../utils/responsiveScreen';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getAffiliateCommissionedProducts } from '../../../redux/wallet/walletAction';
import Header from '../../Assets/Component/Header';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';

const MyProducts = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { commissionedProducts, isLoading } = useSelector(state => state.wallet);
  const [imageError, setImageError] = useState(false);
  const [searchkey, setsearchkey] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const IsFocused = useIsFocused();
  
  const isValidUrl = (url) =>
    typeof url === 'string' && /^https?:\/\//i.test(url);

  const generateQRData = (item) => {
    const trackingUrl = `http://localhost:3000/product?` +
      `productId=${item._id}&` +
      `campaignId=${item.campaign?._id || 'campaign_id'}&` +
      `affiliateId=${user?.id || 'affiliate_id'}&` +
      `companyId=auto&` +
      `timestamp=${Date.now()}`;
    
    return trackingUrl;
  };

  const handleQRPress = (item) => {
    const url = generateQRData(item);
    Clipboard.setString(url);
    Alert.alert(
      'URL Copied! 📋',
      `Product link copied to clipboard:\n\n${url}`,
      [
        { text: 'OK', style: 'default' }
      ]
    );
  };

  useEffect(() => {
    if (IsFocused) {
      dispatch(getAffiliateCommissionedProducts({ page: 1 }));
    }
  }, [IsFocused, dispatch]);

  useEffect(() => {
    // Filter products based on search
    if (searchkey.trim() === '') {
      setFilteredProducts(commissionedProducts);
    } else {
      const filtered = commissionedProducts.filter(item =>
        item.name?.toLowerCase().includes(searchkey.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [commissionedProducts, searchkey]);

  const handleSearch = (text) => {
    setsearchkey(text);
  };

  return (
    <View style={styles.container}>
      <View style={{ marginHorizontal: 20 }}>
        <Header item={"My Products"} showback={true} />
        <View style={styles.searchContainer}>
          <View style={styles.aplcov}>
            <Search
              size={20}
              style={{ alignSelf: 'center', marginRight: 10 }}
              color={Constants.customgrey3}
            />
            <TextInput
              placeholder="Search products..."
              placeholderTextColor={Constants.black}
              style={styles.protxtinp}
              value={searchkey}
              onChangeText={handleSearch}
            />
          </View>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: Dimensions.get('window').height - 200,
            }}>
            <Text
              style={{
                color: Constants.black,
                fontSize: 18,
                fontFamily: FONTS.Medium,
                textAlign: 'center',
                marginHorizontal: 20,
              }}>
              {isLoading ? 'Loading...' : 'No commissioned products yet\n\nStart sharing your QR codes to earn commissions!'}
            </Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[styles.card, { marginBottom: filteredProducts?.length - 1 === index ? 20 : 0 }]}>
            <View style={styles.frow}>
              <TouchableOpacity 
                style={styles.qrContainer}
                onPress={() => handleQRPress(item)}
                activeOpacity={0.7}
              >
                <QRCode
                  value={generateQRData(item)}
                  size={50}
                  color={Constants.black}
                  backgroundColor={Constants.white}
                />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={styles.nametxt}>{item?.name}</Text>
                <Text style={styles.dateTxt}>{moment(item?.lastOrderDate).format('DD MMM YYYY, hh:mm A')}</Text>
                <View style={styles.statsContainer}>
                  <Text style={styles.statsTxt}>Total Earned: <Text style={styles.yellowValue}>${item?.totalCommission?.toFixed(2)}</Text></Text>
                  <Text style={styles.statsTxt}>Orders: <Text style={styles.yellowValue}>{item?.totalOrders}</Text></Text>
                </View>
              </View>
            </View>
            <View style={styles.horlin}></View>
            <View style={styles.frow}>
              <View style={styles.imageContainer}>
                <Image
                  source={
                    !imageError && isValidUrl(item?.product_image)
                      ? { uri: item.product_image }
                      : require('../../Assets/Images/bag.png')
                  }
                  style={styles.productImage}
                  onError={() => setImageError(true)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.protxt}>{item?.name}</Text>
                <Text style={styles.protxt2}>${item?.offer_price || item?.price}</Text>
                <Text style={styles.protxt3}>Affiliate Commission - <Text style={styles.yellowValue}>{item?.affiliate_commission}%</Text></Text>
                <Text style={styles.protxt3}>Customer Discount - <Text style={styles.yellowValue}>{item?.coustomer_discount}%</Text></Text>
                {item?.campaign && (
                  <Text style={styles.campaignTxt}>Campaign: <Text style={styles.yellowValue}>{item.campaign.name}</Text></Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MyProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: Constants.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 5,
    paddingHorizontal: 2,
  },
  aplcov: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  protxtinp: {
    flex: 1,
    paddingHorizontal: 10,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    fontSize: 16,
  },
  yellowValue: {
    color: Constants.custom_yellow,
    fontFamily: FONTS.SemiBold,
  },
  qrContainer: {
    backgroundColor: Constants.white,
    padding: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    backgroundColor: Constants.white,
    padding: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginRight: 12,
  },
  productImage: {
    height: hp(10),
    width: wp(15),
    borderRadius: 4,
  },
  card: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
    backgroundColor: Constants.white,
    boxShadow: '0px 1.5px 5px 0.1px grey',
  },
  frow: {
    flexDirection: 'row',
    gap: 15,
  },
  nametxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  dateTxt: {
    fontSize: 12,
    color: Constants.customgrey2,
    fontFamily: FONTS.Regular,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 5,
  },
  statsTxt: {
    fontSize: 12,
    color: Constants.black,
    fontFamily: FONTS.Medium,
  },
  campaignTxt: {
    fontSize: 12,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    marginTop: 3,
  },
  protxt: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  protxt2: {
    fontSize: 14,
    color: Constants.custom_yellow,
    fontFamily: FONTS.SemiBold,
  },
  protxt3: {
    fontSize: 14,
    marginTop: 5,
    color: Constants.black,
    fontFamily: FONTS.Bold,
  },
  horlin: {
    height: 1,
    backgroundColor: Constants.customgrey2,
    marginVertical: 10,
  },
});