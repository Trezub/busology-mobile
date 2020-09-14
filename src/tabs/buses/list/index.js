import React, { useState, useEffect } from 'react'
import { TextInput, View, Text, TouchableOpacity, SectionList } from 'react-native';
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
    const [loading, setLoading] = useState(false);
    const [searchTerms, setSearchTerms] = useState('');

    const navigation = useNavigation();

    let total = -1;
    let searchTimeout;
    let carsFoundOnSearch = 0;

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    async function loadCars(code) {
        if (loading) return;
        if (cars.length === total) returm;

        setLoading(true);
        try {
            const response = await api.get('/cars', {
                cancelToken: source.token,
                params: {
                    skip: !!code && cars.length - carsFoundOnSearch,
                }
            });
            total = response.headers['x-bus-count'];
            const newArray = [...cars, ...response.data.filter(c => !cars.some(c2 => c2.code === c.code))];

            setCars(newArray);
        } catch (err) {
            if (axios.isCancel(err)) return console.log('cars request canceled');
            console.log(err);
        }
        setLoading(false);
    }

    let carsReturnedOnSearch = 0;
    let totalSearch = -1;
    async function searchCars(code) {
        if (!code) {
            return;
        }
        if (loading) {
            source.cancel();
        }
        if (totalSearch === carsReturnedOnSearch) return;
        try {
            setLoading(true);
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
            setLoading(false);
        } catch (err) {
            if (axios.isCancel(err)) return console.log('car search canceled');
        }
    }

    useEffect(() => {
        loadCars();
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
                data: v,
            }
        });
        setSections(sections);
    }

    useEffect(mapCarGroups, [searchTerms, cars]);


    function navigateToDetail(car) {
        navigation.navigate('carDetail', car);
    }

    function searchTermsChanged(text) {
        if (text === '') {
            carsReturnedOnSearch = 0;
            totalSearch = -1;
            return;
        }
        searchCars(text);
    }

    function setSearchTimeout(text) {
        setSearchTerms(text);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => searchTermsChanged(text), 1000);
        console.log('timeout set');
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
                keyExtractor={car => car.code}
                onEndReached={loadCars}
                onEndReachedThreshold={1}
                stickySectionHeadersEnabled={true}
                style={{ flex: 1 }}

                renderSectionHeader={({ section: { title } }) => {
                    return (
                        <Text style={styles.header}>{owners[title[0]]}</Text>
                    );
                }}

                renderItem={({ item: car }) => (
                    <TouchableOpacity style={styles.line} onPress={() => navigateToDetail(car)}>
                        <Text style={[styles.lineCode, utils.getLineColorStyle(car.color)]}>{car.code}</Text>
                        <Text style={styles.lineName}>{owners[car.code[0]]}</Text>
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
