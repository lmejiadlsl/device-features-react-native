import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { loadEntries, saveEntries } from '../utils/storage';
import { ThemeContext } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEntryScreen'>;

export default function AddEntryScreen({ navigation }: Props) {
  const [imageUri, setImageUri] = useState('');
  const [address, setAddress] = useState('');
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    const requestPermissions = async () => {
      await Location.requestForegroundPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
      await Notifications.requestPermissionsAsync();

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
        });
      }

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    };

    requestPermissions();
  }, []);

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);

      try {
        const loc = await Location.getCurrentPositionAsync({});
        const geocode = await Location.reverseGeocodeAsync(loc.coords);
        const addr = `${geocode[0].name}, ${geocode[0].city}`;
        setAddress(addr);
      } catch (error) {
        console.error('Failed to get location:', error);
      }
    }
  };

  const saveEntry = async () => {
    const entries = await loadEntries();
    const newEntries = [...entries, { imageUri, address }];
    await saveEntries(newEntries);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📍 New Travel Entry Saved!',
        body: `Saved location: ${address}`,
        sound: 'default',
      },
      trigger: null,
    });

    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#E8F8FF',
      padding: 20,
    },
    button: {
      backgroundColor: '#00A8E8',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      marginVertical: 10,
      elevation: 4,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    image: {
      width: '100%',
      height: 250,
      borderRadius: 15,
      marginTop: 20,
      borderWidth: 2,
      borderColor: '#00A8E8',
    },
    address: {
      fontSize: 16,
      color: isDark ? '#fff' : '#333',
      marginVertical: 15,
      fontStyle: 'italic',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <Text style={styles.buttonText}>📸 Take Picture</Text>
      </TouchableOpacity>

      {imageUri !== '' && (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Text style={styles.address}>{address}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#34C759' }]}
            onPress={saveEntry}
          >
            <Text style={styles.buttonText}>💾 Save Entry</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
