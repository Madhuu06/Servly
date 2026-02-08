import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <LocationProvider>
          <AppNavigator />
        </LocationProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
