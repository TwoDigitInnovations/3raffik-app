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
import Header from '../../Assets/Component/Header';

const CompanyCampaign = () => {
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
      setSelectedVerification(value);   
    }
  }
};


  return (
    <View style={styles.container}>
      <View style={{marginHorizontal:20}}>
        <Header 
          item={"Company Campaign"} 
          showback={true}
          rightIcon={
            <TouchableOpacity
              style={styles.headerPlusBtn}
              onPress={() => navigate('CampaignsForm')}
            >
              <PlusIcon size={24} color={Constants.black} />
            </TouchableOpacity>
          }
        />
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
                getCampaign(1, text), setsearchkey(text);
              }}
            />
          </View>
          <TouchableOpacity 
            style={styles.filterIconContainer}
            onPress={()=>setMenuVisible(true)}
          >
            <Filter
              size={25}
              color={Constants.black}
            />
          </TouchableOpacity>
        </View>
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
          <TouchableOpacity style={[styles.card,{marginBottom:campaignList?.length-1===index?80:0}]} onPress={()=>navigate('CompanyCampaignDetail',item)}>
            <View style={styles.cardImageContainer}>
              <Image
                source={
                  item?.photo
                    ? { uri: item.photo }
                    : require('../../Assets/Images/cambacg.png')}
                resizeMode='cover'
                style={styles.cardimg}
              />
              <View style={styles.cardOverlay} />
              
              {/* Status Badge - Top Right */}
              <View style={styles.statusBadgeContainer}>
                <Text style={[styles.statusBadge, {
                  backgroundColor: item?.status === 'Active' ? '#4CAF50' : '#FF9800'
                }]}>
                  {item?.status}
                </Text>
              </View>

              {/* Content Over Image */}
              <View style={styles.cardContent}>
                <Text style={styles.campaignTitle}>{item?.name}</Text>
                <Text style={styles.websiteUrl}>Website url - {item?.web_url}</Text>
                
                {/* Bottom Row */}
                <View style={styles.cardBottomRow}>
                  {/* Verification Status */}
                  <Text style={[styles.verificationBadge, {
                    backgroundColor: item?.verified_status === 'Verified' ? '#4CAF50' : 
                                   item?.verified_status === 'Rejected' ? '#F44336' : '#EAAA00'
                  }]}>
                    {item?.verified_status}
                  </Text>
                  
                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionBtn} onPress={()=>navigate('CampaignsForm',item?._id)}>
                      <Pencil size={18} color={Constants.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.deleteBtn]}
                      onPress={()=> {setCampaignId(item?._id),setmodelvsible(true)}}>
                      <Trash2 size={18} color={Constants.white} />
                    </TouchableOpacity>
                  </View>
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

export default CompanyCampaign;

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
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
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
  filterIconContainer: {
    padding: 8,
  },
  headerPlusBtn: {
    backgroundColor: Constants.custom_yellow,
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  protxtinp: {
    flex: 1,
    paddingHorizontal: 10,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    fontSize: 16,
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
    width: '90%',
    alignSelf: 'center',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: Constants.white,
    overflow: 'hidden',
  },
  cardImageContainer: {
    position: 'relative',
    height: 200,
  },
  cardimg: {
    height: '100%',
    width: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: '50%',
    right: 15,
    transform: [{ translateY: -12 }],
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontFamily: FONTS.SemiBold,
    color: Constants.white,
    textAlign: 'center',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  campaignTitle: {
    fontSize: 20,
    fontFamily: FONTS.Bold,
    color: Constants.white,
    marginBottom: 5,
  },
  websiteUrl: {
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: Constants.white,
    marginBottom: 15,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verificationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontFamily: FONTS.SemiBold,
    color: Constants.white,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  deleteBtn: {
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
  },
  frowbet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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