import React, { useState, useEffect } from 'react'
import { TextInput, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import styles from './styles';
import utils from '../../utils'

import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";


// notificacoes
// import Constants from 'expo-constants';
// import * as Notifications from 'expo-notifications';
// import * as Permissions from 'expo-permissions';

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: false,
//         shouldSetBadge: false,
//     }),
// });

export default function Home() {
    const [lines, setLines] = useState([]);
    const [filteredLines, setFilteredLines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerms, setSearchTerms] = useState('');

    const navigation = useNavigation();

    //notificacoes 

    // const [expoPushToken, setExpoPushToken] = useState('');
    // const [notification, setNotification] = useState(false);
    // const notificationListener = useRef();
    // const responseListener = useRef();
    // useEffect(() => {
    //     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    //     // This listener is fired whenever a notification is received while the app is foregrounded
    //     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //         setNotification(notification);
    //     });

    //     // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    //     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //         console.log(response);
    //     });

    //     return () => {
    //         Notifications.removeNotificationSubscription(notificationListener);
    //         Notifications.removeNotificationSubscription(responseListener);
    //     };
    // }, []);

    // async function registerForPushNotificationsAsync() {
    //     let token;
    //     if (Constants.isDevice) {
    //         const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    //         let finalStatus = existingStatus;
    //         if (existingStatus !== 'granted') {
    //             const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //             finalStatus = status;
    //         }
    //         if (finalStatus !== 'granted') {
    //             console.log('Failed to get push token for push notification!');
    //             return;
    //         }
    //         token = (await Notifications.getExpoPushTokenAsync()).data;
    //         console.log(token);
    //     } else {
    //         alert('Must use physical device for Push Notifications');
    //     }

    //     if (Platform.OS === 'android') {
    //         Notifications.setNotificationChannelAsync('default', {
    //             name: 'default',
    //             importance: Notifications.AndroidImportance.MAX,
    //             vibrationPattern: [0, 250, 250, 250],
    //             lightColor: '#FF231F7C',
    //         });
    //     }

    //     return token;
    // }




    async function loadLines() {
        if (loading) return;

        setLoading(true);
        try {
            const response = await api.get('/static/lines');
            setLines(response.data);
            setFilteredLines(response.data);
        } catch (err) {
            (err);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadLines();
    }, []);

    useEffect(() => {
        setFilteredLines(lines.filter(l => l.NOME.includes(searchTerms.toUpperCase()) || l.COD.startsWith(searchTerms)));
    }, [searchTerms]);


    function navigateToDetail(line) {
        navigation.navigate('LineDetail', { line });
    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='Pesquisar'
                onChangeText={setSearchTerms}
                value={searchTerms}
                style={styles.searchBar}
            />
            <FlatList
                data={filteredLines}
                style={styles.list}
                showsVerticalScrollIndicator={true}
                keyExtractor={line => line.COD}

                renderItem={({ item: line }) => (
                    <TouchableOpacity style={styles.line} onPress={() => navigateToDetail(line)}>
                        <Text style={[styles.lineCode, utils.getLineColorStyle(line.NOME_COR)]}>{line.COD}</Text>
                        <Text style={styles.lineName}>{line.NOME}</Text>
                        <View
                            style={styles.detailButton}
                        >
                            <FontAwesome name="chevron-circle-right" size={15} color="#777" />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
