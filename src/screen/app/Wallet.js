import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowLeft, DollarSign } from 'lucide-react-native';
import Constants, { FONTS } from '../../Assets/Helpers/constant';
import Header from '../../Assets/Component/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getAffiliateCommissions, requestWithdrawal } from '../../../redux/wallet/walletAction';

const Wallet = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const walletState = useSelector(state => state.wallet);
  const { commissions = [], totalCommission = 0, isLoading = false } = walletState || {};
  
  const [rechargeModalVisible, setRechargeModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(getAffiliateCommissions({ page: 1 }));
    }
  }, [user, dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(getAffiliateCommissions({ page: 1 }));
    setRefreshing(false);
  };

  const handleWithdraw = () => {
    const currentBalance = totalCommission || 0;
    if (amount && parseFloat(amount) > 0 && parseFloat(amount) <= currentBalance) {
      dispatch(requestWithdrawal({ amount: parseFloat(amount) }));
      setRechargeModalVisible(false);
      setAmount('');
    } else {
      alert('Please enter a valid amount');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderCommissionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>
          Commission from {item.product?.name || 'Product'}
        </Text>
        <Text style={styles.transactionSubtitle}>
          Campaign: {item.campaign?.name || 'N/A'}
        </Text>
        <Text style={styles.transactionDate}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={styles.amountText}>${item.commissionAmount}</Text>
        <ArrowUpRight size={16} color={Constants.black} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header item={"Wallet"} showback={true}/>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

        {/* Total Amount Section */}
        <View style={styles.totalAmountSection}>
          <View style={styles.amountHeader}>
            <Text style={styles.totalAmountLabel}>Total Commission Earned</Text>
            <TouchableOpacity 
              style={styles.rechargeButton}
              onPress={() => setRechargeModalVisible(true)}
            >
              <Text style={styles.rechargeButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.totalAmountValue}>${totalCommission || 0}</Text>
        </View>

        {/* Commission History Section */}
        <View style={styles.transactionSection}>
          <Text style={styles.sectionTitle}>Commission History</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading commissions...</Text>
            </View>
          ) : (commissions && commissions.length > 0) ? (
            <FlatList
              data={commissions}
              renderItem={renderCommissionItem}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No commissions yet</Text>
              <Text style={styles.emptySubText}>
                Share your QR codes to start earning commissions!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={rechargeModalVisible}
        onRequestClose={() => setRechargeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
         
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  setRechargeModalVisible(false);
                  setAmount('');
                }}
                activeOpacity={0.7}
              >
                <ArrowLeft size={20} color={Constants.black} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Withdraw Money</Text>
              <View style={styles.dollarIconContainer}>
                <DollarSign size={20} color={Constants.black} />
              </View>
            </View>

            {/* Available Balance */}
            <Text style={styles.availableBalanceText}>
              Available Balance ${totalCommission || 0}
            </Text>

            {/* Amount Input */}
            <View style={styles.amountInputContainer}>
              <Text style={styles.dollarSymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholderTextColor={Constants.customgrey2}
              />
            </View>

          
            <TouchableOpacity 
              style={styles.proceedButton}
              onPress={handleWithdraw}
            >
              <Text style={styles.proceedButtonText}>Proceed to Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Wallet;

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
  totalAmountSection: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalAmountLabel: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
  rechargeButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rechargeButtonText: {
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: Constants.black,
  },
  totalAmountValue: {
    fontSize: 32,
    fontFamily: FONTS.Bold,
    color: Constants.black,
  },
  transactionSection: {
    paddingTop: 25,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontFamily: FONTS.Medium,
    color: Constants.black,
    marginBottom: 3,
  },
  transactionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    color: Constants.customgrey2,
    marginBottom: 3,
  },
  transactionDate: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    color: Constants.customgrey2,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: FONTS.Medium,
    color: Constants.customgrey2,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONTS.Medium,
    color: Constants.black,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: FONTS.Regular,
    color: Constants.customgrey2,
    textAlign: 'center',
  },
  transactionAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  amountText: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    width: '85%',
    minHeight: 400,
    borderWidth: 2,
    borderColor: '#BFBFBF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
    flex: 1,
    textAlign: 'center',
    marginLeft: -30, // Compensate for back button width
  },
  dollarIconContainer: {
    backgroundColor: '#FFCC00',
    borderRadius: 20,
    padding: 8,
  },
  availableBalanceText: {
    fontSize: 16,
    fontFamily: FONTS.Medium,
    color: Constants.customgrey2,
    marginBottom: 20,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 1,
    marginBottom: 25,
  },
  dollarSymbol: {
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.Medium,
    color: Constants.black,
  },
  proceedButton: {
    backgroundColor: '#FFCC00',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  proceedButtonText: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
});