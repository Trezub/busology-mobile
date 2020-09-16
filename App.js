import React from 'react';
import LinesRouter from './src/tabs/lines/router';
import CarsRouter from './src/tabs/buses/router';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function App() {
    const Tab = createBottomTabNavigator();

    return (
        <NavigationContainer>
            <Tab.Navigator tabBarOptions={{ activeTintColor: '#3c40c6', inactiveTintColor: 'gray' }}>
                <Tab.Screen name='Lines' component={LinesRouter} options={{
                    tabBarIcon: ({ focused }) => (<FontAwesome5 name="route" size={15} color={focused ? '#3c40c6' : 'gray'} />),
                    title: 'Linhas',
                }} />
                <Tab.Screen name='Buses' component={CarsRouter} options={{
                    tabBarIcon: ({ focused }) => (<FontAwesome5 name="bus" size={15} color={focused ? '#3c40c6' : 'gray'} />),
                    title: 'Ônibus',
                }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
