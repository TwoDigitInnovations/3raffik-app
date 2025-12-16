import {
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { createRef, useEffect, useState} from 'react';
import Constants, { FONTS} from '../../Assets/Helpers/constant';
// import InAppBrowser from 'react-native-inappbrowser-reborn';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '../../../utils/navigationRef';
import { logout } from '../../../redux/auth/authAction';
// import LanguageChange from '../../Assets/Component/LanguageChange';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLanguage } from '../../../redux/location/locationSlice';
import { ChevronRight, CircleX, FileTerminal, LogOut, NotepadText, Shield, ShieldAlert, Trash2, User } from 'lucide-react-native';

const Account = () => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const user = useSelector(state => state.auth.user);

  // const [selectLanguage, setSelectLanguage] = useState('English');
  //     const langRef = createRef()
  //   useEffect(() => {
  //   checkLng();
  // }, []);
  // const checkLng = async () => {
  //   const x = await AsyncStorage.getItem('LANG');
  //   if (x != null) {
  //     let lng = x == 'sv' ? 'Swedish':'English';
  //     setSelectLanguage(lng);
  //     dispatch(setLanguage(lng))
  //   }
  // };
  
  const InAppBrowserFunc=async(props)=>{
    try {
      // if (await InAppBrowser.isAvailable()) {
      //   await InAppBrowser.open(props, {
      //     // Customization options
      //     dismissButtonStyle: 'cancel',
      //     preferredBarTintColor: Constants.custom_yellow,
      //     preferredControlTintColor: 'white',
      //     readerMode: false,
      //     animated: true,
      //     modalPresentationStyle: 'fullScreen',
      //     modalTransitionStyle: 'coverVertical',
      //     enableBarCollapsing: false,
      //   });
      // } else {
      //   Linking.openURL(props);
      // }
    } catch (error) {
      console.error(error);
    }
  }
  const logOut=()=>{
dispatch(logout())
  }
  return (
    <View style={styles.container}>
      <Text style={styles.headtxt}>My Account</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.topcard}
          onPress={() => navigate('Profile')}>
          <Image
            // source={require('../../../Assets/Images/profile.png')}
            source={
              user?.image
                ? {
                    uri: `${user.image}`,
                  }
                : require('../../Assets/Images/profile4.png')
            }
            style={styles.proimg}
          />
          <View style={{marginTop: 5,}}>
            <Text style={styles.protxt}>{user?.name}</Text>
            <Text style={styles.protxt2}>{user?.email}</Text>
          </View>
        </TouchableOpacity>
        {/* <View style={[styles.horline, {marginHorizontal: 20}]}></View> */}
        <View
          style={{
            marginTop: 10,
            backgroundColor: Constants.white,
            marginBottom: 70,
          }}>
          {/* <Text style={styles.partheadtxt}>Profile</Text> */}
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => navigate('Profile')}>
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <User size={17} color={Constants.black}/>
              </View>
              <Text style={styles.protxt}>Personal Data</Text>
            </View>
            <ChevronRight
              color={Constants.black}
              size={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[styles.box]}
            onPress={()=>langRef.current.show()}>
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <LanguageIcon height={20} width={20} color={Constants.black} />
              </View>
              <Text style={styles.protxt}>Language</Text>
            </View>
            <View style={styles.btmboxfirpart}>
              <Text style={styles.protxt3}>{selectLanguage}</Text>
              <ChevronRight
                color={Constants.black}
                height={15}
                width={15}
                style={styles.aliself}
              />
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => InAppBrowserFunc('https://main.d2i61b55rlnfpm.amplifyapp.com/PrivacyPolicy')}
            >
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <ShieldAlert size={17} color={Constants.black}/>
              </View>
              <Text style={styles.protxt}>Privacy Policy</Text>
            </View>
            <ChevronRight
              color={Constants.black}
              size={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => InAppBrowserFunc('https://main.d2i61b55rlnfpm.amplifyapp.com/TermsandConditions')}
            >
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <FileTerminal size={17} color={Constants.black}/>
              </View>
              <Text style={styles.protxt}>Terms and Conditions</Text>
            </View>
            <ChevronRight
              color={Constants.black}
              size={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => InAppBrowserFunc('https://main.d2i61b55rlnfpm.amplifyapp.com/TermsandConditions')}
            >
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <NotepadText size={17} color={Constants.black}/>
              </View>
              <Text style={styles.protxt}>My Plan</Text>
            </View>
            <ChevronRight
              color={Constants.black}
              size={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          {/* <Text style={styles.partheadtxt}>Support</Text> */}
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => InAppBrowserFunc('https://tawk.to/chat/68e0fa0c4db84c19518e60e8/1j6nd1gbd')}
            >
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <Shield size={17} color={Constants.black}/>
              </View>
              <Text style={styles.protxt}>Help Center</Text>
            </View>
            <ChevronRight
              color={Constants.black}
              size={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => setModalVisible2(true)}>
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <Trash2 size={17} color={Constants.black} />
              </View>
              <Text style={[styles.protxt,{width:'70%'}]}>Delete Account</Text>
            </View>
            <ChevronRight
              color={Constants.black}
              size={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.box]}
            onPress={() => setModalVisible(true)}>
            <View style={styles.btmboxfirpart}>
              <View style={styles.iconcov}>
                <LogOut size={17} color={Constants.black} />
              </View>
              <Text style={[styles.protxt,{width:'70%'}]}>Log Out</Text>
            </View>
            <ChevronRight
              color={Constants.black}
              size={15}
              style={styles.aliself}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[styles.btn]}
            onPress={async () => {
              setModalVisible(true);
            }}>
            <LogOut color={Constants.red} size={20}/>
            <Text style={styles.btntxt}>Log Out</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
{/* <LanguageChange refs={langRef} selLang={(item)=>{setSelectLanguage(item)}}/> */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{backgroundColor: 'white', alignItems: 'center'}}>
              <View style={[styles.covline,{width:'100%'}]}>
                <View style={{width:35}}></View>
                <Text style={styles.textStyle5}>Sign Out </Text>
                <TouchableOpacity style={styles.croscov} onPress={()=>setModalVisible(false)}>
                  <CircleX size={20} color={Constants.black}/>
                </TouchableOpacity>
              </View>
              <Text style={styles.textStyle4}>Are you sure you want to log out?</Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.cancelButtonStyle2}>
                  <Text style={[styles.modalText,{color:Constants.black}]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setModalVisible(!modalVisible);
                    logOut();
                  }}
                  style={styles.logOutButtonStyle2}>
                  <Text style={styles.modalText}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible2(!modalVisible2);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{backgroundColor: 'white', alignItems: 'center'}}>
              <Text style={[styles.textStyle2, {color: Constants.red}]}>
                WARNING: You are about to delete your account. This action is permanent and cannot be undone.
              </Text>
              <Text style={styles.textStyle3}>
                • All your data, including personal information, and settings, will be permanently erased.
              </Text>
              <Text style={styles.textStyle3}>
                • You will lose access to all services and benefits associated with your account.
              </Text>
              <Text style={styles.textStyle3}>
                • You will no longer receive updates, support, or communications from us.
              </Text>
              <Text style={styles.textStyle}>
                Are you sure you want to delete your account?
              </Text>
              <View style={styles.cancelAndLogoutButtonWrapStyle}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setModalVisible2(!modalVisible2)}
                  style={styles.cancelButtonStyle}>
                  <Text style={[styles.modalText,{color:Constants.white}]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={async () => {
                    setModalVisible2(!modalVisible2);
                    logOut();
                  }}
                  style={styles.logOutButtonStyle}>
                  <Text style={styles.modalText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    // paddingVertical: 20,
  },
  headtxt: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    textAlign: 'center',
    marginTop: 10,
  },
  protxt: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
  },
  protxt2: {
    color: Constants.customgrey2,
    fontSize: 12,
    fontFamily: FONTS.Regular,
  },
  box: {
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: Constants.light_yellow,
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius:10,
    paddingVertical:7,
    borderWidth:1,
    borderColor:Constants.customgrey2
  },
  aliself: {
    alignSelf: 'center',
  },
  btntxt: {
    fontSize: 16,
    color: Constants.red,
    fontFamily: FONTS.SemiBold,
  },
  btn: {
    height: 55,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    borderColor: Constants.customgrey2,
    borderWidth: 1,
    marginHorizontal: 20,
    // width: '80%',
    // alignSelf: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  proimg: {
    // marginRight: 10,
    height: 70,
    width: 70,
    borderRadius: 70,
  },
  /////////logout model //////
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 17,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },

  textStyle: {
    color: Constants.black,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 16,
  },
  textStyle5: {
    color: Constants.black,
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 18,
  },
  textStyle4: {
    color: Constants.customgrey2,
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    fontSize: 14,
    marginTop:10
  },
  textStyle2: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    fontSize: 16,
  },
  textStyle3: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Medium,
    fontSize: 16,
  },
  modalText: {
    color: Constants.black,
    // fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.Bold,
    fontSize: 14,
  },
  cancelAndLogoutButtonWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 3,
  },
  cancelButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.black,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginRight: 10,
  },
  logOutButtonStyle: {
    flex: 0.5,
    backgroundColor: Constants.red,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  cancelButtonStyle2: {
    flex: 0.5,
    borderColor: Constants.customgrey2,
    borderWidth:1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginRight: 10,
  },
  logOutButtonStyle2: {
    flex: 0.5,
    backgroundColor: Constants.custom_yellow,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  covline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horline: {
    height: 1,
    backgroundColor: Constants.customgrey2,
    marginVertical: 10,
  },
  partheadtxt: {
    fontSize: 14,
    color: Constants.customgrey2,
    fontFamily: FONTS.Medium,
    marginTop: 20,
    marginLeft: 20,
  },
  iconcov: {
    backgroundColor: '#FBE89A',
    borderRadius: 8,
    padding: 7,
  },
  btmboxfirpart: {flexDirection: 'row', alignItems: 'center', gap: 15},
  croscov:{
    padding:10,
    borderRadius:8,
    borderWidth:1,
    borderColor:Constants.customgrey5
  },
  topcard: {
    marginHorizontal: 40,
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    flexDirection:'row',
    gap:10
  },
  protxt3: {
    color: Constants.black,
    fontSize: 12,
    fontFamily: FONTS.Medium,
  },
});
