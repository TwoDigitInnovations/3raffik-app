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
import { Circle, Delete, Filter, Pencil, PlusIcon, Search, Square, SquareCheckBig, Trash2 } from 'lucide-react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { wp } from '../../../utils/responsiveScreen';
import { navigate } from '../../../utils/navigationRef';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { deleteCampaign, getCampaignbyCompany } from '../../../redux/campaign/campaignAction';

const Campaigns = () => {
  const dispatch = useDispatch();
  const [campaignList, setCampaignList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modelvsible, setmodelvsible] = useState(false);
  const [campaignId, setCampaignId] = useState();
  const [searchkey, setsearchkey] = useState('');
  const [page, setPage] = useState(1);
  const [curentData, setCurrentData] = useState([]);
  const IsFocused = useIsFocused();

  useEffect(() => {
    {
      IsFocused && getCampaign(1);
    }
  }, [IsFocused]);

  const getCampaign = (p,text,selectedStatus,selectedVerification) => {
    setPage(p)
    dispatch(getCampaignbyCompany({p,text,selectedStatus,selectedVerification}))
      .unwrap()
      .then(data => {
        console.log('data', data);
        setCurrentData(data);
        if (p === 1) {
          setCampaignList(data);
        } else {
          setCampaignList([...productlist, ...data]);
        }
      })
      .catch(error => {
        console.error('Get Campaign failed:', error);
      });
  };
  const deleteCampaigns = status => {
    dispatch(deleteCampaign(status))
      .unwrap()
      .then(data => {
        getCampaign(1)
      })
      .catch(error => {
        console.error('Delete Campaign failed:', error);
      });
  };
  const fetchNextPage = () => {
    if (curentData.length === 20) {
      getCampaign(page + 1,searchkey,selectedStatus,selectedVerification);
    }
  };
  const toggleFilter = (value, type) => {
  if (type === 'status') {
    if (selectedStatus === value) {
      setSelectedStatus(null);           // unselect if already selected
      getCampaign(1,searchkey,null,selectedVerification)
    } else {
      getCampaign(1,searchkey,value,selectedVerification)
      setSelectedStatus(value);          // select new value
    }
  }
  
  if (type === 'verify') {
    if (selectedVerification === value) {
      getCampaign(1,searchkey,selectedStatus,null)
      setSelectedVerification(null);     // unselect if already selected
    } else {
      getCampaign(1,searchkey,selectedStatus,value)
      setSelectedVerification(value);    // select new value
    }
  }
};


  return (
    <View style={styles.container}>
      {/* <View> */}
      <View style={styles.inpcov}>
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
              getCampaign(1, text), setsearchkey(text);
            }}
          />
        </View>
        <Filter
          size={25}
          style={{ alignSelf: 'center' }}
          color={Constants.black}
          onPress={()=>setMenuVisible(true)}
        />
      </View>
      {menuVisible && (
  <View 
    activeOpacity={1}
    // onPress={() => setMenuVisible(false)}
    style={styles.menucov}
  >
    <Pressable 
      style={StyleSheet.absoluteFill} 
      onPress={() => setMenuVisible(false)}
    />
    <View
      style={styles.menucrd}>
        <Text style={styles.menutxt2}>Status</Text>
      <Pressable 
        onPress={() => {
          setMenuVisible(false);
          toggleFilter('Active', 'status')
          // getCampaign(1,null,'Active',selectedVerification)
        }} 
        style={styles.menuopt}
      >
        {selectedStatus==='Active'
    ? <SquareCheckBig color={Constants.black} size={20} />
    : <Square color={Constants.black} size={20} />}
        <Text style={styles.menutxt}>Active</Text>
      </Pressable>

      <Pressable 
        onPress={() => {
          setMenuVisible(false);
          toggleFilter('Inactive', 'status')
          // getCampaign(1,null,'Inactive',selectedVerification)
        }} 
        style={styles.menuopt} >
          {selectedStatus==='Inactive'
    ? <SquareCheckBig color={Constants.black} size={20} />
    : <Square color={Constants.black} size={20} />}
        <Text style={styles.menutxt}>Inactive</Text>
      </Pressable>
<Text style={styles.menutxt2}>Verification Status</Text>
      <Pressable 
        onPress={() => {
          setMenuVisible(false);
          toggleFilter('Verified', 'verify')
          // getCampaign(1,null,selectedStatus,'Verified')
        }} 
        style={[styles.menuopt,{borderBottomWidth:0}]}>
          {selectedVerification==='Verified'
    ? <SquareCheckBig color={Constants.black} size={20} />
    : <Square color={Constants.black} size={20} />}
        <Text style={styles.menutxt}>Verified</Text>
      </Pressable>
      <Pressable 
        onPress={() => {
          setMenuVisible(false);
          toggleFilter('Pending', 'verify')
          // getCampaign(1,null,selectedStatus,'Pending')
        }} 
        style={[styles.menuopt,{borderBottomWidth:0}]}>
          {selectedVerification==='Pending'   
          ? <SquareCheckBig color={Constants.black} size={20} />
    : <Square color={Constants.black} size={20} />}
        <Text style={styles.menutxt}>Pending</Text>
      </Pressable>
      <Pressable 
        onPress={() => {
          setMenuVisible(false);
          toggleFilter('Rejected', 'verify');
          // getCampaign(1,null,selectedStatus,'Rejected')
        }} 
        style={[styles.menuopt,{borderBottomWidth:0}]}>
          {selectedVerification==='Rejected'
    ? <SquareCheckBig color={Constants.black} size={20} />
    : <Square color={Constants.black} size={20} />}
        <Text style={styles.menutxt}>Rejected</Text>
      </Pressable>
    </View>
  </View>
)}
{/* </View> */}
      <FlatList
        data={campaignList}
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
                No Campaigns Found
              </Text>
            </View>
          )}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[styles.card,{marginBottom:campaignList?.length-1===index?80:0}]} onPress={()=>navigate('ProductList',{campaign_id:item?._id})}>
            <Image
              source={
                item?.photo
                  ? { uri: item.photo }
                  : require('../../Assets/Images/cambacg.png')}
                  // resizeMode='cover'
              style={styles.cardimg}
            />
            <View style={{padding:10}}>
            <View style={styles.frowbet}>
              <Text style={styles.nametxt}>{item?.name}</Text>
              <Text style={[styles.ctacov,{backgroundColor:item?.status==='Active'?'#6CFD3B':'#F4E298A6'}]}>{item?.status}</Text>
            </View>
            <Text>Website url - {item?.web_url}</Text>
            <View style={styles.frowbet}>
              <View style={{justifyContent:'center'}}>
              <Text style={[styles.ctacov,{backgroundColor:item?.verified_status==='Verified'?'#6CFD3B':item?.verified_status==='Rejected'?'#EF0027C9':'#F4E298A6'}]}>{item?.verified_status}</Text>
              </View>
              <View style={styles.frow}>
                <TouchableOpacity style={styles.iconcov} onPress={()=>navigate('CampaignsForm',item?._id)}>
                  <Pencil size={20} color={Constants.black} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconcov, { backgroundColor: '#eb050579' }]}
                  onPress={()=> {setCampaignId(item?._id),setmodelvsible(true)}}>
                  <Trash2 size={20} color={Constants.black} />
                </TouchableOpacity>
              </View>
            </View>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={() => {
            if (campaignList && campaignList.length > 0) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.05}
      />
      <TouchableOpacity
        style={[styles.plusBtn]}
        onPress={() => navigate('CampaignsForm')}
      >
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
               Are you sure you want to delete this campaign !
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
                    deleteCampaigns(campaignId), setmodelvsible(false);
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

export default Campaigns;

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
    width: wp(80),
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
    bottom: 120,
    right: 30,
  },
  card: {
    marginTop: 20,
    width:'90%',
    alignSelf:'center',
    borderRadius:15,
    boxShadow: '0px 1.5px 5px 0.1px grey',
  },
  cardimg: {
    height: 150,
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    width: '100%',
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
});
