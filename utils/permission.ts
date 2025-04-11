import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export const requestPermissions = async () => {
  const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
  const camStatus = await Camera.requestCameraPermissionsAsync(); 
  const notifStatus = await Notifications.requestPermissionsAsync();

  return (
    locStatus === 'granted' &&
    camStatus.status === 'granted' &&
    notifStatus.status === 'granted'
  );
};
