import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveEntries = async (entries: any[]) => {
  await AsyncStorage.setItem('entries', JSON.stringify(entries));
};

export const loadEntries = async () => {
  const json = await AsyncStorage.getItem('entries');
  return json ? JSON.parse(json) : [];
};
