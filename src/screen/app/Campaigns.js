import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getAllCampaigns } from '../../../redux/campaign/campaignAction';
import Header from '../../Assets/Component/Header';
import { navigate } from '../../../utils/navigationRef';

const Campaigns = () => {
  const dispatch = useDispatch();
  const [campaignList, setCampaignList] = useState([]);
  const [searchkey, setsearchkey] = useState('');
  const [page, setPage] = useState(1);
  const [curentData, setCurrentData] = useState([]);
  const IsFocused = useIsFocused();

  useEffect(() => {
    {
      IsFocused && getCampaign(1);
    }
  }, [IsFocused]);

  const getCampaign = (p,text) => {
    setPage(p)
    dispatch(getAllCampaigns({p,text}))
      .unwrap()
      .then(data => {
        console.log('data', data);
        setCurrentData(data);
        if (p === 1) {
          setCampaignList(data);
        } else {
          setCampaignList([...campaignList, ...data]);
        }
      })
      .catch(error => {
        console.error('Get Campaign failed:', error);
      });
  };

  const fetchNextPage = () => {
    if (curentData.length === 20) {
      getCampaign(page + 1,searchkey);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginHorizontal:20}}>
        <Header 
          item={"All Campaigns"} 
          showback={true}
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
        </View>
      </View>
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
          <TouchableOpacity 
            style={[styles.card,{marginBottom:campaignList?.length-1===index?80:0}]}
            onPress={() => navigate('CampaignDetail', item)}
          >
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

              {/* Content Over Image */}
              <View style={styles.cardContent}>
                <Text style={styles.campaignTitle}>{item?.name}</Text>
                <Text style={styles.websiteUrl}>Website url - {item?.web_url}</Text>
                {item?.created_by && (
                  <Text style={styles.companyName}>Company: {item?.created_by?.name}</Text>
                )}
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
  protxtinp: {
    flex: 1,
    paddingHorizontal: 10,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    fontSize: 16,
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
    marginBottom: 5,
  },
  companyName: {
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: Constants.white,
    marginBottom: 15,
  },
});