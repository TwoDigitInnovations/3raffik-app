import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Constants, { FONTS } from '../../Assets/Helpers/constant'
import React, { useEffect, useState } from 'react'
import { hp } from '../../../utils/responsiveScreen'
import Header from '../../Assets/Component/Header'
import { ChevronDown, Upload } from 'lucide-react-native'
import CameraGalleryPeacker from '../../Assets/Component/CameraGalleryPeacker'
import { goBack } from '../../../utils/navigationRef'
import { createCampaign, getCampaignbyId, updateCampaign } from '../../../redux/campaign/campaignAction'
import { useDispatch } from 'react-redux'

const CampaignsForm = (props) => {
  const data = props?.route?.params;
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [campaignModel, setCampaignModel] = useState({
    name: '',
    description: '',
    photo: '',
    status:'Active'
  });
  useEffect(()=>{
    if (data) {
      getcampaignbyid()
    }
  },[data])
  const getImageValue = async img => {
    setCampaignModel({...campaignModel,photo:img});
  };
  const getcampaignbyid = async () => {
    
    dispatch(getCampaignbyId(data))
      .unwrap()
      .then(data => {
        console.log('data', data);
        setCampaignModel(data);
      })
      .catch(error => {
        console.error('getbyid failed:', error);
      });
  };
  const submit = async () => {
    if (!campaignModel.name||!campaignModel.description||(!campaignModel.photo||!campaignModel.photo.uri)) {
      setSubmitted(true)
      return
    }
    const formData = new FormData();
    formData.append('name', campaignModel.name);
    formData.append('description', campaignModel.description);
    formData.append('status', campaignModel?.status);
    if (campaignModel?.photo?.uri) {
      formData.append('photo', campaignModel.photo); 
    }
    if (data) {
      formData.append('id', data); 
    }
    dispatch(data?updateCampaign(formData):createCampaign(formData))
      .unwrap()
      .then(data => {
        console.log('data', data);
        setCampaignModel({
          name: '',
    description: '',
    photo: '',
    status:'Active'
        });
        goBack()
      })
      .catch(error => {
        console.error('createcampaign failed:', error);
      });
  };
  return (
   <View style={styles.container}>
    <Header item={"New Campaign"} showback={true}/>
    <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <ScrollView showsVerticalScrollIndicator={false}>
    <Text style={styles.inptxt}>Campaign Name</Text>
        <View style={styles.inpcov}>
          <TextInput
            style={styles.inputfield}
            placeholder="Enter Name"
            textAlign='left'
            placeholderTextColor={Constants.customgrey2}
            value={campaignModel?.name}
            onChangeText={name => setCampaignModel({...campaignModel, name})}
          />
        </View>
        {submitted && !campaignModel?.name && (
            <Text style={styles.require}>Name is required</Text>
          )}

         <View>
            <Text style={styles.inptxt}>Campaign Photo</Text>
            {campaignModel?.photo?(campaignModel?.photo?.uri?<Image source={{uri:campaignModel?.photo?.uri}} style={styles.imgsty} resizeMode='stretch'/>:<Image source={{uri:campaignModel?.photo}} style={styles.imgsty} resizeMode='stretch'/>):<TouchableOpacity style={styles.inpcov2} onPress={()=>setShowImagePicker(true)}>
             <View style={styles.iconcov}><Upload size={20} color={Constants.black}/></View> 
              <Text style={styles.upltxt}>Click to upload or drag & drop</Text>
            </TouchableOpacity>}
          </View>
          {submitted && (!campaignModel?.photo||!campaignModel?.photo?.uri) && (
            <Text style={styles.require}>Image is required</Text>
          )}

    <Text style={styles.inptxt}>Campaign Description</Text>
        <View style={[styles.inpcov,{height:120}]}>
          <TextInput
            style={styles.inputfield}
            placeholder="Enter description"
            multiline={true}
            numberOfLines={5}
            textAlignVertical='top'
            placeholderTextColor={Constants.customgrey2}
            value={campaignModel?.description}
            onChangeText={description => setCampaignModel({...campaignModel, description})}
          />
        </View>
        {submitted && !campaignModel?.description && (
            <Text style={styles.require}>Description is required</Text>
          )}
        <Text style={styles.inptxt}>Status</Text>
        <TouchableOpacity 
          style={styles.dropdownContainer} 
          onPress={() => setShowStatusDropdown(!showStatusDropdown)}
        >
          <Text style={styles.dropdownText}>{campaignModel?.status}</Text>
          <ChevronDown size={20} color={Constants.black} />
        </TouchableOpacity>
        
        {showStatusDropdown && (
          <View style={styles.dropdownOptions}>
            <TouchableOpacity 
              style={styles.dropdownOption}
              onPress={() => {
                setCampaignModel({...campaignModel, status: 'Active'});
                setShowStatusDropdown(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dropdownOption}
              onPress={() => {
                setCampaignModel({...campaignModel, status: 'Inactive'});
                setShowStatusDropdown(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>Inactive</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.btncov} onPress={submit}>
              <Text style={styles.btntxt}>{data?"Update":"Launch"} Campaign</Text>
            </TouchableOpacity>
            </ScrollView>
            </KeyboardAvoidingView>
        <CameraGalleryPeacker
        show={showImagePicker}
        title="Choose from"
        getImageValue={getImageValue}
        base64={false}
        cancel={() => setShowImagePicker(false)}
      />
    </View>
  )
}

export default CampaignsForm

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
    backgroundColor:Constants.white,
    // marginTop:15,
    // flexDirection:'row',
    // alignItems:'center',
    paddingHorizontal:10
  },
  inpcov2:{
    height:150,
    borderWidth:1,
    borderColor:Constants.customgrey6,
    borderRadius:10,
    backgroundColor:Constants.white,
    paddingHorizontal:10,
    // marginTop:15,
    justifyContent:'center',
    alignItems:'center'
  },
  imgsty:{
    height:180,
    borderWidth:1,
    borderColor:Constants.customgrey6,
    borderRadius:10,
    backgroundColor:Constants.white,
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
  upltxt:{
    fontSize:14,
    color:Constants.black,
    fontFamily:FONTS.Medium,
  },
  iconcov:{
    backgroundColor:'#D9D9D97A',
    padding:10,
    borderRadius:25
  },
  dropdownContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: Constants.customgrey6,
    borderRadius: 10,
    backgroundColor: Constants.white,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Medium,
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: Constants.customgrey6,
    borderRadius: 10,
    backgroundColor: Constants.white,
    marginTop: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dropdownOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Constants.customgrey6,
  },
  dropdownOptionText: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Medium,
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
    marginLeft: 10,
    marginTop: hp(0.7),
    fontSize: 14,
    alignSelf:'flex-start'
    // marginTop:10
  },
})