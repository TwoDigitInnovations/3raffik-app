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
  Modal,
  Share,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Search, X, Copy, Share2 } from 'lucide-react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { hp, wp } from '../../../utils/responsiveScreen';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getProductbyCompany } from '../../../redux/product/productAction';
import { trackClick } from '../../../redux/click/clickAction';
import Header from '../../Assets/Component/Header';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';

const Products = (props) => {
  const campaign_id = props?.route?.params?.campaign_id;
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const IsFocused = useIsFocused();
  
  const [imageError, setImageError] = useState(false);
  const [productList, setProductList] = useState([]);
  const [searchkey, setsearchkey] = useState('');
  const [page, setPage] = useState(1);
  const [curentData, setCurrentData] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const isValidUrl = (url) =>
    typeof url === 'string' && /^https?:\/\//i.test(url);

  const generateQRData = (item) => {
    const trackingUrl = `http://localhost:3000/product?` +
      `productId=${item._id}&` +
      `campaignId=${campaign_id}&` +
      `affiliateId=${user?.id || 'affiliate_id'}&` +
      `companyId=${user?.id || 'company_id'}&` +
      `timestamp=${Date.now()}`;
    
    return trackingUrl;
  };

  const handleQRPress = (item) => {
    setSelectedProduct(item);
    setShowQRModal(true);
    
   
    if (user?._id) {
      dispatch(trackClick({
        productId: item._id,
        affiliateId: user._id,
        clickType: 'qr_scan'
      }));
    }
  };

  const handleCopyLink = () => {
    const url = generateQRData(selectedProduct);
    Clipboard.setString(url);
    Alert.alert('Success', 'Link copied to clipboard!');
    
   
    if (user?._id && selectedProduct) {
      dispatch(trackClick({
        productId: selectedProduct._id,
        affiliateId: user._id,
        clickType: 'link_share'
      }));
    }
  };

  const handleShareLink = async () => {
    try {
      const url = generateQRData(selectedProduct);
      await Share.share({
        message: `Check out this product: ${selectedProduct?.name}\n\n${url}`,
        url: url,
        title: selectedProduct?.name,
      });
      
     
      if (user?._id && selectedProduct) {
        dispatch(trackClick({
          productId: selectedProduct._id,
          affiliateId: user._id,
          clickType: 'link_share'
        }));
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  useEffect(() => {
    if (IsFocused && campaign_id) {
      getProduct(1);
    }
  }, [IsFocused]);

  const getProduct = (p, text) => {
    setPage(p);
    dispatch(getProductbyCompany({ campaign_id, p, text }))
      .unwrap()
      .then(data => {
        setCurrentData(data);
        if (p === 1) {
          setProductList(data);
        } else {
          setProductList([...productList, ...data]);
        }
      })
      .catch(error => {
        console.error('Get Product failed:', error);
      });
  };

  const fetchNextPage = () => {
    if (curentData.length === 20) {
      getProduct(page + 1, searchkey);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginHorizontal: 20 }}>
        <Header item={"Products"} showback={true} />
        <View style={styles.searchContainer}>
          <View style={styles.aplcov}>
            <Search
              size={20}
              style={{ alignSelf: 'center', marginRight: 10 }}
              color={Constants.customgrey3}
            />
            <TextInput
              placeholder="Search"
              placeholderTextColor={Constants.black}
              style={styles.protxtinp}
              onChangeText={text => {
                getProduct(1, text);
                setsearchkey(text);
              }}
            />
          </View>
        </View>
      </View>

      <FlatList
        data={productList}
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
              }}>
              No Products Found
            </Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[styles.card, { marginBottom: productList?.length - 1 === index ? 20 : 0 }]}>
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
              <View>
                <Text style={styles.nametxt}>{item?.name}</Text>
                <Text style={styles.nametxt}>{moment(item?.createdAt).format('DD MMM YYYY, hh:mm A')}</Text>
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
              <View>
                <Text style={styles.protxt}>{item?.name}</Text>
                <Text style={styles.protxt2}>${item?.offer_price || item?.price}</Text>
                <Text style={styles.protxt3}>Affiliate Commission - <Text style={styles.yellowValue}>{item?.affiliate_commission}%</Text></Text>
                <Text style={styles.protxt3}>Customer Discount - <Text style={styles.yellowValue}>{item?.coustomer_discount}%</Text></Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={() => {
          if (productList && productList.length > 0) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.05}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={showQRModal}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowQRModal(false)}
            >
              <X size={24} color={Constants.black} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{selectedProduct?.name}</Text>
            
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={selectedProduct ? generateQRData(selectedProduct) : ''}
                size={250}
                color={Constants.black}
                backgroundColor={Constants.white}
              />
            </View>

            <Text style={styles.scanText}>Scan QR Code to view product</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleCopyLink}
              >
                <Copy size={20} color={Constants.black} />
                <Text style={styles.actionButtonText}>Copy Link</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleShareLink}
              >
                <Share2 size={20} color={Constants.black} />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Products;

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Constants.white,
    borderRadius: 20,
    padding: 30,
    width: '90%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.Bold,
    color: Constants.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  qrCodeContainer: {
    backgroundColor: Constants.white,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 20,
  },
  scanText: {
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: Constants.customgrey2,
    marginBottom: 25,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Constants.custom_yellow,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
});