import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Pencil, PlusIcon, Search, Trash2 } from 'lucide-react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { hp, wp } from '../../../utils/responsiveScreen';
import { navigate } from '../../../utils/navigationRef';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { deleteProduct, getProductbyCompany } from '../../../redux/product/productAction';
import Header from '../../Assets/Component/Header';
import moment from 'moment';

const ProductList = (props) => {
  const campaign_id = props?.route?.params?.campaign_id;
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const [productList, setProductList] = useState([]);
  const [modelvsible, setmodelvsible] = useState(false);
  const [productId, setProductId] = useState();
  const [searchkey, setsearchkey] = useState('');
  const [page, setPage] = useState(1);
  const [curentData, setCurrentData] = useState([]);
  const IsFocused = useIsFocused();
  const isValidUrl = (url) =>
  typeof url === 'string' && /^https?:\/\//i.test(url);

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
        <View style={styles.aplcov}>
          <Search
            size={20}
            style={{ alignSelf: 'center', marginRight: 10 }}
            color={Constants.customgrey3}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor={Constants.customgrey2}
            style={styles.protxtinp}
            onChangeText={text => {
              getProduct(1, text), setsearchkey(text);
            }}
          />
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
            <Image
              source={
                !imageError && isValidUrl(item?.pho_url)
                  ? { uri: item.pho_url }
                  : require('../../Assets/Images/qr2.png')}
                  resizeMode='contain'
              style={styles.cardimg}
              onError={() => setImageError(true)}
            />
            <View>
              <Text style={styles.nametxt}>{item?.pro_det_url}</Text>
              <Text style={styles.nametxt}>{moment(item?.cretedAt).format('DD MMM YYYY, hh:mm A')}</Text>
              </View>
            </View>
            <View style={styles.horlin}></View>
            <View style={styles.frow}>
              <Image source={
                !imageError && isValidUrl(item?.pho_url)
                  ? { uri: item.pho_url }
                  : require('../../Assets/Images/bag.png')} style={{height:hp(10),width:wp(15)}}
                  onError={() => setImageError(true)}/>
            <View >
            <View>
            <Text style={styles.protxt}>{item?.name}</Text>
            <Text style={styles.protxt2}>${item?.price}</Text>
            <Text style={styles.protxt3}>Affiliate Commission - {item?.affiliate_commission}%</Text>
            <Text style={styles.protxt3}>Coustomer Discount - {item?.coustomer_discount}%</Text>
            </View>
            </View>
              </View>
              <View style={[styles.frow,{alignSelf:'flex-end'}]}>
                <TouchableOpacity style={styles.iconcov} onPress={()=>navigate('AddProduct',{campaign_id:campaign_id,product_id:item?._id})}>
                  <Pencil size={20} color={Constants.black} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconcov, { backgroundColor: '#eb050579' }]}
                  onPress={()=> {setProductId(item?._id),setmodelvsible(true)}}>
                  <Trash2 size={20} color={Constants.black} />
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
  aplcov: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Constants.customgrey2,
    borderRadius: 10,
    paddingHorizontal: 10,
    // paddingVertical: 3,
    height: 52,
    marginTop:10,
    // width: wp(80),
  },
  protxtinp: {
    flex: 1,
    paddingHorizontal: 10,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    fontSize: 14,
    width: wp(75),
    borderLeftWidth: 1,
    borderColor: Constants.customgrey2,
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
    borderRadius:15,
    padding:10,
    backgroundColor:Constants.light_yellow,
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
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  protxt3: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Medium,
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
});
