import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import List from './list';
import CarDetail from './carDetail';
import React from 'react';

const Stack = createStackNavigator();

export default function Router() {
    return (
        <Stack.Navigator
            headerMode='none'
            screenOptions={{
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <Stack.Screen name='List' component={List} />
            <Stack.Screen name='CarDetail' component={CarDetail} />
        </Stack.Navigator>
    );
}