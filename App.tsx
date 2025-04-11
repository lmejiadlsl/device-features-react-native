import React, { useState, createContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme as NavigationTheme, } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, useColorScheme, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import AddEntryScreen from './screens/AddEntryScreen';
import { RootStackParamList } from './navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const customTheme = {
  light: {
    primary: '#5E72E4',
    secondary: '#11CDEF',
    background: '#F7FAFC',
    card: '#FFFFFF',
    text: '#1A202C',
    border: '#E2E8F0',
    accent: '#F6AD55',
    danger: '#F56565',
    success: '#48BB78',
  },
  dark: {
    primary: '#5E72E4',
    secondary: '#11CDEF',
    background: '#1A202C',
    card: '#2D3748',
    text: '#F7FAFC',
    border: '#4A5568',
    accent: '#F6AD55',
    danger: '#FC8181',
    success: '#68D391',
  }
};

export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
  colors: customTheme.light,
});

export default function App() {
  const scheme = useColorScheme();
  const [isDark, setIsDark] = useState(scheme === 'dark');

  const colors = isDark ? customTheme.dark : customTheme.light;
  
  const appTheme: NavigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        isDark, 
        toggleTheme: () => setIsDark(!isDark),
        colors,
      }}
    >
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background}
      />
      <NavigationContainer theme={appTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: "My Travel Diary",
              headerRight: () => (
                <TouchableOpacity 
                  onPress={() => setIsDark(!isDark)}
                  style={{ padding: 8 }}
                >
                  <Ionicons 
                    name={isDark ? 'sunny' : 'moon'} 
                    size={22} 
                    color={colors.text} 
                  />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen 
            name="AddEntryScreen" 
            component={AddEntryScreen} 
            options={{ title: 'New Memory' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
