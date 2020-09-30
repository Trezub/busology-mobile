import { FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import CarsList from './buses';
import LinesList from './lines';

export default function App() {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator tabBarOptions={{ activeTintColor: '#3c40c6', inactiveTintColor: 'gray' }}>
            <Tab.Screen name='Lines' component={LinesList} options={{
                tabBarIcon: ({ focused }) => (<FontAwesome5 name="route" size={15} color={focused ? '#3c40c6' : 'gray'} />),
                title: 'Linhas',
            }} />
            <Tab.Screen name='Buses' component={CarsList} options={{
                tabBarIcon: ({ focused }) => (<FontAwesome5 name="bus" size={15} color={focused ? '#3c40c6' : 'gray'} />),
                title: 'Ônibus',
            }} />
        </Tab.Navigator>
    );
}
