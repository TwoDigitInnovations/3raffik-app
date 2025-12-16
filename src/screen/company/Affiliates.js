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
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { wp } from '../../../utils/responsiveScreen';
import { navigate } from '../../../utils/navigationRef';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getAffilites } from '../../../redux/auth/authAction';
import Header from '../../Assets/Component/Header';

const Affiliates = () => {
  const dispatch = useDispatch();
  const [affilitList, setAfilitList] = useState([]);
  const [page, setPage] = useState(1);
  const [curentData, setCurrentData] = useState([]);
  const IsFocused = useIsFocused();

  useEffect(() => {
    {
      IsFocused && getAffilite(1);
    }
  }, [IsFocused]);

  const getAffilite = (p) => {
    setPage(p)
    dispatch(getAffilites({p}))
      .unwrap()
      .then(data => {
        console.log('data', data);
        setCurrentData(data);
        if (p === 1) {
          setAfilitList(data);
        } else {
          setAfilitList([...productlist, ...data]);
        }
      })
      .catch(error => {
        console.error('Get Campaign failed:', error);
      });
  };
  const fetchNextPage = () => {
    if (curentData.length === 20) {
      getAffilite(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginHorizontal:20}}>
      <Header item={"Affiliate Management"} /></View>
    
      <FlatList
        data={affilitList}
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
                No Affiliates Found
              </Text>
            </View>
          )}
        renderItem={({ item, index }) => (
          <View style={[styles.card,{marginBottom:affilitList?.length-1===index?80:0}]}>
            <View style={styles.frowbet}>
              <View style={styles.frow}>
                <Image source={item?.image?{uri:item.image}:require('../../Assets/Images/profile3.png')} style={styles.imgst}/>
              <View>
              <Text style={styles.nametxt}>{item?.name}</Text>
              <Text>{item?.email}</Text>
              </View>
              </View>
              <TouchableOpacity style={styles.btncov} onPress={()=>navigate('AffiliateDetail',{data:item})}>
              <Text style={styles.btntxt}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        onEndReached={() => {
            if (affilitList && affilitList.length > 0) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.05}
      />

    </View>
  );
};

export default Affiliates;

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
    borderRadius:15,
    boxShadow: '0px 1.5px 5px 0.1px grey',
    padding:7,
    backgroundColor:Constants.light_yellow
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
    alignItems:'center'
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
  btncov:{
    height:35,
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
  imgst:{
    height:50,
    width:50,
    borderRadius:25,
  }
});
