import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import api from '../../services/api';
import styles from './styles';
import utils from '../../utils';

export default function LineMap() {
    const route = useRoute();
    const navigation = useNavigation();

    const { line, car } = route.params;
    const lineStyle = utils.getLineColorStyle(line.type);

    const [routeData, setRouteData] = useState({});
    const [shapePoints, setShapePoints] = useState([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [activeTimeTables, setActiveTimeTables] = useState(route.params.activeTimeTables);
    const [dynamicData, setDynamicData] = useState(route.params.dynamicData);
    const [carMarkers, setCarMarkers] = useState([]);
    const [mapRegion, setMapRegion] = useState({
        latitude: -25.428571,
        longitude: -49.268916,
        latitudeDelta: 0.4,
        longitudeDelta: 0.4,
    });

    useEffect(() => {
        if (!dynamicData) return;
        setCarMarkers(dynamicData.cars);
    }, [dynamicData])
    useEffect(drawRote, [mapLoaded, routeData]);
    useEffect(() => {
        if (car || shapePoints.length == 0) return;
        mapRef.fitToCoordinates(shapePoints);
    }, [shapePoints]);
    useEffect(() => {
        if (!routeData.shape || !car) return;
        mapRef.animateCamera({
            center: {
                latitude: car.position.lat,
                longitude: car.position.lon,
            },
            zoom: 16,
        }, {duration: 1500,})
    }, [car, shapePoints]);
    useEffect(() => { loadRouteData() }, []);
    useEffect(() => {
        if (!routeData.shape) return;
    }, [dynamicData]);

    function drawRote() {
        if (!mapLoaded || !routeData.shape) return;
        
        setShapePoints(routeData.shape.map(({ lat, lon }) => { return { latitude: lat, longitude: lon } }));
    }

    async function loadRouteData() {
        try {
            const response = (await api.get('static/route/' + line.code)).data;
            setRouteData(response);
        } catch (err) {
            console.log(err);
        }
    }

    const onMapRendered = () => {
        setMapLoaded(true);
        //console.log('mapa carregado: ' + mapLoaded);
        this.mapRef.setMapBoundaries({ latitude: -25.346069, longitude: -49.417642 }, { latitude: -25.647403, longitude: -49.158386 });
    }

    function goBack() {
        navigation.navigate('LineDetail', {dynamicData, activeTimeTables})
    }

    return (
        <View style={styles.fill}>
            <MapView
                ref={component => mapRef = component}
                provider='google'
                onLayout={onMapRendered}
                initialRegion={mapRegion}
                showsCompass={true}
                pitchEnabled={false}
                loadingEnabled={true}
                showsIndoors={false}
                showsTraffic={false}
                style={styles.fill}
            >
                <Polyline
                    coordinates={shapePoints}
                    strokeWidth={3}
                    strokeColor={lineStyle.backgroundColor}
                />
                {
                    carMarkers.map((car) => (
                        <Marker
                            coordinate={{
                                latitude: car.position.lat,
                                longitude: car.position.lon,
                            }}
                            key={car.id}
                        >
                            <MaterialCommunityIcons name="bus" size={15} color="black" />
                        </Marker>
                    ))
                }
            </MapView>
            <View style={styles.staticWrapper}>
                <View style={styles.line}>
                    <TouchableOpacity onPress={goBack}>
                        <Ionicons name="md-arrow-back" size={24} color="black" style={{ marginRight: 15, marginLeft: 5 }} />
                    </TouchableOpacity>
                    <Text style={[styles.lineCode, lineStyle]}>{line.code}</Text>
                    <Text style={styles.lineName}>{line.name}</Text>
                </View>
                <View>
                    <Text>Implantada em: {line.implantedDate}</Text>
                    <Text style={styles.property}>Tipo:  {line.longType}</Text>
                    <Text>Status: {activeTimeTables}</Text>
                </View>
            </View>
        </View>

    );
}