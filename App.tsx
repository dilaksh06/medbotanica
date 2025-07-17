// App.tsx

import React from 'react';
import 'react-native-gesture-handler'; // at very top of App.tsx
import RootNavigator from './app/navigation/RootNavigator'; // ✅ Your main navigator

export default function App() {
  return <RootNavigator />;
}
