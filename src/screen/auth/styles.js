import { StyleSheet, Dimensions, Platform } from 'react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import{hp,wp} from '../../../utils/responsiveScreen'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    padding: wp(4),
  },
  headtxt: {
    fontSize: wp(5),
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
    marginVertical:hp(2),
    alignSelf:'center',
  },
  imgcov:{
    marginTop:hp(6),
    borderWidth:1,
    borderColor:Constants.custom_yellow,
    borderRadius:wp(55),
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'center',
    padding:wp(2)
  },
  proimg:{
    height: hp(24),
    width: wp(50),
    // marginTop:hp(6),
    resizeMode:'contain',
    alignSelf:'center',
    // backgroundColor:'red'
  },
  inpcov:{
    height:50,
    borderWidth:1,
    borderColor:Constants.customgrey6,
    borderRadius:10,
    backgroundColor:Constants.light_yellow,
    // marginTop:15,
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:10
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
    fontSize:wp(3),
    color:Constants.black,
    flex:1,
    fontFamily:FONTS.Medium,
    // backgroundColor:'red'
  },
  inptxt:{
    fontSize: wp(4),
    color: Constants.black,
    fontFamily: FONTS.Medium,
    marginBottom:hp(0.5),
    marginTop:20
  },
  btncov:{
    width:wp(90),
    backgroundColor:Constants.custom_yellow,
    borderRadius:wp(3),
    height:hp(5.5),
    justifyContent:'center',
    alignItems:'center',
    marginTop:hp(5),
    boxShadow: '0px 1.5px 5px 0.1px grey'
  },
  btntxt:{
    fontSize:wp(4.5),
    color:Constants.black,
    fontFamily:FONTS.SemiBold
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
    marginTop:hp(5),
    alignSelf:'center',
    marginBottom:30
  },
  lasttxt:{
    fontSize:wp(4),
    fontFamily:FONTS.SemiBold,
    color:Constants.customgrey
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginLeft: wp(2),
    marginTop: hp(0.7),
    fontSize: wp(3.5),
    alignSelf:'flex-start'
    // marginTop:10
  },

   ////toggle button
btnCov: {
  height: 50,
  // marginHorizontal:20,
  flexDirection: 'row',
  backgroundColor: Constants.light_yellow,
  borderRadius: 12,
  marginVertical: 15,
  // marginHorizontal: 20,
  overflow: 'hidden',
  position: 'relative',
},
slider: {
  position: 'absolute',
  width: '50%',
  height: '100%',
  backgroundColor: Constants.custom_yellow,
  borderRadius: 10,
  zIndex: 0,
},
cencelBtn: {
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
activeText: {
  color: Constants.black,
},
inactiveText: {
  color: Constants.customgrey,
},
/////


})

export default styles;
