import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { View, Text, TouchableOpacity } from 'react-native';

export default function SessionsDetail() {
    const route = useRoute();
    const navigation = useNavigation();
    const { line, car } = route.params;

    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                }}
            >
                <Ionicons name="md-arrow-back" size={24} color="black" style={{marginRight: 15, marginLeft: 5}} />
            </TouchableOpacity>
            <Text style={[styles.lineCode, utils.getLineColorStyle(!!line?line.NOME_COR:car.color)]}>{!!line?line.COD:car.code}</Text>
            <Text style={styles.lineName}>{!!line ? line.NOME : car.owner}</Text>
        </View>
    );
}

