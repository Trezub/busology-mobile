import React, { useState, useEffect } from 'react'
import { TextInput, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons, SimpleLineIcons, Fontisto } from '@expo/vector-icons'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Polyline } from 'react-native-maps';
import api from '../../services/api';
import styles from './styles';
import utils from '../../utils';

export default function LineDetail() {
    const navigation = useNavigation();
    const route = useRoute();

    const line = route.params.line;

    const [dynamicData, setDynamicData] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeTimeTables, setActiveTimeTables] = useState('Carregando...');


    useEffect(() => {
        loadDynamicData();
    }, [])


    function navigateToMap(car) {
        navigation.navigate('lineMap', {line, activeTimeTables, car, dynamicData});
    }

    async function loadDynamicData() {
        if (loading) return;

        setLoading(true);
        try {
            const response = (await api.get('/dynamic/line/' + line.code)).data;
            setDynamicData(response);
            setActiveTimeTables(`${response.activeTimeTables} tabelas ativas`);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    return (
        <View>
            <View style={styles.staticWrapper}>
                <View style={styles.line}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Ionicons name="md-arrow-back" size={24} color="black" style={{marginRight: 15, marginLeft: 5}} />
                    </TouchableOpacity>
                    <Text style={[styles.lineCode, utils.getLineColorStyle(line.type)]}>{line.code}</Text>
                    <Text style={styles.lineName}>{line.name}</Text>
                    <TouchableOpacity onPress={() => navigateToMap()} style={[styles.button, { marginLeft: 'auto' }]}>
                        <SimpleLineIcons name="map" size={15} color="black" />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text>Implantada em: {line.implantedDate}</Text>
                    <Text style={styles.property}>Tipo:  {line.longType}</Text>
                    <Text>Status: {activeTimeTables}</Text>
                </View>
            </View>
            <Text style={{fontSize:20,color:'#888',textAlign: 'center', marginTop: 10}}>Carros na linha:</Text>
            <View style={styles.container}>
                <FlatList
                    data={dynamicData.cars}
                    showsVerticalScrollIndicator={true}
                    keyExtractor={car => String(car.id)}

                    renderItem={({ item: car }) => (
                        <View style={styles.car}>
                            <View style={[styles.lineCode, { marginBottom: 10 }]}><Text>{car.prefix} - {car.owner}</Text></View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ marginLeft: 10 }} >
                                    <Text>Tipo: {car.type.name}</Text>
                                    <Text>Status do carro: {car.status.description}</Text>
                                    <Text>Próxima partida: {car.nextDeparture.name} ({car.nextDeparture.time})</Text>
                                    <Text>Tabela: {car.timeTable.code} ({car.timeTable.owner}) - {car.scheduleStatus}</Text>
                                    <Text>Visto por último: {car.lastSeen}</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigateToMap(car)} style={[styles.button, { marginTop: 'auto', marginLeft: 'auto'}]}>
                                    <Fontisto icons name="map-marker-alt" size={15} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                ></FlatList>
            </View>
        </View>
    );
}