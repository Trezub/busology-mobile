import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

import styles from './styles';
import utils from '../../../utils';
import owners from '../../../services/owners';
import types from '../../../services/vehicleTypes';
import api from '../../../services/api';
import Carousel from 'react-native-snap-carousel';

export default function CarDetail() {
    const route = useRoute();
    const navigation = useNavigation();

    const [car, setCar] = useState(route.params.car);
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [sessionCount, setSessionCount] = useState(-1);

    async function loadData() {
        try {
            const [carRes, sessionsRes] = await Promise.all([
                api.get(`/car/${car.code}`),
                api.get(`/car/${car.code}/sessions`),
            ]);
            if (carRes.status === 200) {
                setCar({ ...car, ...carRes.data });
            } else {
                console.log(`No data found for car ${car.code}. Status ${carRes.status}`);
            }
            if (sessionsRes.status === 200) {
                setSessions([...sessions, ...sessionsRes.data.filter(s => !sessions.some(s2 => s2.id === s.id))]);
                setSessionCount(sessionsRes.headers['x-session-count']);
            } else {
                console.log(`no sessions found for car ${car.code}.`);
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    let carouselRef;

    function renderCarData() {
        if (loading) return;
        console.log('rendering cardata');
        return (
            <View style={{ flex: 1 }}>
                <Text style={styles.property}>Tipo: {types[car.type]}</Text>
                <Text>Chassis: {`${car.chassis.manufacturer} ${car.chassis.name}`}</Text>
                <Text>Carroceria: {`${car.bodywork.manufacturer} ${car.bodywork.name}`}</Text>
                {car.enteredAt != null ? (<Text>Data de entrada: {car.enteredAt}</Text>) : null}
                <Text>Visto por último: {car.lastSeen}</Text>
            </View>
        );
    }
    function renderSessions() {
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'center', fontSize: 20, }}>Sessoes:</Text>
                <Text style={{ fontSize: 50, textAlign: 'center', marginTop: 185 }}>O Jogo</Text>
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
                </View>
            </View>
            <Carousel
                data={[sessions, car]}
                ref={component => carouselRef = component}
                renderItem={renderCarouselItem}
                itemWidth={Dimensions.get('window').width - 40}
                sliderWidth={Dimensions.get('window').width}
                slideStyle={styles.container}
            >

            </Carousel>
        </View>
    );
}

