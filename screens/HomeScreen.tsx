import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { loadEntries, saveEntries } from '../utils/storage';
import { ThemeContext } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;
const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: Props) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      const stored = await loadEntries();
      setEntries(stored);
      setLoading(false);
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
      backgroundColor: colors.background,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      color: colors.text,
      fontSize: 16,
      textAlign: 'center',
      marginTop: 16,
    },
    entry: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    entryImage: {
      width: '100%',
      height: 200,
    },
    entryContent: {
      padding: 16,
    },
    entryAddress: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    entryDate: {
      color: colors.text + '99',
      fontSize: 14,
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    actionButton: {
      padding: 8,
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 6,
    },
    listContainer: {
      padding: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={80} color={colors.text + '50'} />
          <Text style={styles.emptyText}>
            No memories yet. Start capturing your journey by adding your first entry!
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <View style={styles.entry}>
              <Image 
                source={{ uri: item.imageUri }} 
                style={styles.entryImage}
                resizeMode="cover"
              />
              <View style={styles.entryContent}>
                <Text style={styles.entryAddress}>{item.address}</Text>
                <Text style={styles.entryDate}>
                  {new Date().toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => removeEntry(index)}
                >
                  <Ionicons name="trash-outline" size={22} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddEntryScreen')}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}