import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Polyline, Callout, Marker } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import carTypes from '../../services/vehicleTypes';
import Carousel from 'react-native-snap-carousel';
import merge from 'lodash.merge';
import groupBy from 'lodash.groupby';
import io from 'socket.io-client';
import api from '../../services/api';
import styles from './styles';
import utils from '../../utils';

export default function LineMap() {
    const circularLines = ['020', '021', '022', '023', '502', '602', '507', '508', '001', '002', '010', '011'];

    const route = useRoute();
    const navigation = useNavigation();

    const { line, car } = route.params;
    line.isCircular = circularLines.includes(line.COD) ? true : false;

    const lineStyle = utils.getLineColorStyle(line.NOME_COR);

    const [shapes, setShapes] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [activeTimeTables, setActiveTimeTables] = useState(route.params.activeTimeTables || 'Carregando...');
    const [cars, setCars] = useState(route.params.cars || []);
    const initialMapRegion = { // Curitiba centro
        latitude: -25.428571,
        longitude: -49.268916,
        latitudeDelta: 0.4,
        longitudeDelta: 0.4,
    }
    const tempCars = [];

    let renderTimeout;

    useEffect(() => {
        loadShapes()
        socket = io(api.defaults.baseURL);
        socket.on('connect', () => {
            // console.log('socket connected');
            socket.emit('sub', line.COD);
        });
        socket.on('newCar', car => {
            // console.log('newCar ' + car.code);
            const oldCar = tempCars.find(c => c.code === car.code);
            if (oldCar) {
                merge(oldCar, car);
            } else {
                tempCars.push(car);
            }
            // Reset timer
            clearTimeout(renderTimeout);
            renderTimeout = setTimeout(updateCarsState, 500);
        });
        socket.on('carRemoved', code => {
            // console.log('carRemoved ' + code);
            const idx = tempCars.findIndex(c => c.code === code);
            if (idx !== -1) {
                tempCars.splice(idx, 1);
            }
            clearTimeout(renderTimeout);
            renderTimeout = setTimeout(updateCarsState, 500);
        });
        socket.on('carUpdated', ({ code, diff }) => {
            // console.log('carUpdated ' + code);
            const oldCar = tempCars.find(c => c.code === code);
            if (oldCar) {
                merge(oldCar, diff);
            }
            clearTimeout(renderTimeout);
            renderTimeout = setTimeout(updateCarsState, 500);
        });
        return () => {
            socket.disconnect();
        }
    }, []);

    function updateCarsState() {
        setCars(merge([], tempCars));
    }

    useEffect(() => { // Cars finished loading
        if (!cars) return;
        setActiveTimeTables(`${cars.length} sessões abertas`);
    }, [cars]);

    //useEffect(drawRote, [mapLoaded, routeData]); // Map and shape finished loading

    useEffect(() => { // When the shape loads and no car is selected
        if (car || shapes.length == 0 || !mapLoaded) return;
        mapRef.fitToCoordinates(shapes.reduce((acc, val) => acc.concat(val), [])); // array.flat alternative
    }, [shapes, mapLoaded]);

    useEffect(() => { // When the shape loads and a car is selected
        if (shapes.length == 0 || selectedIndex == -1 || !mapLoaded) return;
        carousel.snapToItem(selectedIndex);
        mapRef.animateCamera({
            center: {
                latitude: cars[selectedIndex].lat,
                longitude: cars[selectedIndex].lon,
            },
            zoom: 15,
        }, { duration: 1000, })
    }, [selectedIndex, shapes, mapLoaded]);

    useEffect(() => {
        if (!car || cars.length === 0) {
            return;
        }
        setSelectedIndex(cars.findIndex(c => c.code === car.code));
    }, [car, cars]);

    async function loadShapes() {
        try {
            const response = (await api.get('static/route/' + line.COD)).data;
            setShapes(
                Object.values(
                    groupBy(
                        response.map(({ SHP, LAT, LON }) => {
                            return {
                                latitude: Number(LAT.replace(',', '.')),
                                longitude: Number(LON.replace(',', '.')),
                                id: SHP
                            }
                        }),
                        'id')));
        } catch (err) {
            //// console.log(err);
        }
    }

    const onMapRendered = () => {
        setMapLoaded(true);
        //// console.log('mapa carregado: ' + mapLoaded);
        mapRef.setMapBoundaries({ latitude: -25.346069, longitude: -49.417642 }, { latitude: -25.647403, longitude: -49.158386 });
    }

    function goBack() {
        navigation.navigate('LineDetail', { activeTimeTables })
    }

    function renderCarouselItem({ item: car }) {
        return (
            <View style={styles.car}>
                <Text>{car.code}</Text>
                <Text>Tipo: {carTypes[car.type]}</Text>
                <Text>Tabela: {car.operational.timeTable} - {car.operational.timeTableStatus}</Text>
                <Text>Atualizado em: {new Date(car.lastSeen).toLocaleTimeString([], { timeStyle: 'short' })}</Text>
            </View>
        )
    }

    return (
        <View style={styles.fill}>
            <MapView
                moveOnMarkerPress={false}
                ref={component => mapRef = component}
                provider='google'
                onLayout={onMapRendered}
                initialRegion={initialMapRegion}
                showsCompass={true}
                pitchEnabled={false}
                loadingEnabled={true}
                showsIndoors={false}
                showsTraffic={false}
                style={styles.fill}
            >
                { // Draw shapes
                    shapes.map((shape, i) => {
                        if (line.isCircular && i > 0) return;
                        return (
                            <Polyline
                                key={shape[0].id}
                                coordinates={shape}
                                strokeWidth={3}
                                strokeColor={lineStyle.backgroundColor}
                            //strokeColor={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                            />
                        )
                    })
                }
                { // Draw car markers
                    cars.map((car, index) => (
                        <Marker
                            onPress={() => setSelectedIndex(index)}
                            coordinate={{
                                latitude: car.lat,
                                longitude: car.lon,
                            }}
                            key={car.code}
                        >
                            <View style={{
                                borderRadius: 50,
                                backgroundColor: selectedIndex === index ? '#0984e3' : lineStyle.backgroundColor,
                                borderColor: '#1e272e',
                                borderWidth: 1,
                                height: 20,
                                width: 20,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }} >
                                <MaterialCommunityIcons name="bus" size={12} color='#fff' />
                            </View>
                        </Marker>
                    ))
                }
            </MapView>
            <View style={styles.staticWrapper}>
                <View style={styles.line}>
                    <TouchableOpacity onPress={goBack}>
                        <Ionicons name="md-arrow-back" size={24} color="black" style={{ marginRight: 15, marginLeft: 5 }} />
                    </TouchableOpacity>
                    <Text style={[styles.lineCode, lineStyle]}>{line.COD}</Text>
                    <Text style={styles.lineName}>{line.NOME}</Text>
                </View>
                <View>
                    <Text style={styles.property}>Tipo:  {line.CATEGORIA_SERVICO}</Text>
                    <Text>Status: {activeTimeTables}</Text>
                </View>
            </View>
            <View style={styles.carousel} >
                <Carousel
                    ref={component => carousel = component}
                    data={cars}
                    renderItem={renderCarouselItem}
                    sliderWidth={400}
                    itemWidth={300}
                    layout='tinder'
                    onBeforeSnapToItem={setSelectedIndex}
                />
            </View>
        </View>

    );
}