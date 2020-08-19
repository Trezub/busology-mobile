import React, { useState, useEffect } from 'react'
import { TextInput, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import styles from './styles';

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
            filterLines('');
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadLines();
    }, []);

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

    function filterLines(searchTerms) {
        setSearchTerms(searchTerms);
        setFilteredLines(lines.filter(l => l.name.includes(searchTerms.toUpperCase()) ||  l.code.startsWith(searchTerms)));
    }

    function navigateToDetail(line) {
        navigation.navigate('LineDetail', {line});
    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='Pesquisar'
                value={searchTerms}
                onChangeText={filterLines}
                style={styles.searchBar}
            />
            <FlatList
                data={filteredLines}
                style={styles.list}
                showsVerticalScrollIndicator={true}
                keyExtractor={line => String(line.id)}

                renderItem={({ item: line }) => (
                    <TouchableOpacity style={styles.line} onPress={() => navigateToDetail(line)}>
                        <Text style={[styles.lineCode, getLineColorStyle(line.type)]}>{line.code}</Text>
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
