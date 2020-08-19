import React, { useState, useEffect } from 'react'
import { TextInput, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../../services/api';
import styles from './styles';

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

    async function loadDynamicData() {
        if (loading) return;

        setLoading(true);
        try {
            const response = (await api.get('/dynamic/line/' + line.code)).data;
            setDynamicData(response);
            setActiveTimeTables(`${response.activeTimeTables} tabelas ativas`)
        } catch (err) {
            console.log(err);
        }



        setLoading(false);
    }

    function getLineColorStyle(category) {
        switch (category) {
            case 'AL':
                return styles.orange;
            case 'TR':
            case 'CO':
                return styles.yellow;
            case 'IN':
                return styles.green;
            case 'EX':
                return styles.red;
            case 'LG':
                return styles.blue;
            case 'LD':
                return styles.gray;
            case 'CI':
                return styles.white;
        }
    }

    return (
        <View>
            <View style={styles.staticWrapper}>
                <View style={styles.line}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Ionicons name="md-arrow-back" size={24} color="black" style={{marginRight: 15, marginLeft: 5}} />
                    </TouchableOpacity>
                    <Text style={[styles.lineCode, getLineColorStyle(line.type)]}>{line.code}</Text>
                    <Text style={styles.lineName}>{line.name}</Text>
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
                            <View style={[styles.lineCode, {}]}><Text>{car.prefix}</Text></View>
                            <Text>Tipo: {car.type.name}</Text>
                            <Text>Status do carro: {car.status.description}</Text>
                            <Text>Próxima partida: {car.nextDeparture.name} ({car.nextDeparture.time})</Text>
                            <Text>Tabela: {car.timeTable.code} - {car.scheduleStatus}</Text>
                            <Text>Visto por último: {car.lastSeen}</Text>
                        </View>
                    )}
                ></FlatList>
            </View>
        </View>
    );
}