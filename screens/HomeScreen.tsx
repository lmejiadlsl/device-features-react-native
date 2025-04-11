import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { loadEntries, saveEntries } from '../utils/storage';
import { ThemeContext } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen({ navigation }: Props) {
  const [entries, setEntries] = useState<any[]>([]);
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    const fetchEntries = async () => {
      const stored = await loadEntries();
      setEntries(stored);
    };
    const unsubscribe = navigation.addListener('focus', fetchEntries);
    return unsubscribe;
  }, [navigation]);

  const removeEntry = async (index: number) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
    await saveEntries(newEntries);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? '#121212' : '#E8F8FF',
    },
    text: {
      color: isDark ? '#fff' : '#000',
    },
    entry: {
      marginVertical: 10,
    },
  });

  return (
    <View style={styles.container}>
      {entries.length === 0 ? (
        <Text style={styles.text}>No Entries yet</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.entry}>
              <Text style={styles.text}>{item.address}</Text>
              <Button title="Remove" onPress={() => removeEntry(index)} />
            </View>
          )}
        />
      )}
      <Button title="Add Entry" onPress={() => navigation.navigate('AddEntryScreen')} />
    </View>
  );
}
