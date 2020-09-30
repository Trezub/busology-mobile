import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import { Feather, FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';



import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br', {
    calendar: {
        lastDay: '[Ontem às] LT',
        sameDay: '[Hoje às] LT',
        lastWeek: 'DD/MM/YYYY [às] LT',
        sameElse: 'DD/MM/YYYY [às] LT'
    }
});

import styles from './styles';
import utils from '../../../utils';
import owners from '../../../services/owners';
import types from '../../../services/vehicleTypes';
import api from '../../../services/api';
import Carousel from 'react-native-snap-carousel';
import { FlatList } from 'react-native-gesture-handler';

export default function CarDetail() {
    const route = useRoute();
    const navigation = useNavigation();
    const { lines } = route.params;

    const [car, setCar] = useState(route.params.car);
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [sessionCount, setSessionCount] = useState(-1);

    async function loadData() {
        try {
            const carRes = await api.get(`/car/${car.code}`);
            if (carRes.status === 200) {
                setCar({ ...car, ...carRes.data });
            } else {
                console.log(`No data found for car ${car.code}. Status ${carRes.status}`);
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }
    async function loadSessions() {
        if (sessions.length === sessionCount) return;
        const sessionsRes = await api.get(`/car/${car.code}/sessions`, {
            params: {
                skip: sessions.length,
            }
        });
        if (sessionsRes.status === 200) {
            setSessions([...sessions, ...sessionsRes.data.filter(s => !sessions.some(s2 => s2.id === s.id))]);
            setSessionCount(sessionsRes.headers['x-session-count']);
        } else {
            console.log(`no sessions found for car ${car.code}.`);
        }
    }

    useEffect(() => {
        loadData();
        loadSessions();
    }, []);

    function renderCarData() {
        if (loading) return;
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.specsHeader}>
                    <Text
                        style={{ fontSize: 20 }}
                    >
                        Ficha técnica
                    </Text>
                    <MaterialCommunityIcons name="clipboard-text" size={20} color="black" style={{ marginLeft: 5 }} />
                </View>
                <View style={[styles.specsContent, { borderRadius: 15 }]}>
                    <TouchableOpacity style={styles.specLink}>
                        <View style={styles.horizontal}>
                            <FontAwesome5 name="bus" size={13} color="#485460" style={{ marginRight: 5, textAlignVertical: 'center' }} />
                            <Text>{`${car.bodywork.manufacturer} ${car.bodywork.name} | ${types[car.type]} `}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.specLink}>
                        <View style={styles.horizontal}>
                            <Octicons name="gear" size={15} color="#485460" style={{ marginRight: 5, textAlignVertical: 'center' }} />
                            <Text>{`${car.chassis.manufacturer} ${car.chassis.name} `}</Text>
                        </View>
                    </TouchableOpacity>
                    {car.sinespData != null ? (
                        <View style={styles.specLink}>
                            <Fontisto name="date" size={13} color="black" style={{ marginRight: 5, textAlignVertical: 'center' }} />
                            <Text>Ano: {car.sinespData.year}/{car.sinespData.modelYear} </Text>
                        </View>
                    ) : null}
                    {car.enteredAt != null ? (
                        <View style={styles.specLink}>
                            <Fontisto name="date" size={13} color="black" style={{ marginRight: 5, textAlignVertical: 'center' }} />
                            <Text>Data de entrada: {moment(car.enteredAt).format('DD/MM/YYYY')} </Text>
                        </View>
                    ) : null}

                </View>
            </View>
        );
    }
    function renderSessions() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.specsHeader}>
                    <Text style={{ textAlign: 'center', fontSize: 20, }}>Sessões</Text>
                    <MaterialIcons name="library-books" size={20} color="black" style={{ marginLeft: 5 }} />
                </View>
                <FlatList
                    data={sessions}
                    onEndReached={loadSessions}
                    onEndReachedThreshold={1}
                    renderItem={({ item: session }) => {
                        const line = lines.find(l => l.COD === session.lineCode);
                        const lineName = line && line.NOME || 'DESCONHECIDO';
                        const lineStyle = utils.getLineColorStyle(line.NOME_COR);
                        const closedDate = moment(session.dateClosed).calendar();
                        const openedDate = moment(session.dateOpened).calendar();
                        return (
                            <View style={{ flex: 1 }}>
                                <View style={styles.sessionHeader}>
                                    <View style={styles.horizontal}>
                                        <Text style={[styles.lineCode, lineStyle]}>{session.lineCode}</Text>
                                        <Text style={styles.lineName}>{lineName}</Text>
                                    </View>
                                </View>
                                <View style={styles.specsContent}>
                                    <View style={[styles.horizontal, styles.sessionProp]}>
                                        <MaterialCommunityIcons name="timetable" size={15} color="black" style={{ marginRight: 5, textAlignVertical: 'center' }} />
                                        <Text style={{ width: '100%' }}>{session.timeTable}</Text>
                                    </View>
                                    <View style={[styles.horizontal, styles.sessionProp]}>
                                        <Feather name="log-in" size={15} color="black" style={{ marginRight: 5, textAlignVertical: 'center' }} />
                                        <Text style={{ width: '100%' }}>{openedDate === 'Invalid date' ? 'Desconhecido' : openedDate}</Text>
                                    </View>
                                    <View style={[styles.horizontal, styles.sessionProp]}>
                                        <Feather name="log-out" size={15} color="black" style={{ marginRight: 5, textAlignVertical: 'center' }} />
                                        <Text style={{ width: '100%' }}>{!session.open ? (closedDate === 'Invalid date' ? 'Desconhecido' : closedDate) : 'Operando'}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                />

            </View>
        )
    }

    function renderCarouselItem({ index }) {
        switch (index) {
            case 0: // Car
                return renderCarData();
            case 1: // Sessions
                return renderSessions();
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.staticWrapper}>
                <View style={styles.line}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Ionicons
                            name="md-arrow-back"
                            size={24}
                            color="black"
                            style={{ marginRight: 15, marginLeft: 5 }}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[styles.lineCode, utils.getLineColorStyle(car.color)]}
                    >
                        {car.code}
                    </Text>
                    <Text style={styles.lineName}>{owners[car.code[0]]}</Text>
                </View>
                <View>
                    <Text>Sessão {car.lastSession.open ? 'aberta' : 'fechada'}</Text>
                    <Text>Visto por último: {moment(car.lastSeen).fromNow()}</Text>
                </View>
            </View>
            <Carousel
                data={[sessions, car]}
                renderItem={renderCarouselItem}
                itemWidth={Dimensions.get('window').width - 40}
                sliderWidth={Dimensions.get('window').width}
                slideStyle={styles.card}
            >

            </Carousel>
        </View>
    );
}

