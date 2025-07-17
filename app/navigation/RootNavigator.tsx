import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen'; // ✅ Import your Register screen
import BottomTabNavigator from './BottomTabNavigator';
export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    MainTabs: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
