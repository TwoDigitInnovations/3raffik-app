import { StyleSheet, Dimensions, Platform } from 'react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import{hp,wp} from '../../../utils/responsiveScreen'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
  },
  backgroundImage: {
    position: 'absolute',
    top: -155,
    left: 0,
    right: 0,
    width: '100%',
    height: '90%',
    zIndex: 0,
  },
  keyboardContainer: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    zIndex: 2,
    paddingHorizontal: wp(4),
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 25,
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headtxt: {
    fontSize: wp(5) + 4,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    marginTop: -30,
    marginBottom: hp(0.5),
    alignSelf:'center',
    textDecorationLine: 'underline',
  },
  imgcov:{
    marginTop:hp(4),
    borderWidth:1,
    borderColor:Constants.custom_yellow,
    borderRadius:wp(55),
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'center',
    padding:wp(2)
  },
  proimg:{
    height: hp(18),
    width: wp(20),
    // marginTop:hp(6),
    resizeMode:'contain',
    alignSelf:'center',
    // backgroundColor:'red'
  },
  inpcov:{
    height:55,
    borderWidth:1,
    borderColor:'rgba(0, 0, 0, 0.1)',
    borderRadius:25,
    backgroundColor:'rgba(255, 255, 255, 0.7)',
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:20,
    marginBottom: 18,
  },
  inpcov2:{
    height:50,
    borderWidth:1,
    borderColor:Constants.customgrey6,
    borderRadius:10,
    backgroundColor:Constants.light_yellow,
    marginTop:15,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:10
  },
  inputfield:{
    fontSize:14,
    color:Constants.black,
    flex:1,
    fontFamily:FONTS.Medium,
    lineHeight: 14,
    paddingVertical: 15,
  },
  inptxt:{
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    marginTop: 10,
    marginBottom: 8,
  },
  btncov:{
    height: 50,
    borderRadius: 25,
    backgroundColor: Constants.custom_yellow,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btntxt:{
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  forgtxt:{
    fontSize:wp(3.5),
    color:Constants.black,
    fontFamily:FONTS.Regular,
    marginTop:hp(3),
    alignSelf:'center'
  },
  textcov:{
    // marginTop:hp(7),
    alignSelf:'center',
    position:'absolute',
    bottom:20
  },
  textcov2:{
    marginTop: 20,
    alignSelf:'center',
    marginBottom: 10,
  },
  lasttxt:{
    fontSize:wp(4),
    fontFamily:FONTS.SemiBold,
    color:Constants.customgrey
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginLeft: 10,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },

   ////toggle button
btnCov: {
  height: 50,
  flexDirection: 'row',
  backgroundColor: 'transparent',
  borderRadius: 25,
  marginVertical: 20,
  marginTop: 80,
  overflow: 'hidden',
  position: 'relative',
  borderWidth: 1,
  borderColor: Constants.black,
},
slider: {
  position: 'absolute',
  width: '50%',
  height: '100%',
  backgroundColor: Constants.white,
  borderRadius: 23,
  zIndex: 0,
  margin: 2,
},
cencelBtn: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
},
cencelBtnActive: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
},
cencelBtn2: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
},
cencelBtn2Active: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
},
activeText: {
  color: Constants.black,
},
inactiveText: {
  color: Constants.customgrey,
},
iconView: {
  padding: 10,
  justifyContent: 'center',
  alignItems: 'center',
},

// Suspended Modal Styles
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
modalContainer: {
  backgroundColor: Constants.white,
  borderRadius: 20,
  padding: 30,
  width: '90%',
  maxWidth: 400,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.3,
  shadowRadius: 20,
  elevation: 10,
},
modalIconContainer: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: '#FEF3C7',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
},
modalIcon: {
  fontSize: 40,
},
modalTitle: {
  fontSize: 22,
  fontFamily: FONTS.Bold,
  color: Constants.black,
  marginBottom: 15,
  textAlign: 'center',
},
modalMessage: {
  fontSize: 15,
  fontFamily: FONTS.Regular,
  color: Constants.customgrey,
  textAlign: 'center',
  lineHeight: 22,
  marginBottom: 25,
},
modalButton: {
  backgroundColor: Constants.custom_yellow,
  paddingVertical: 14,
  paddingHorizontal: 50,
  borderRadius: 25,
  width: '100%',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 3,
},
modalButtonText: {
  fontSize: 16,
  fontFamily: FONTS.SemiBold,
  color: Constants.black,
},
/////


})

export default styles;
