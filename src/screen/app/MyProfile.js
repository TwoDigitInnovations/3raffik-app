import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Facebook, Instagram, Twitter, Linkedin, Edit2, Check, X } from 'lucide-react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Header from '../../Assets/Component/Header';
import { navigate } from '../../../utils/navigationRef';
import { getAffiliateWallet, getCompanyWallet } from '../../../redux/wallet/walletAction';
import { updateProfile, getProfile } from '../../../redux/auth/authAction';

const MyProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const walletData = useSelector(state => state.wallet);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(user?.bio || 'Top-tier affiliate marketer specializing in SaaS & Fintech niches. Let\'s connect!');
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, [user?.role]);

  useEffect(() => {
    if (user?.bio) {
      setBio(user.bio);
    }
  }, [user?.bio]);

  const fetchWalletData = async () => {
    setIsLoadingWallet(true);
    try {
      if (user?.role === 'user') {
        await dispatch(getAffiliateWallet()).unwrap();
      } else if (user?.role === 'company') {
        await dispatch(getCompanyWallet()).unwrap();
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  const handleSaveBio = async () => {
    try {
      // Create FormData for API call
      const formData = new FormData();
      formData.append('bio', bio);
      
      const result = await dispatch(updateProfile(formData)).unwrap();
      // Refresh user profile to get updated data
      await dispatch(getProfile()).unwrap();
      setIsEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const handleCancelBio = () => {
    setBio(user?.bio || 'Top-tier affiliate marketer specializing in SaaS & Fintech niches. Let\'s connect!');
    setIsEditingBio(false);
  };

  const getWalletBalance = () => {
    if (user?.role === 'user') {
      return {
        available: walletData.availableBalance || 0,
        pending: walletData.totalCommission - walletData.availableBalance || 0,
      };
    } else if (user?.role === 'company') {
      return {
        available: walletData.availableBalance || 0,
        pending: walletData.totalRevenue - walletData.availableBalance || 0,
      };
    }
    return { available: 0, pending: 0 };
  };

  const balance = getWalletBalance();

  const handleNavigateToWallet = () => {
    if (user?.role === 'company') {
      navigate('CompanyWallet');
    } else {
      navigate('Wallet');
    }
  };

  const getSocialMediaIcons = () => {
    const icons = [];
    const socialMediaConfig = {
      facebook: { IconComponent: Facebook, color: '#1877F2' },
      instagram: { IconComponent: Instagram, color: '#E4405F' },
      twitter: { IconComponent: Twitter, color: '#000000' },
      linkedin: { IconComponent: Linkedin, color: '#0A66C2' },
    };

    // Check if user has socialMedia field and it's not empty
    if (user?.socialMedia && typeof user.socialMedia === 'object') {
      Object.keys(user.socialMedia).forEach((platform) => {
        if (user.socialMedia[platform] && user.socialMedia[platform].trim() !== '') {
          const config = socialMediaConfig[platform];
          if (config) {
            icons.push(
              <View key={platform} style={styles.socialIcon}>
                <config.IconComponent size={20} color={config.color} />
              </View>
            );
          }
        }
      });
    }

    return icons;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header item={"Profile"} showback={true}/>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}>

        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                user?.image
                  ? {
                      uri: `${user.image}`,
                    }
                  : require('../../Assets/Images/profile4.png')
              }
              style={styles.profileImage}
            />
          </View>
          
          <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
          
          {/* Bio Section with Edit */}
          <View style={styles.bioContainer}>
            {isEditingBio ? (
              <View style={styles.bioEditContainer}>
                <TextInput
                  style={styles.bioInput}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                  placeholder="Enter your bio..."
                  placeholderTextColor={Constants.customgrey2}
                />
                <View style={styles.bioActions}>
                  <TouchableOpacity 
                    style={[styles.bioActionBtn, styles.bioSaveBtn]}
                    onPress={handleSaveBio}
                  >
                    <Check size={16} color="white" />
                    <Text style={styles.bioActionText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.bioActionBtn, styles.bioCancelBtn]}
                    onPress={handleCancelBio}
                  >
                    <X size={16} color={Constants.black} />
                    <Text style={[styles.bioActionText, { color: Constants.black }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.bioViewContainer}>
                <Text style={styles.userDescription}>{bio}</Text>
                <TouchableOpacity 
                  style={styles.editBioBtn}
                  onPress={() => setIsEditingBio(true)}
                >
                  <Edit2 size={16} color={Constants.customgrey2} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
         
          <View style={styles.socialMediaContainer}>
            {getSocialMediaIcons()}
          </View>
          
          <TouchableOpacity 
            style={styles.editProfileBtn}
            onPress={() => navigate('Profile')}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* My Wallet Section */}
        <View style={styles.walletSection}>
          <Text style={styles.sectionTitle}>My Wallet</Text>
          
          {isLoadingWallet ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFCC00" />
            </View>
          ) : (
            <View style={styles.balanceContainer}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceAmount}>
                  ${balance.available.toFixed(2)}
                </Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>
                  {user?.role === 'user' ? 'Total Earned' : 'Total Revenue'}
                </Text>
                <Text style={styles.balanceAmount}>
                  ${(user?.role === 'user' ? walletData.totalCommission : walletData.totalRevenue || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Payment Methods Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          
          <View style={styles.paymentMethodsGrid}>
            <TouchableOpacity 
              style={styles.paymentMethod}
              onPress={handleNavigateToWallet}
            >
              <View style={[styles.paymentIcon, { backgroundColor: '#0070f3' }]}>
                <Text style={styles.paymentIconText}>P</Text>
              </View>
              <Text style={styles.paymentMethodText}>PayPal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.paymentMethod}
              onPress={handleNavigateToWallet}
            >
              <View style={[styles.paymentIcon, { backgroundColor: '#ff69b4' }]}>
                <Text style={styles.paymentIconText}>S</Text>
              </View>
              <Text style={styles.paymentMethodText}>Stripe</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.paymentMethod}
              onPress={handleNavigateToWallet}
            >
              <View style={[styles.paymentIcon, { backgroundColor: '#4caf50' }]}>
                <Text style={styles.paymentIconText}>B</Text>
              </View>
              <Text style={styles.paymentMethodText}>Bank</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.paymentMethod}
              onPress={handleNavigateToWallet}
            >
              <View style={[styles.paymentIcon, { backgroundColor: '#ffc107' }]}>
                <Text style={styles.paymentIconText}>C</Text>
              </View>
              <Text style={styles.paymentMethodText}>Crypto</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.withdrawBtn}
            onPress={handleNavigateToWallet}
          >
            <Text style={styles.withdrawBtnText}>Withdraw Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#FFCC00',
    paddingBottom:15
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileSection: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    // borderRadius: 15,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 5,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFCC00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  userName: {
    fontSize: 24,
    fontFamily: FONTS.Bold,
    color: Constants.black,
    marginBottom: 8,
  },
  bioContainer: {
    width: '100%',
    marginBottom: 20,
  },
  bioViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioEditContainer: {
    width: '100%',
  },
  bioInput: {
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: Constants.black,
    textAlign: 'center',
    lineHeight: 20,
    borderWidth: 1,
    borderColor: '#FFCC00',
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
  },
  bioActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 10,
  },
  bioActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    gap: 5,
  },
  bioSaveBtn: {
    backgroundColor: '#4caf50',
  },
  bioCancelBtn: {
    backgroundColor: '#f0f0f0',
  },
  bioActionText: {
    fontSize: 14,
    fontFamily: FONTS.SemiBold,
    color: 'white',
  },
  editBioBtn: {
    marginLeft: 10,
    padding: 5,
  },
  userDescription: {
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: Constants.customgrey2,
    textAlign: 'center',
    lineHeight: 20,
    flex: 1,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  socialIcon: {
    marginHorizontal: 8,
  },
  editProfileBtn: {
    backgroundColor: '#FFCC00',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
  walletSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.Bold,
    color: Constants.black,
    marginBottom: 15,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: Constants.customgrey2,
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 20,
    fontFamily: FONTS.Bold,
    color: Constants.black,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  paymentSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentMethod: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  paymentIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  paymentIconText: {
    fontSize: 16,
    fontFamily: FONTS.Bold,
    color: 'white',
  },
  paymentMethodText: {
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: Constants.black,
  },
  withdrawBtn: {
    backgroundColor: '#FFCC00',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  withdrawBtnText: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
});