import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screen/auth/SignIn';
// import Onboard from '../screen/auth/Onboard';
import SignUp from '../screen/auth/SignUp';
import ForgotPassword from '../screen/auth/ForgotPassword';
import CampaignsForm from '../screen/company/CampaignsForm';
import Profile from '../screen/company/Profile';
import MyProfile from '../screen/app/MyProfile';
import Wallet from '../screen/app/Wallet';
import CompanyWallet from '../screen/company/Wallet';
import AddProduct from '../screen/company/AddProduct';
import ProductList from '../screen/company/ProductList';
import ProductDetail from '../screen/company/ProductDetail';
import CampaignDetail from '../screen/app/CampaignDetail';
import CompanyCampaignDetail from '../screen/company/CompanyCampaignDetail';
import Products from '../screen/app/Products';
import MyProducts from '../screen/app/MyProducts';
import AppNotification from '../screen/app/Notification';
import CompanyNotification from '../screen/company/Notification';
import HelpCenter from '../screen/app/HelpCenter';
import PrivacyPolicy from '../screen/app/PrivacyPolicy';
import TermsConditions from '../screen/app/TermsConditions';
import { navigationRef } from '../../utils/navigationRef';
import {TabNav} from './TabNavigation';
import {CompanyTabNav} from './CompanyTab';




const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

const AuthNavigate = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {/* <AuthStack.Screen name="Onboard" component={Onboard} /> */}
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPassword} />

    </AuthStack.Navigator>
  );
};



export default function Navigation(props) {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={"Auth"}
      >
        <Stack.Screen name="Auth" component={AuthNavigate} />
        <Stack.Screen name="App" component={TabNav} />
        <Stack.Screen name="Company" component={CompanyTabNav} />
        <Stack.Screen name="CampaignsForm" component={CampaignsForm} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="MyProfile" component={MyProfile} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="CompanyWallet" component={CompanyWallet} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="ProductList" component={ProductList} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="CampaignDetail" component={CampaignDetail} />
        <Stack.Screen name="CompanyCampaignDetail" component={CompanyCampaignDetail} />
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen name="MyProducts" component={MyProducts} />
        <Stack.Screen name="AppNotification" component={AppNotification} />
        <Stack.Screen name="CompanyNotification" component={CompanyNotification} />
        <Stack.Screen name="HelpCenter" component={HelpCenter} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="TermsConditions" component={TermsConditions} />
        

      </Stack.Navigator>




    </NavigationContainer>
  );
}


