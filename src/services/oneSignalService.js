import OneSignal from 'react-native-onesignal';
import axios from '../../utils/axios';

const ONESIGNAL_APP_ID = '6bc843b4-c4d7-437e-a7ae-3e7e38b6cfa5';

export const initializeOneSignal = () => {
  OneSignal.setAppId(ONESIGNAL_APP_ID);
  OneSignal.promptForPushNotificationsWithUserResponse();
};

export const getOneSignalPlayerId = async () => {
  const deviceState = await OneSignal.getDeviceState();
  return deviceState?.userId || null;
};

export const updateOneSignalIdToBackend = async () => {
  const playerId = await getOneSignalPlayerId();
  if (playerId) {
    await axios.post('/auth/update-onesignal-id', {
      oneSignalId: playerId
    });
  }
};

export const setupNotificationHandlers = () => {
  OneSignal.setNotificationWillShowInForegroundHandler((event) => {
    event.complete(event.getNotification());
  });

  OneSignal.setNotificationOpenedHandler((notification) => {
    console.log('Notification opened:', notification);
  });
};
