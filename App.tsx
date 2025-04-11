// App.tsx
import React, { useState, createContext, useContext } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, useColorScheme } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import AddEntryScreen from './screens/AddEntryScreen';
import { RootStackParamList } from './navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

export default function App() {
  const scheme = useColorScheme();
  const [isDark, setIsDark] = useState(scheme === 'dark');

  const appTheme: NavigationTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(!isDark) }}>
      <NavigationContainer theme={appTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: "Travel Diary",
              headerRight: () => (
                <Button title={isDark ? '☀️' : '🌙'} onPress={() => setIsDark(!isDark)} />
              ),
            }}
          />
          <Stack.Screen name="AddEntryScreen" component={AddEntryScreen} options={{ title: 'Add New Entry' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
