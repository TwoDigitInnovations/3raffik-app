import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { X, Facebook, Instagram } from 'lucide-react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getNotifications, updateNotificationStatus } from '../../../redux/notification/notificationAction';
import Header from '../../Assets/Component/Header';

const Notification = () => {
  const dispatch = useDispatch();
  const [notificationList, setNotificationList] = useState([]);
  const [page, setPage] = useState(1);
  const [curentData, setCurrentData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const IsFocused = useIsFocused();

  useEffect(() => {
    if (IsFocused) {
      getNotificationData(1);
    }
  }, [IsFocused]);

  const getNotificationData = (p) => {
    setPage(p);
    dispatch(getNotifications({ p }))
      .unwrap()
      .then(data => {
        setCurrentData(data);
        if (p === 1) {
          setNotificationList(data);
        } else {
          setNotificationList([...notificationList, ...data]);
        }
      })
      .catch(error => {
        console.error('Get notifications failed:', error);
      });
  };

  const getDummyNotifications = () => {
    const dummyData = [
      {
        id: 1,
        type: 'Connection request',
        message: 'You have a notification from Williams',
        user: {
          name: 'Williams',
          email: 'williams455@gmail.com',
          phone: '+46 825755276',
          image: null
        },
        timestamp: new Date()
      },
      {
        id: 2,
        type: 'Connection request',
        message: 'You have a notification from Sarah',
        user: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@gmail.com',
          phone: '+46 825755277',
          image: null
        },
        timestamp: new Date()
      }
    ];
    setNotificationList(dummyData);
  };

  const handleAccept = () => {
    if (selectedNotification?._id) {
      dispatch(updateNotificationStatus({
        notification_id: selectedNotification._id,
        status: 'accepted'
      }))
      .unwrap()
      .then(() => {
        setModalVisible(false);
        getNotificationData(1);
      })
      .catch(error => {
        console.error('Accept failed:', error);
      });
    }
  };

  const handleReject = () => {
    if (selectedNotification?._id) {
      dispatch(updateNotificationStatus({
        notification_id: selectedNotification._id,
        status: 'rejected'
      }))
      .unwrap()
      .then(() => {
        setModalVisible(false);
        getNotificationData(1);
      })
      .catch(error => {
        console.error('Reject failed:', error);
      });
    }
  };

  const fetchNextPage = () => {
    if (curentData.length === 20) {
      getNotificationData(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginHorizontal:20}}>
        <Header item={"Notification"} showback={true} />
      </View>
    
      <FlatList
        data={notificationList}
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
              No Notifications Found
            </Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <View style={[styles.card,{marginBottom:notificationList?.length-1===index?80:0}]}>
            <View style={styles.frowbet}>
              <View style={styles.frow}>
                <View>
                  <Text style={styles.nametxt}>{item?.title || 'Connection request'}</Text>
                  <Text style={styles.messageTxt}>{item?.description || `You have a notification from ${item?.from?.name}`}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.btncov} onPress={()=>{
                setSelectedNotification(item);
                setModalVisible(true);
              }}>
                <Text style={styles.btntxt}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        onEndReached={() => {
          if (notificationList && notificationList.length > 0) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.05}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <X size={20} color={Constants.black} />
            </TouchableOpacity>

            <View style={styles.verticalDivider} />

            <View style={styles.profileSection}>
              <Image 
                source={selectedNotification?.from?.image ? {uri: selectedNotification.from.image} : require('../../Assets/Images/profilee.png')} 
                style={styles.modalProfileImage}
              />
              
              <View style={styles.profileTextContainer}>
                <Text style={styles.modalName}>{selectedNotification?.from?.name}</Text>
                <Text style={styles.modalEmail}>{selectedNotification?.from?.email}</Text>
                <Text style={styles.modalPhone}>{selectedNotification?.from?.phone}</Text>
                
                <View style={styles.socialContainer}>
                  <TouchableOpacity style={styles.socialIcon}>
                    <Facebook size={20} color={Constants.black} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialIcon}>
                    <Instagram size={20} color={Constants.black} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: Constants.white,
  },
  card: {
    marginTop: 20,
    width:'90%',
    alignSelf:'center',
    borderRadius:8,
    boxShadow: '0px 1.5px 5px 0.1px rgba(128, 128, 128, 0.5)',
    padding:15,
    backgroundColor:Constants.white,
    minHeight: 80,
  },
  frowbet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center'
  },
  frow: {
    flexDirection: 'row',
    gap:15,
    flex: 1,
  },
  nametxt: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    marginBottom: 5,
  },
  messageTxt: {
    fontSize: 14,
    color: Constants.customgrey2,
    fontFamily: FONTS.Regular,
  },
  btncov:{
    height:30,
    width:70,
    backgroundColor:Constants.custom_yellow,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    marginRight:10
  },
  btntxt:{
    fontSize:14,
    color:Constants.black,
    fontFamily:FONTS.SemiBold
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 0,
    width: '85%',
    position: 'relative',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: Constants.black,
    borderRadius: 20,
    backgroundColor:"#F9F7ED",
    zIndex: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 30,
    paddingBottom: 20,
    width: '100%',
    minHeight: 120,
  },
  modalProfileImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    position: 'absolute',
    left: 125,
    top: 0,
    bottom: 0,
    height: '66%',
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  modalPhone: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    color: Constants.customgrey2,
    marginTop: 5,
  },
  modalName: {
    fontSize: 20,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
    marginBottom: 5,
  },
  modalEmail: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    color: Constants.customgrey2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    width: '100%',
    marginVertical: 0,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  socialIcon: {
    backgroundColor:Constants.white,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 15,
    gap: 10,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: Constants.white,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Constants.customgrey2,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: Constants.custom_yellow,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
  acceptButtonText: {
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
});