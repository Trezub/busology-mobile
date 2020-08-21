import React, { useState, useEffect } from 'react'
import { TextInput, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import styles from './styles';
import utils from '../../utils'

export default function Home() {
    const [lines, setLines] = useState([]);
    const [filteredLines, setFilteredLines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerms, setSearchTerms] = useState('');
    
    const navigation = useNavigation();

    async function loadLines() {
        if (loading) return;

        setLoading(true);
        try {
            const response = await api.get('/static/lines');
            setLines(response.data.lines);
            setFilteredLines(response.data.lines);
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadLines();
    }, []);

    useEffect(() => {
        setFilteredLines(lines.filter(l => l.name.includes(searchTerms.toUpperCase()) ||  l.code.startsWith(searchTerms)));
    }, [searchTerms]);


    function navigateToDetail(line) {
        navigation.navigate('LineDetail', {line});
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
                keyExtractor={line => String(line.id)}

                renderItem={({ item: line }) => (
                    <TouchableOpacity style={styles.line} onPress={() => navigateToDetail(line)}>
                        <Text style={[styles.lineCode, utils.getLineColorStyle(line.type)]}>{line.code}</Text>
                        <Text style={styles.lineName}>{line.name}</Text>
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
