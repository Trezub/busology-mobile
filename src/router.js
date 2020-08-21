import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import homeScreen from './pages/home';
import lineDetail from './pages/lineDetail'
import lineMap from './pages/lineMap';
import React from 'react';

const Stack = createStackNavigator();

export default function Router() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                headerMode='none'
                screenOptions={{
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }}
            >
                <Stack.Screen name='Home' component={homeScreen} />
                <Stack.Screen name='LineDetail' component={lineDetail} />
                <Stack.Screen name='lineMap' component={lineMap} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}