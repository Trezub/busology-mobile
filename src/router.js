import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CarDetail from './pages/carDetail';
import Home from './pages/home';
import LineDetail from './pages/lineDetail';
import LineMap from './pages/lineMap';


const Stack = createStackNavigator();

export default function MainRouter() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                headerMode='none'
                screenOptions={{
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                }}
            >
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='CarDetail' component={CarDetail} />
                <Stack.Screen name='LineDetail' component={LineDetail} />
                <Stack.Screen name='LineMap' component={LineMap} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}