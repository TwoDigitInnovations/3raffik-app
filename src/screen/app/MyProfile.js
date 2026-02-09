import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import { useSelector } from 'react-redux';
import Header from '../../Assets/Component/Header';
import { navigate } from '../../../utils/navigationRef';

const MyProfile = () => {
  const user = useSelector(state => state.auth.user);

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
          <Text style={styles.userDescription}>
            Top-tier affiliate marketer specializing in SaaS{'\n'}& Fintech niches. Let's connect!
          </Text>
          
         
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
          
          <View style={styles.balanceContainer}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>$2,490.75</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Pending Payouts</Text>
              <Text style={styles.balanceAmount}>$830.00</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          
          <View style={styles.paymentMethodsGrid}>
            <View style={styles.paymentMethod}>
              <View style={[styles.paymentIcon, { backgroundColor: '#0070f3' }]}>
                <Text style={styles.paymentIconText}>P</Text>
              </View>
              <Text style={styles.paymentMethodText}>PayPal</Text>
            </View>
            
            <View style={styles.paymentMethod}>
              <View style={[styles.paymentIcon, { backgroundColor: '#ff69b4' }]}>
                <Text style={styles.paymentIconText}>S</Text>
              </View>
              <Text style={styles.paymentMethodText}>Stripe</Text>
            </View>
            
            <View style={styles.paymentMethod}>
              <View style={[styles.paymentIcon, { backgroundColor: '#4caf50' }]}>
                <Text style={styles.paymentIconText}>B</Text>
              </View>
              <Text style={styles.paymentMethodText}>Bank</Text>
            </View>
            
            <View style={styles.paymentMethod}>
              <View style={[styles.paymentIcon, { backgroundColor: '#ffc107' }]}>
                <Text style={styles.paymentIconText}>C</Text>
              </View>
              <Text style={styles.paymentMethodText}>Crypto</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.withdrawBtn}>
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
  userDescription: {
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: Constants.customgrey2,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
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