// App.tsx

import React from 'react';
import 'react-native-gesture-handler'; // ✅ MUST be at very top
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './app/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigator />
    </GestureHandlerRootView>
  );
}
