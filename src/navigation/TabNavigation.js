import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Animated, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Constants, { FONTS } from '../Assets/Helpers/constant';
import { CircleUserRound, LayoutDashboard, Megaphone, SquareKanban } from 'lucide-react-native';
import Dashboard from '../screen/app/Dashboard';
import Campaigns from '../screen/app/Campaigns';
import MyProducts from '../screen/app/MyProducts';
import Account from '../screen/app/Account';



const Tab = createBottomTabNavigator();

export const  TabNav=()=>{

  const TabArr = [
    {
      iconActive: <LayoutDashboard color={Constants.red} size={22} />,
      iconInActive: <LayoutDashboard color={Constants.black} size={24} />,
      component: Dashboard,
      routeName: 'Dashboard',
    },
    {
      iconActive: <Megaphone color={Constants.red} size={20} />,
      iconInActive: <Megaphone color={Constants.black} size={22} />,
      component: Campaigns,
      routeName: 'Campaigns',
    },
    {
      iconActive: <SquareKanban color={Constants.red} size={20} />,
      iconInActive: <SquareKanban color={Constants.black} size={22} />,
      component: MyProducts,
      routeName: 'Products',
    },
    {
      iconActive: <CircleUserRound color={Constants.red} size={20} />,
      iconInActive: <CircleUserRound color={Constants.black} size={20} />,
      component: Account,
      routeName: 'Account',
    },
  ];

  const TabButton = useCallback(
    (props) => {
      const isSelected = props?.['aria-selected'];
      const onPress = props?.onPress;
      const onclick = props?.onclick;
      const item = props?.item;
      const index = props?.index;

      return (
        <View style={styles.tabBtnView}>
         
          <TouchableOpacity
            onPress={onclick ? onclick : onPress}
            style={[
              styles.tabBtn,
              // {backgroundColor:isSelected?Constants.custom_green:null}
            ]}>
            {isSelected ? item.iconActive : item.iconInActive}
          </TouchableOpacity>
          <Text style={[styles.tabtxt,{color:isSelected?Constants.red:Constants.black}]} onPress={onclick ? onclick : onPress}>{item.routeName}</Text>
        </View>
      );
    },
    [],
  );

  return (
    
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          width: '100%',
          height: Platform.OS==='ios'?90: 70,
          backgroundColor: Constants.custom_yellow,
          // boxShadow: '0px 0px 3px 0.2px grey',
          borderTopLeftRadius:15,
          borderTopRightRadius:15,
        },
      }}>
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.routeName}
            component={item.component}
           
            options={{
              tabBarShowLabel: false,
              tabBarButton: props => (
                <TabButton {...props} item={item} index={index} />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
    
  );
  
}

const styles = StyleSheet.create({
  tabBtnView: {
    // backgroundColor: isSelected ? 'blue' : '#FFFF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:Platform.OS==='ios'?10:0
  },
  tabBtn: {
    height: 40,
    width: 40,
    // padding:10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  tabBtnActive: {
    backgroundColor: Constants.white,
  },
  tabBtnInActive: {
    backgroundColor: 'white',
  },
  tabtxt:{
    color:Constants.black,
    fontSize:12,
    // fontWeight:'400',
    fontFamily:FONTS.Regular
    // alignSelf:'center'
  },
});
