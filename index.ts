import { setReactNativeAsyncStorage } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
setReactNativeAsyncStorage(AsyncStorage);

import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { displayNotification } from './src/utils/NotificationService';
import App from './App';

// ── Background FCM handler ────────────────────────────────────────
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('[FCM] Background message received:', JSON.stringify(remoteMessage));
  const { notification, data } = remoteMessage;
  if (notification) {
    await displayNotification(
      notification.title ?? 'DigiGold',
      notification.body  ?? '',
      data as Record<string, string>,
      notification.android?.imageUrl ?? (notification as any).ios?.imageUrl,
    );
  }
});

// ── Background notifee handler ────────────────────────────────────
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    console.log('[Notifee] Background press:', detail.notification?.data);
  }
});

registerRootComponent(App);
