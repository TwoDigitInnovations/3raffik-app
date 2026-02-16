import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import Constants, { FONTS } from './src/Assets/Helpers/constant';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Spinner from './src/Assets/Component/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkLogin } from './redux/auth/authAction';
import { initializeOneSignal, setupNotificationHandlers } from './src/services/oneSignalService';

const App = () => {
  useEffect(() => {
    try {
      initializeOneSignal();
      setupNotificationHandlers();
    } catch (error) {
      console.log('OneSignal setup skipped:', error.message);
    }
  }, []);

  useEffect(()=>{
    store.dispatch(checkLogin()).unwrap()
      .finally(() => {
      });
  },[])

  const checkLng = async () => {
      const x = await AsyncStorage.getItem('LANG');
      if (x != null) {
        i18n.changeLanguage(x);
        let lng = x == x == 'sv' ? 'Swedish':'English';
        store.dispatch(setLanguage(lng))
      }
    };

  return (
    <Provider store={store}>
      <SafeAreaView
        edges={
          Platform.OS === 'ios'
            ? ['left', 'top', 'right']
            : ['bottom', 'left', 'right', 'top']
        }
        style={styles.container}
      >
        <StatusBar barStyle="dark-content" backgroundColor={Constants.white} />
        <Spinner />
        <Navigation />
        <Toast />
      </SafeAreaView>
     </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFCC00',
  },
});

export default App;
