import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { loadEntries, saveEntries } from '../utils/storage';
import { ThemeContext } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEntryScreen'>;
const { width } = Dimensions.get('window');

export default function AddEntryScreen({ navigation }: Props) {
  const [imageUri, setImageUri] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors } = useContext(ThemeContext);

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
    try {
      const result = await ImagePicker.launchCameraAsync({ 
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets.length > 0) {
        setLoading(true);
        const uri = result.assets[0].uri;
        setImageUri(uri);

        try {
          const loc = await Location.getCurrentPositionAsync({});
          const geocode = await Location.reverseGeocodeAsync(loc.coords);
          const addr = geocode[0]?.name && geocode[0]?.city 
            ? `${geocode[0].name}, ${geocode[0].city}` 
            : "Unknown location";
          setAddress(addr);
        } catch (error) {
          console.error('Failed to get location:', error);
          setAddress('Unknown location');
          Alert.alert('Location Error', 'Could not determine your current location.');
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Camera Error', 'There was a problem accessing the camera.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets.length > 0) {
        setLoading(true);
        const uri = result.assets[0].uri;
        setImageUri(uri);

        try {
          const loc = await Location.getCurrentPositionAsync({});
          const geocode = await Location.reverseGeocodeAsync(loc.coords);
          const addr = geocode[0]?.name && geocode[0]?.city 
            ? `${geocode[0].name}, ${geocode[0].city}` 
            : "Unknown location";
          setAddress(addr);
        } catch (error) {
          console.error('Failed to get location:', error);
          setAddress('Unknown location');
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Gallery Error', 'There was a problem accessing your photos.');
    }
  };

  const saveEntry = async () => {
    try {
      setLoading(true);
      const entries = await loadEntries();
      const newEntry = { 
        imageUri, 
        address,
        date: new Date().toISOString(),
      };
      const newEntries = [...entries, newEntry];
      await saveEntries(newEntries);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✨ New Memory Captured!',
          body: `Location: ${address}`,
          sound: 'default',
        },
        trigger: null,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Failed to save entry:', error);
      Alert.alert('Save Error', 'Could not save your memory. Please try again.');
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      padding: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    button: {
      backgroundColor: colors.card,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      flex: 1,
      marginHorizontal: 6,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    buttonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
      marginLeft: 8,
    },
    imageContainer: {
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 20,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      height: 300,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    image: {
      width: '100%',
      height: 300,
    },
    placeholderText: {
      color: colors.text + '70',
      fontSize: 16,
    },
    addressContainer: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
    },
    addressIcon: {
      marginRight: 12,
    },
    address: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    saveButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Ionicons name="camera" size={20} color={colors.primary} />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Ionicons name="images" size={20} color={colors.primary} />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <Text style={styles.placeholderText}>No image selected</Text>
          )}
        </View>

        {imageUri !== '' && (
          <>
            <View style={styles.addressContainer}>
              <Ionicons 
                name="location" 
                size={24} 
                color={colors.primary} 
                style={styles.addressIcon} 
              />
              <Text style={styles.address}>{address || 'Fetching location...'}</Text>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveEntry}
              disabled={loading}
            >
              <Ionicons name="save" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Memory</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
}