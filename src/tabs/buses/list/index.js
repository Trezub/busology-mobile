import React, { useState, useEffect, useRef } from 'react'
import { TextInput, View, Text, TouchableOpacity, SectionList, FlatList, RefreshControlBase } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import owners from '../../../services/owners';
import api from '../../../services/api';
import styles from './styles';
import groupBy from 'lodash.groupby';
import BusCircle from '../../../components/busCircle';

// import {
//     Placeholder,
//     PlaceholderMedia,
//     PlaceholderLine,
//     Fade
// } from "rn-placeholder";


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
    const [cars, setCars] = useState([]);
    const [foundCars, setFoundCars] = useState([]);
    const [sections, setSections] = useState([]);
    const [searchTerms, setSearchTerms] = useState('');
    const [lines, setLines] = useState([]);

    useEffect(() => {
        loadCars();
        loadLines();
    }, []);
    useEffect(mapCarGroups, [searchTerms, cars, foundCars]);

    const navigation = useNavigation();
    function navigateToDetail(car) {
        navigation.navigate('CarDetail', { car, lines });
    }


    const refs = useRef({
        total: -1,
        searchTimeout: null,
        searchRequest: axios.CancelToken.source(),
        loading: false,
        totalSearch: -1,
    }).current;

    async function loadCars() {
        if (refs.loading) return;
        if (cars.length === refs.total) return;

        loading = true;
        try {
            const response = await api.get('/cars', {
                params: {
                    skip: cars.length,
                }
            });
            refs.total = response.headers['x-bus-count'];
            const newArray = [...cars, ...response.data.filter(c => !cars.some(c2 => c2.code === c.code))];

            setCars(newArray);
        } catch (err) {
            refs.loading = false;
            console.log(err);
        }
        loading = false;
    }

    async function searchCars(code) {
        if (!code) {
            return;
        }
        if (refs.loading) return;
        if (refs.totalSearch === foundCars.length) return;
        try {
            refs.loading = true;
            const response = await api.get('/cars', {
                cancelToken: refs.searchRequest.token,
                params: {
                    code: code.toUpperCase(),
                    skip: foundCars.length,
                }
            });

            refs.totalSearch = response.headers['x-bus-count'];
            const found = response.data.filter(c => !cars.some(c2 => c2.code === c.code));
            setFoundCars([...foundCars, ...found]);
            refs.loading = false;
        } catch (err) {
            refs.loading = false;
            if (axios.isCancel(err)) {
                return console.log('car search canceled');
            };
            console.log(err);
        }
    }

    async function loadLines() {
        try {
            const response = (await api.get('/static/lines')).data;
            if (response) {
                setLines(response);
            } else {
                console.log(`/static/lines returned ${response}`);
            }
        } catch (err) {
            console.log(`Error getting lines: ${err}`);
        }
    }

    function mapCarGroups() {
        if (cars.length === 0) {
            return;
        }
        const filtered = [...cars.filter(c => c.code.includes(searchTerms)), ...foundCars];
        const groups = groupBy(filtered, (car) => car.code[0]);
        const sections = [...Object.entries(groups)].map(([k, v]) => {
            return {
                title: k,
                data: [v], // Nested lists
            }
        });
        setSections(sections);
    }

    function searchTermsChanged(text) {
        refs.totalSearch = -1;
        setFoundCars([]);
        if (text === '') {
            return;
        }
        if (loading) {
            refs.searchRequest.cancel();
        }
        searchCars(text);
    }

    function setSearchTimeout(text) {
        setSearchTerms(text);
        clearTimeout(refs.searchTimeout);
        refs.searchTimeout = setTimeout(() => searchTermsChanged(text), 300);
        console.log('timeout set');
    }

    function loadX() {
        if (searchTerms === '') {
            loadCars();
        } else {
            searchCars(searchTerms);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    placeholder='Pesquisar'
                    onChangeText={setSearchTimeout}
                    value={searchTerms}
                    style={{ flex: 1 }}
                />
                <TouchableOpacity
                    onPress={() => {
                        setSearchTerms('');
                        searchTermsChanged('');
                    }}
                    style={{ marginLeft: 'auto', justifyContent: 'center', display: searchTerms !== '' ? 'flex' : 'none' }}
                >
                    <MaterialIcons name="clear" size={15} color="#2d3436" />
                </TouchableOpacity>
            </View>
            <SectionList
                sections={sections}
                showsVerticalScrollIndicator={true}
                keyExtractor={list => list.title}
                onEndReached={loadX}
                onEndReachedThreshold={2}
                stickySectionHeadersEnabled={true}
                style={{ flex: 1, }}

                renderSectionHeader={({ section: { title } }) => {
                    return (
                        <Text style={styles.header}>{owners[title[0]]}</Text>
                    );
                }}

                renderItem={({ item: sectionCars }) => (
                    <FlatList
                        data={sectionCars}
                        numColumns={2}
                        keyExtractor={car => car.code}
                        viewabilityConfig={{ itemVisiblePercentThreshold: 100, minimumViewTime: 300 }}
                        style={{ flex: 1 }}
                        columnWrapperStyle={{ flex: 1, justifyContent: 'space-around' }}
                        renderItem={({ item: car }) =>
                            <BusCircle
                                line={lines.find(l => l.COD === car.lastSession.lineCode)}
                                car={car}
                                onPress={() => navigateToDetail(car)}
                            />
                        }

                    >

                    </FlatList>
                )}
            />
        </View>
    );
}
