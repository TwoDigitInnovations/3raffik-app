import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState} from 'react';
import Constants, { FONTS} from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';

const ProductDetail = (props) => {
  const productdata = props?.route?.params;
  const [imageError, setImageError] = useState(false);
  // const [productdata, setproductdata] = useState();
  const isValidUrl = (url) =>
  typeof url === 'string' && /^https?:\/\//i.test(url);

  useEffect(() => {
    {
      // food_id && getProductById();
    }
  }, []);
  const getProductById = () => {
    setLoading(true);
    GetApi(`getFoodById/${food_id}`).then(
      async res => {
        setLoading(false);
        console.log(res);
        if (res.status) {
          setproductdata(res.data);
        }
      },
      err => {
        setLoading(false);
        console.log(err);
      },
    );
  };

  return (
    <View style={styles.container}>
      <Header item={"Product Detail"} showback={true}/>
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <Image source={
                !imageError && isValidUrl(productdata?.pho_url)
                  ? { uri: productdata.pho_url }
                  : require('../../Assets/Images/bag.png')} style={{height:'25%',width:'40%',alignSelf:"center"}}
                  onError={() => setImageError(true)}/>

        <View style={{marginHorizontal: 20, marginTop: 15}}>
          <Text style={styles.prodname}>{productdata?.name}</Text>
          <Text style={styles.prodprice}> {productdata?.price}</Text>
          <View style={styles.horline}></View>
          <Text style={styles.dectxt}>Description</Text>
          <Text style={styles.dectxt2}>
           {productdata?.description}
          </Text>
        </View>
      {/* </ScrollView> */}
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    padding: 20,
  },
  prodname: {
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
  dectxt: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
  dectxt2: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    color: Constants.customgrey2,
  },
  prodprice: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.normal_green,
    marginVertical: 5,
  },
  horline: {
    height: 1.5,
    backgroundColor: Constants.customgrey5,
    marginVertical: 15,
  },
});
