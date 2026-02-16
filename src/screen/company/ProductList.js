import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Share,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Pencil, PlusIcon, Search, Trash2, X, Copy, Share2 } from 'lucide-react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { hp, wp } from '../../../utils/responsiveScreen';
import { navigate } from '../../../utils/navigationRef';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getProductbyCompany } from '../../../redux/product/productAction';
import Header from '../../Assets/Component/Header';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';

const ProductList = (props) => {
  const campaign_id = props?.route?.params?.campaign_id;
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [imageError, setImageError] = useState(false);
  const [productList, setProductList] = useState([]);
  const [modelvsible, setmodelvsible] = useState(false);
  const [productId, setProductId] = useState();
  const [searchkey, setsearchkey] = useState('');
  const [page, setPage] = useState(1);
  const [curentData, setCurrentData] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const IsFocused = useIsFocused();
  const isValidUrl = (url) =>
    typeof url === 'string' && /^https?:\/\//i.test(url);

  const generateQRData = (item, selectedAffiliate = null) => {
    const trackingUrl = `http://localhost:3000/product?` +
      `productId=${item._id}&` +
      `campaignId=${campaign_id}&` +
      `affiliateId=${selectedAffiliate?.id || 'affiliate_id'}&` +
      `companyId=${user?.id}&` +
      `timestamp=${Date.now()}`;
    
    return trackingUrl;
  };

  const handleQRPress = (item) => {
    setSelectedProduct(item);
    setShowQRModal(true);
  };

  const handleCopyLink = () => {
    const url = generateQRData(selectedProduct);
    Clipboard.setString(url);
    Alert.alert('Success', 'Link copied to clipboard!');
  };

  const handleShareLink = async () => {
    try {
      const url = generateQRData(selectedProduct);
      await Share.share({
        message: `Check out this product: ${selectedProduct?.name}\n\n${url}`,
        url: url,
        title: selectedProduct?.name,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  useEffect(() => {
    {
      IsFocused &&campaign_id&& getProduct(1);
    }
  }, [IsFocused]);

  const getProduct = (p,text) => {
    setPage(p)
    dispatch(getProductbyCompany({campaign_id,p,text}))
      .unwrap()
      .then(data => {
        console.log('data', data);
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
  const deleteProducts = status => {
    dispatch(deleteProduct(status))
      .unwrap()
      .then(() => {
        getProduct(1)
      })
      .catch(error => {
        console.error('Delete Product failed:', error);
      });
  };
  const fetchNextPage = () => {
    if (curentData.length === 20) {
      getProduct(page + 1,searchkey);
    }
  };


  return (
    <View style={styles.container}>
      <View style={{marginHorizontal:20}}>
       <Header item={"Products"} showback={true}/>
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
                getProduct(1, text), setsearchkey(text);
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
          <TouchableOpacity style={[styles.card,{marginBottom:productList?.length-1===index?20:0}]} onPress={()=>navigate('ProductDetail',item)}>
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
                <Image source={
                  !imageError && isValidUrl(item?.product_image)
                    ? { uri: item.product_image }
                    : require('../../Assets/Images/bag.png')} style={styles.productImage}
                    onError={() => setImageError(true)}/>
              </View>
            <View >
            <View>
            <Text style={styles.protxt}>{item?.name}</Text>
            <Text style={styles.protxt2}>${item?.offer_price || item?.price}</Text>
            <Text style={styles.protxt3}>Affiliate Commission - <Text style={styles.yellowValue}>{item?.affiliate_commission}%</Text></Text>
            <Text style={styles.protxt3}>Coustomer Discount - <Text style={styles.yellowValue}>{item?.coustomer_discount}%</Text></Text>
            </View>
            </View>
              </View>
              <View style={[styles.frow,{alignSelf:'flex-end', marginTop: 12}]}>
                <TouchableOpacity style={[styles.iconcov, styles.editIcon]} onPress={()=>navigate('AddProduct',{campaign_id:campaign_id,product_id:item?._id})}>
                  <Pencil size={20} color={Constants.black} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconcov, styles.deleteIcon]}
                  onPress={()=> {setProductId(item?._id),setmodelvsible(true)}}>
                  <Trash2 size={20} color={Constants.white} />
                </TouchableOpacity>
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
      <TouchableOpacity
        style={[styles.plusBtn]}
        onPress={()=>navigate('AddProduct',{campaign_id:campaign_id})}>
        <PlusIcon size={35} color={Constants.black} />
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={modelvsible}
        onRequestClose={() => {
          setmodelvsible(!modelvsible);
        }}>
        <View style={styles.centeredView2}>
          <View style={styles.modalView2}>
            <Text style={styles.alrt}>Alert !</Text>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 30,
              }}>
              <Text style={styles.textStyle}>
               Are you sure you want to delete this product !
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    setmodelvsible(false);
                  }}
                  style={styles.cancelButtonStyle}>
                  <Text
                    style={[
                      styles.modalText,
                      {color: Constants.custom_yellow},
                    ]}>
                   No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.logOutButtonStyle}
                  onPress={() => {
                    deleteProducts(productId), setmodelvsible(false);
                  }}>
                  <Text style={styles.modalText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showQRModal}
        onRequestClose={() => setShowQRModal(false)}>
        <View style={styles.qrModalOverlay}>
          <View style={styles.qrModalContent}>
            <View style={styles.qrModalHeader}>
              <Text style={styles.qrModalTitle}>Product QR Code</Text>
              <TouchableOpacity onPress={() => setShowQRModal(false)}>
                <X size={24} color={Constants.black} />
              </TouchableOpacity>
            </View>

            {selectedProduct && (
              <>
                <View style={styles.qrCodeContainer}>
                  <QRCode
                    value={generateQRData(selectedProduct)}
                    size={200}
                    color={Constants.black}
                    backgroundColor={Constants.white}
                  />
                </View>

                <Text style={styles.productNameInModal}>{selectedProduct.name}</Text>

                <View style={styles.qrModalActions}>
                  <TouchableOpacity
                    style={styles.qrActionButton}
                    onPress={handleCopyLink}>
                    <Copy size={20} color={Constants.black} />
                    <Text style={styles.qrActionText}>Copy Link</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.qrActionButton}
                    onPress={handleShareLink}>
                    <Share2 size={20} color={Constants.black} />
                    <Text style={styles.qrActionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default ProductList;

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
  editIcon: {
    backgroundColor: Constants.white,
    borderWidth: 1,
    borderColor: Constants.black,
  },
  deleteIcon: {
    backgroundColor: '#eb0505',
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
  inpcov: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
  },
  plusBtn: {
    backgroundColor: Constants.custom_yellow,
    padding: 5,
    borderRadius: 55,
    marginTop: 10,
    zIndex: 9,
    height: 55,
    width: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 60,
    right: 30,
  },
  card: {
    marginTop: 20,
    width:'90%',
    alignSelf:'center',
    borderRadius:10,
    padding:10,
    backgroundColor:'#F9F7ED',
    boxShadow: '0px 1.5px 5px 0.1px grey',
  },
  cardimg: {
    height: 50,
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    width: '20%',
  },
  frowbet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frow: {
    flexDirection: 'row',
    gap:15,
  },
  iconcov: {
    backgroundColor: '#B3B0B154',
    padding: 10,
    borderRadius: 25,
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
    marginTop:5,

    color: Constants.black,
    fontFamily: FONTS.Bold,
  },
  ctacov:{
    backgroundColor:'#94F9C8',
    paddingHorizontal:15,
    paddingVertical:2,
    borderRadius:15,
    lineHeight:20,
    fontSize:14,
    color:Constants.black,
    fontFamily:FONTS.SemiBold
  },

  //////Model////////

  textStyle: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Regular,
    fontSize: 16,
    margin: 20,
    marginBottom: 10,
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 3,
  },
  alrt: {
    color: Constants.red,
    fontSize: 18,
    fontFamily: FONTS.Medium,
    // backgroundColor: 'red',
    width: '100%',
    textAlign: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: Constants.customgrey2,
    paddingBottom: 20,
  },
  modalText: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    fontSize: 14,
  },
  centeredView2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView2: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    width: '90%',
  },
  cancelButtonStyle: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginRight: 10,
    borderColor: Constants.custom_yellow,
    borderWidth: 1,
    borderRadius: 10,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.custom_yellow,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

   menuopt:{ 
    marginBottom: 7 ,
    flexDirection:'row',
    alignItems:'center',
    // borderColor:Constants.black,
    // borderBottomWidth:1,
    gap:5
  },
  menutxt:{ 
    fontSize: 12,
    color:Constants.black,
    fontFamily:FONTS.Medium,
  },
  menutxt2:{ 
    fontSize: 14,
    color:Constants.black,
    fontFamily:FONTS.Medium,
    marginBottom:8
  },
  menucov:{
      position: 'absolute',
      top: 0,
      right: 1,
      left: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.2)',
      zIndex:999,
    },
    menucrd:{
        position: 'absolute',
        top: 75,
        right: 20,
        backgroundColor:Constants.white,
        borderRadius: 8,
        paddingVertical: 5,
        width: 200,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        padding:10
      },
      horlin:{
        height:1,
        backgroundColor:Constants.customgrey2,
        marginVertical:10
      },
      qrModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      qrModalContent: {
        backgroundColor: Constants.white,
        borderRadius: 20,
        padding: 20,
        width: '85%',
        maxWidth: 400,
        alignItems: 'center',
      },
      qrModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
      },
      qrModalTitle: {
        fontSize: 18,
        fontFamily: FONTS.Bold,
        color: Constants.black,
      },
      qrCodeContainer: {
        padding: 20,
        backgroundColor: Constants.white,
        borderRadius: 10,
        marginBottom: 20,
      },
      productNameInModal: {
        fontSize: 16,
        fontFamily: FONTS.SemiBold,
        color: Constants.black,
        textAlign: 'center',
        marginBottom: 20,
      },
      qrModalActions: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
      },
      qrActionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Constants.custom_yellow,
        paddingVertical: 12,
        borderRadius: 10,
      },
      qrActionText: {
        fontSize: 14,
        fontFamily: FONTS.SemiBold,
        color: Constants.black,
      },
});
