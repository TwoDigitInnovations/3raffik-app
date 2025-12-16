import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Constants, { FONTS } from '../../Assets/Helpers/constant'
import React, { useEffect, useState } from 'react'
import { hp } from '../../../utils/responsiveScreen'
import Header from '../../Assets/Component/Header'
import { goBack } from '../../../utils/navigationRef'
import { createProduct, getProductbyId, updateProduct } from '../../../redux/product/productAction'
import { useDispatch } from 'react-redux'

const AddProduct = (props) => {
const campaign_id = props?.route?.params?.campaign_id;
const product_id = props?.route?.params?.product_id;
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [productModel, setProductModel] = useState({
    name: '',
    pho_url: '',
    pro_det_url: '',
    affiliate_commission: '',
    coustomer_discount: '',
    price: '',
  });
  useEffect(()=>{
    if (product_id) {
      getproductbyid()
    }
  },[])

  const getproductbyid = async () => {
    
    dispatch(getProductbyId(product_id))
      .unwrap()
      .then(data => {
        console.log('data', data);
        setProductModel(data);
      })
      .catch(error => {
        console.error('getbyid failed:', error);
      });
  };
  const submit = async () => {
    if (!productModel?.name||!productModel?.pho_url||!productModel?.pro_det_url||(!productModel?.affiliate_commission||!productModel?.coustomer_discount)) {
      setSubmitted(true)
    }
    if (campaign_id) {
      productModel.campaign=campaign_id
    }
    if (product_id) {
      productModel.id=product_id
    }

    dispatch(product_id?updateProduct(productModel):createProduct(productModel))
      .unwrap()
      .then(data => {
        console.log('data', data);
        setProductModel({
          name: '',
          pho_url: '',
          pro_det_url: '',
          affiliate_commission: '',
          coustomer_discount: '',
          price: '',
        });
        goBack()
      })
      .catch(error => {
        console.error('createproduct failed:', error);
    });
  };
  return (
   <View style={styles.container}>
    <Header item={"Product Create"} showback={true}/>
    <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView showsVerticalScrollIndicator={false}>
    <Text style={styles.inptxt}>Product Name</Text>
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Product Name"
            textAlign='left'
            placeholderTextColor={Constants.customgrey2}
            value={productModel?.name}
            onChangeText={name => setProductModel({...productModel, name})}
          />
        </View>
        {submitted && !productModel?.name && (
            <Text style={styles.require}>Product name is required</Text>
          )}

        <Text style={styles.inptxt}>Product Photo Url</Text>
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Enter photo url"
            textAlign='left'
            placeholderTextColor={Constants.customgrey2}
             value={productModel?.pho_url}
            onChangeText={pho_url => setProductModel({...productModel, pho_url})}
          />
        </View>
        {submitted && !productModel?.pho_url && (
            <Text style={styles.require}>Photo url is required</Text>
          )}
        <Text style={styles.inptxt}>Product Detail Page Url</Text>
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Enter product detail page url"
            textAlign='left'
            placeholderTextColor={Constants.customgrey2}
            value={productModel?.pro_det_url}
            onChangeText={pro_det_url => setProductModel({...productModel, pro_det_url})}
          />
        </View>
        {submitted && !productModel?.pro_det_url && (
            <Text style={styles.require}>Photo detal url is required</Text>
          )}
        <Text style={styles.inptxt}>Affiliate Commission</Text>
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Enter affiliate commission"
            textAlign='left'
            keyboardType='number-pad'
            placeholderTextColor={Constants.customgrey2}
            value={productModel?.affiliate_commission}
            onChangeText={affiliate_commission => setProductModel({...productModel, affiliate_commission})}
          />
        </View>
        {submitted && !productModel?.affiliate_commission && (
            <Text style={styles.require}>Affiliate commission is required</Text>
          )}
        <Text style={styles.inptxt}>Coustomer Discount</Text>
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Enter affiliate commission"
            textAlign='left'
            keyboardType='number-pad'
            placeholderTextColor={Constants.customgrey2}
            value={productModel?.coustomer_discount}
            onChangeText={coustomer_discount => setProductModel({...productModel, coustomer_discount})}
          />
        </View>
        {submitted && !productModel?.coustomer_discount && (
            <Text style={styles.require}>Coustomer discountis required</Text>
          )}
        <Text style={styles.inptxt}>Price</Text>
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Enter price"
            textAlign='left'
            keyboardType='number-pad'
            placeholderTextColor={Constants.customgrey2}
            value={productModel?.price}
            onChangeText={price => setProductModel({...productModel, price})}
          />
        </View>
        {submitted && !productModel?.price && (
            <Text style={styles.require}>Price required</Text>
          )}

        <TouchableOpacity style={styles.btncov} onPress={submit}>
              <Text style={styles.btntxt}>{false?"Update":"Create"} Product</Text>
            </TouchableOpacity>
            </ScrollView>
            </KeyboardAvoidingView>
    </View>
  )
}

export default AddProduct

const styles = StyleSheet.create({
    container:{
    flex:1,
    padding:20,
    backgroundColor:Constants.white
  },
  inpcov:{
    height:50,
    borderWidth:1,
    borderColor:Constants.customgrey6,
    borderRadius:10,
    backgroundColor:Constants.light_yellow,
    // marginTop:15,
    // flexDirection:'row',
    // alignItems:'center',
    paddingHorizontal:10
  },
  inptxt:{
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    marginBottom:hp(0.5),
    marginTop:20
  },
  inputfield:{
    fontSize:14,
    color:Constants.black,
    flex:1,
    fontFamily:FONTS.Medium,
    // backgroundColor:'red',
  },
  btncov:{
    width:'100%',
    backgroundColor:Constants.custom_yellow,
    borderRadius:10,
    height:hp(5.5),
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    marginTop:hp(4),
    boxShadow: '0px 1.5px 5px 0.1px grey',
    marginBottom:50
  },
  btntxt:{
    fontSize:14,
    color:Constants.black,
    fontFamily:FONTS.SemiBold
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    // marginLeft: 10,
    marginTop: hp(0.7),
    fontSize: 14,
    alignSelf:'flex-start'
    // marginTop:10
  },
})