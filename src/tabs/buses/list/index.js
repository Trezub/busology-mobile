import React, { useState, useEffect } from 'react'
import { TextInput, View, Text, TouchableOpacity, SectionList, FlatList } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import owners from '../../../services/owners';
import api from '../../../services/api';
import styles from './styles';
import utils from '../../../utils'
import groupBy from 'lodash.groupby';

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
    const [sections, setSections] = useState([]);
    const [searchTerms, setSearchTerms] = useState('');
    const [lines, setLines] = useState([]);

    const navigation = useNavigation();

    let loading = false;

    let total = -1;
    let searchTimeout;
    let carsFoundOnSearch = 0;

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    async function loadCars() {
        if (loading) return;
        if (cars.length === total) return;

        loading = true;
        try {
            const response = await api.get('/cars', {
                params: {
                    skip: cars.length - carsFoundOnSearch,
                }
            });
            total = response.headers['x-bus-count'];
            const newArray = [...cars, ...response.data.filter(c => !cars.some(c2 => c2.code === c.code))];

            setCars(newArray);
        } catch (err) {
            loading = false;
            console.log(err);
        }
        loading = false;
    }

    let carsReturnedOnSearch = 0;
    let totalSearch = -1;
    async function searchCars(code) {
        if (!code) {
            return;
        }
        if (loading) return;
        if (totalSearch === carsReturnedOnSearch) return;
        try {
            loading = true;
            const response = await api.get('/cars', {
                cancelToken: source.token,
                params: {
                    code,
                    skip: carsReturnedOnSearch,
                }
            });
            carsReturnedOnSearch += response.data.length;
            totalSearch = response.headers['x-bus-count'];
            const foundCars = response.data.filter(c => !cars.some(c2 => c2.code === c.code));
            carsFoundOnSearch += foundCars.length;
            const newArray = [...cars, ...foundCars];
            setCars(newArray);
            loading = false;
        } catch (err) {
            loading = false;
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

    useEffect(() => {
        loadCars();
        loadLines();
    }, []);

    function mapCarGroups() {
        if (cars.length === 0) {
            return;
        }
        const filtered = cars.filter(c => c.code.includes(searchTerms));
        const groups = groupBy(filtered, (car) => car.code[0]);
        const sections = [...Object.entries(groups)].map(([k, v]) => {
            return {
                title: k,
                data: [v], // Nested lists
            }
        });
        setSections(sections);
    }

    useEffect(mapCarGroups, [searchTerms, cars]);


    function navigateToDetail(car) {
        navigation.navigate('CarDetail', { car });
    }

    function searchTermsChanged(text) {
        if (text === '') {
            carsReturnedOnSearch = 0;
            totalSearch = -1;
            return;
        }
        if (loading) {
            source.cancel();
        }
        searchCars(text);
    }

    function setSearchTimeout(text) {
        setSearchTerms(text);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => searchTermsChanged(text), 1000);
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
                    onPress={() => setSearchTerms('')}
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
                        style={{ flex: 1 }}
                        columnWrapperStyle={{ flex: 1, justifyContent: 'space-around' }}
                        renderItem={({ item: car }) => {
                            const line = lines.find(l => l.COD === car.lastSession.lineCode);
                            const lineStyle = utils.getLineColorStyle(line && line.NOME_COR);
                            const carStyle = utils.getLineColorStyle(car.color);
                            const lineName = car.lastSession.lineCode === 'REC' ? 'Recolhe' : (line && line.NOME || 'Desconhecido');
                            const stateText = car.lastSession.open ? (
                                <View
                                    style={{ alignSelf: 'center', marginVertical: 5, flexDirection: 'row' }}
                                >
                                    <FontAwesome name="feed" size={15} color="#0be881" style={{ marginRight: 5 }} />
                                    <Text style={{ color: '#000' }}>Em operação:</Text>
                                </View>
                            ) : (
                                    <Text
                                        style={{ alignSelf: 'center', marginVertical: 5, color: '#333' }}
                                    >
                                        Visto por último em:
                                    </Text>
                                )
                            return (
                                <View style={styles.car}>
                                    <TouchableOpacity onPress={() => navigateToDetail(car)}>
                                        <Text style={[styles.carCode, (carStyle || lineStyle), { alignSelf: 'center' }]}>{car.code}</Text>
                                        {stateText}
                                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                            <Text style={[styles.lineCode, (lineStyle || carStyle)]}>
                                                {car.lastSession.lineCode}
                                            </Text>
                                            <Text style={styles.lineName}>
                                                {lineName}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}

                    >

                    </FlatList>
                )}
            />
        </View>
    );
}
