import React from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store';
import { ThemeProvider } from "./src/providers/ThemeProvider";
import { LanguageProvider } from "./src/providers/LanguageProvider";
import RootNavigator from "./src/navigation/RootNavigator";
import useFonts from "./src/utils/Fonts";
import { ToastProvider } from "./src/components/ui/Toast";

function AppContent() {
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF971D" />
      </View>
    );
  }

  return <RootNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <ThemeProvider>
            <LanguageProvider>
              <ToastProvider>
                <AppContent />
              </ToastProvider>
            </LanguageProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}