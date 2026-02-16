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
import { getCompanyWallet, requestWithdrawal, getWithdrawalHistory } from '../../../redux/wallet/walletAction';

const CompanyWallet = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const walletState = useSelector(state => state.wallet);
  const { orders = [], availableBalance = 0, withdrawals = [], isLoading = false } = walletState || {};
  
  const [rechargeModalVisible, setRechargeModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(getCompanyWallet());
      dispatch(getWithdrawalHistory());
    }
  }, [user, dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(getCompanyWallet());
    await dispatch(getWithdrawalHistory());
    setRefreshing(false);
  };

  const handleWithdraw = () => {
    if (isSubmitting) return;
    
    if (amount && parseFloat(amount) > 0 && parseFloat(amount) <= availableBalance) {
      setIsSubmitting(true);
      dispatch(requestWithdrawal({ amount: parseFloat(amount) }))
        .unwrap()
        .then(() => {
          dispatch(getCompanyWallet());
          dispatch(getWithdrawalHistory());
          setRechargeModalVisible(false);
          setAmount('');
        })
        .catch((error) => {
          console.error('Withdrawal error:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#4CAF50';
      case 'approved': return '#2196F3';
      case 'pending': return '#FF9800';
      case 'rejected': return '#F44336';
      default: return Constants.customgrey2;
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>
          Order #{item.orderId}
        </Text>
        <Text style={styles.transactionSubtitle}>
          Customer: {item.customer?.name || 'Guest'}
        </Text>
        <Text style={styles.transactionDate}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={styles.amountText}>${item.totalAmount}</Text>
        <ArrowUpRight size={16} color={Constants.black} />
      </View>
    </View>
  );

  const renderWithdrawalItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>Withdrawal Request</Text>
        <Text style={[styles.transactionSubtitle, { color: getStatusColor(item.status) }]}>
          Status: {item.status.toUpperCase()}
        </Text>
        <Text style={styles.transactionDate}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={styles.amountText}>-${item.amount}</Text>
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

        <View style={styles.totalAmountSection}>
          <View style={styles.amountHeader}>
            <Text style={styles.totalAmountLabel}>Available Balance</Text>
            <TouchableOpacity 
              style={styles.rechargeButton}
              onPress={() => setRechargeModalVisible(true)}
            >
              <Text style={styles.rechargeButtonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.totalAmountValue}>${availableBalance || 0}</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
            onPress={() => setActiveTab('orders')}
          >
            <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
              Orders History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'transaction' && styles.activeTab]}
            onPress={() => setActiveTab('transaction')}
          >
            <Text style={[styles.tabText, activeTab === 'transaction' && styles.activeTabText]}>
              Transaction History
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionSection}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : activeTab === 'orders' ? (
            orders && orders.length > 0 ? (
              <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No orders yet</Text>
                <Text style={styles.emptySubText}>
                  Create campaigns to start receiving orders!
                </Text>
              </View>
            )
          ) : (
            withdrawals && withdrawals.length > 0 ? (
              <FlatList
                data={withdrawals}
                renderItem={renderWithdrawalItem}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No transactions yet</Text>
                <Text style={styles.emptySubText}>
                  Your withdrawal history will appear here
                </Text>
              </View>
            )
          )}
        </View>
      </ScrollView>

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
              >
                <ArrowLeft size={20} color={Constants.black} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Withdraw Money</Text>
              <View style={styles.dollarIconContainer}>
                <DollarSign size={20} color={Constants.black} />
              </View>
            </View>

            <Text style={styles.availableBalanceText}>
              Available Balance ${availableBalance || 0}
            </Text>

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
              style={[styles.proceedButton, isSubmitting && styles.disabledButton]}
              onPress={handleWithdraw}
              disabled={isSubmitting}
            >
              <Text style={styles.proceedButtonText}>
                {isSubmitting ? 'Processing...' : 'Proceed to Withdraw'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CompanyWallet;

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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#FFCC00',
  },
  tabText: {
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: Constants.customgrey2,
  },
  activeTabText: {
    color: Constants.black,
  },
  transactionSection: {
    paddingTop: 25,
    paddingBottom: 30,
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
    marginLeft: -30,
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
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  proceedButtonText: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
});
