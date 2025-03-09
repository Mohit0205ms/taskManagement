import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from "react-native-paper";
import NavigationStack from './navigation/NavigationStack';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './app/store';
import { Provider } from 'react-redux';

export function App() {

  return (
    <Provider store={store}>
      <PaperProvider>
        <SafeAreaProvider style={{ flex: 1, paddingBottom: 40 }}>
          <NavigationContainer>
            <NavigationStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
}
