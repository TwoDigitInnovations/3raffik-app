import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {useEffect, useState} from 'react';
import Constants, {FONTS} from '../../Assets/Helpers/constant';
import CameraGalleryPeacker from '../../Assets/Component/CameraGalleryPeacker';
import SocialMediaDropdown from '../../Assets/Component/SocialMediaDropdown';
import { goBack } from '../../../utils/navigationRef';
import { getProfile, updateProfile } from '../../../redux/auth/authAction';
import { useDispatch } from 'react-redux';
import Header from '../../Assets/Component/Header';

const Profile = () => {
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [userDetail, setUserDetail] = useState({
    name: '',
    phone: '',
    email: '',
    image: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: '',
    }
  });
  const [selectedSocialPlatforms, setSelectedSocialPlatforms] = useState([]);

  const getImageValue = async img => {
    setUserDetail({...userDetail,image:img});
  };

  useEffect(() => {
      getProdata()
    }, []);
  
    const getProdata = () => {
    dispatch(getProfile())
      .unwrap()
      .then(data => {
        console.log('data', data);
        setUserDetail({
          ...data,
          socialMedia: data.socialMedia || {
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
          }
        });
        
        // Set selected platforms based on existing data
        const platforms = [];
        if (data.socialMedia?.facebook) platforms.push('facebook');
        if (data.socialMedia?.instagram) platforms.push('instagram');
        if (data.socialMedia?.twitter) platforms.push('twitter');
        if (data.socialMedia?.linkedin) platforms.push('linkedin');
        setSelectedSocialPlatforms(platforms);
      })
      .catch(error => {
        console.error('getProfile failed:', error);
      });
  };
  const handleSocialPlatformChange = (platforms) => {
    setSelectedSocialPlatforms(platforms);
    
    // Reset social media URLs for unselected platforms
    const updatedSocialMedia = { ...userDetail.socialMedia };
    
    // Clear URLs for platforms that are no longer selected
    Object.keys(updatedSocialMedia).forEach(platform => {
      if (!platforms.includes(platform)) {
        updatedSocialMedia[platform] = '';
      }
    });
    
    setUserDetail({
      ...userDetail,
      socialMedia: updatedSocialMedia
    });
  };

  const handleSocialMediaUrlChange = (platform, url) => {
    setUserDetail({
      ...userDetail,
      socialMedia: {
        ...userDetail.socialMedia,
        [platform]: url
      }
    });
  };

  const submit = () => {
      if (
        userDetail.name === '' ||
      !userDetail.name ||
    //   userDetail.phone === '' ||
    //   !userDetail.phone||
      userDetail?.email===''
      ) {
        setSubmitted(true);
        return;
      }
    //    const emailcheck = checkEmail(userDetail.email.trim());
    // if (!emailcheck) {
    //   showToaster('error',"Your email id is invalid");
    //   return;
    // }
        const formData = new FormData();
        formData.append('name', userDetail.name);
        formData.append('phone', userDetail.phone);
        formData.append('email', userDetail.email);
        
        // Add social media data
        formData.append('socialMedia', JSON.stringify(userDetail.socialMedia));
        
        if (userDetail?.image?.uri) {
          formData.append('image', userDetail?.image);
        }
        dispatch(updateProfile(formData))
          .unwrap()
          .then(data => {
            console.log('data', data);
            goBack()
          })
          .catch(error => {
            console.error('UpdateProfile failed:', error);
          });
      };
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('../../Assets/Images/over3.png')} 
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      
     
      <View style={styles.headerContainer}>
        <Header item={"Edit Profile"} showback={true}/>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          style={styles.scrollContainer}>

          {/* Form Container */}
          <View style={styles.formContainer}>
            <Text style={[styles.jobtitle]}>Full Name</Text>
            <TextInput
              style={[styles.input]}
              editable={edit}
              placeholder="Enter Name"
              value={userDetail?.name}
              onChangeText={name => setUserDetail({...userDetail, name})}
              placeholderTextColor={Constants.customgrey2}
            />
            {submitted && (userDetail.name === '' || !userDetail.name) && (
              <Text style={styles.require}>Name is required</Text>
            )}
            
            <Text style={[styles.jobtitle]}>Email</Text>
            <TextInput
              style={[styles.input]}
              editable={edit}
              placeholder="Enter email"
              value={userDetail?.email}
              onChangeText={email => setUserDetail({...userDetail, email})}
              placeholderTextColor={Constants.customgrey2}
            />
            {submitted && (userDetail.email === '' || !userDetail.email) && (
              <Text style={styles.require}>Email is required</Text>
            )}

            <Text style={[styles.jobtitle]}>Phone Number</Text>
            <TextInput
              style={[styles.input]}
              editable={edit}
              placeholder="Enter"
              value={userDetail?.phone}
              onChangeText={phone => setUserDetail({...userDetail, phone})}
              placeholderTextColor={Constants.customgrey2}
            />

            <Text style={[styles.jobtitle]}>Social Media Platforms</Text>
            <SocialMediaDropdown
              selectedPlatforms={selectedSocialPlatforms}
              onSelectionChange={handleSocialPlatformChange}
              editable={edit}
            />

            {/* Dynamic Social Media URL Fields */}
            {selectedSocialPlatforms.map((platform) => {
              const platformNames = {
                facebook: 'Facebook',
                instagram: 'Instagram', 
                twitter: 'X (Twitter)',
                linkedin: 'LinkedIn'
              };
              
              return (
                <View key={platform}>
                  <Text style={[styles.jobtitle]}>{platformNames[platform]} URL</Text>
                  <TextInput
                    style={[styles.input]}
                    editable={edit}
                    placeholder={`Enter ${platformNames[platform]} URL`}
                    value={userDetail.socialMedia[platform]}
                    onChangeText={(url) => handleSocialMediaUrlChange(platform, url)}
                    placeholderTextColor={Constants.customgrey2}
                    autoCapitalize="none"
                    keyboardType="url"
                  />
                </View>
              );
            })}
          </View>

          {edit ? (
            <TouchableOpacity style={styles.signInbtn} onPress={() => submit()}>
              <Text style={styles.buttontxt}>Update Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.signInbtn} onPress={() => setEdit(true)}>
              <Text style={styles.buttontxt}>Edit</Text>
            </TouchableOpacity>
          )}

          <CameraGalleryPeacker
            show={showImagePicker}
            title="Choose from"
            getImageValue={getImageValue}
            base64={false}
            cancel={() => setShowImagePicker(false)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
  },
  backgroundImage: {
    position: 'absolute',
    top: -120,
    left: 0,
    right: 0,
    width: '100%',
    height: '90%',
    zIndex: 0,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor:'#FFCC00'
  },
  keyboardContainer: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    zIndex: 2,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    marginTop: 150,
    marginBottom: 30,
    alignSelf: 'center',
    width: '90%',
    marginHorizontal: 20,
    minHeight: 420,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imgpart: {
    height: 120,
    width: 120,
    alignSelf: 'center',
    position: 'relative',
    zIndex: 9,
    marginBottom: 20,
    borderColor: Constants.custom_blue,
    borderRadius: 100,
    marginTop: 20
  },
  backcov: {
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.customgrey4,
  },
  editiconcov: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Constants.custom_blue,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -5,
    bottom: 0,
    zIndex: 9,
  },
  logo: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 60,
  },
  input: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 55,
    lineHeight: 14,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 18,
  },
  signInbtn: {
    height: 50,
    borderRadius: 25,
    backgroundColor: Constants.custom_yellow,
    marginTop: 20,
    marginBottom: 40,
    marginHorizontal: 40,
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
  jobtitle: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    marginTop: 10,
    marginBottom: 8,
  },
  buttontxt: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  headtxt: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
  doctxt: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
    marginBottom: 10,
    marginLeft: 5
  },
  require: {
    color: Constants.red,
    fontFamily: FONTS.Medium,
    marginLeft: 10,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  doccov: {
    borderRadius: 10,
    backgroundColor: Constants.light_blue2,
    padding: 10,
    borderWidth: 1,
    borderColor: Constants.custom_blue,
    marginTop: 20
  }
});
