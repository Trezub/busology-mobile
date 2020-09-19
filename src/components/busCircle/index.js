import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Easing, UIManager, Platform, LayoutAnimation } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import api from '../../services/api';
import utils from '../../utils';
import styles from './styles';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default function BusCircle({ car, line, onPress }) {
    const [imageLoaded, setImageLoaded] = useState(false);


    // Car code animations:
    const borderAnim = useRef(new Animated.Value(360)).current;
    const minHeightAnim = useRef(new Animated.Value(100)).current;
    const minWidthAnim = useRef(new Animated.Value(100)).current;
    const topAnim = useRef(new Animated.Value(0)).current;
    const [extraStyle, setExtraStyle] = useState({ fontSize: 15 });

    function animateProperty(prop, { toValue, duration = 1500, easing = Easing.out(Easing.exp) }) {
        Animated.timing(
            prop,
            {
                toValue,
                duration,
                easing,
                useNativeDriver: false,
            }
        ).start();
    }
    // ---

    useEffect(() => {
        return () => {
            setImageLoaded(false);
        }
    }, []);
    useEffect(() => {
        if (imageLoaded) {
            animateCode();
        } else {
            undoAnimations();
        }
    }, [imageLoaded]);

    function undoAnimations() {
        borderAnim.setValue(360);
        minHeightAnim.setValue(100);
        minWidthAnim.setValue(100);
        topAnim.setValue(0);
        setExtraStyle({ fontSize: 15 });
    }

    function animateCode() {
        animateProperty(borderAnim, { toValue: 5, duration: 600, });
        animateProperty(minHeightAnim, { toValue: 0 });
        animateProperty(minWidthAnim, { toValue: 35 });
        animateProperty(topAnim, { toValue: 70, duration: 1000 });
        LayoutAnimation.configureNext({ duration: 1000 });
        LayoutAnimation.easeInEaseOut();
        setExtraStyle({ right: 20, fontSize: 13 });
    }

    const lineStyle = utils.getLineColorStyle(line && line.NOME_COR);
    const carStyle = utils.getLineColorStyle(car.color);
    const lineName = car.lastSession.lineCode === 'REC' ? 'RECOLHE' : (line && line.NOME || 'DESCONHECIDO');
    const stateText = car.lastSession.open ? (
        <View
            style={{ alignSelf: 'center', marginVertical: 5, flexDirection: 'row', marginTop: 105 }}
        >
            <FontAwesome name="feed" size={15} color="#0be881" style={{ marginRight: 5, textAlignVertical: 'center' }} />
            <Text style={{ color: '#000' }}>Em operação: </Text>
        </View>
    ) : (
            <Text
                style={{ alignSelf: 'center', marginVertical: 5, color: '#333', marginTop: 105 }}
            >
                Visto por último em: </Text>
        )
    return (
        <View style={styles.car}>
            <TouchableOpacity onPress={onPress}>
                <Image
                    style={{ height: 100, width: 100, borderRadius: 360, position: 'absolute', alignSelf: 'center' }}
                    source={{ uri: `${api.defaults.baseURL}/assets/thumb/${car.code}` }}
                    onLoad={() => setImageLoaded(true)}
                    resizeMethod='resize'
                />
                <Animated.Text
                    style={[styles.carCode, (carStyle || lineStyle), {
                        borderRadius: borderAnim,
                        minHeight: minHeightAnim,
                        minWidth: minWidthAnim,
                        top: topAnim,
                        alignSelf: 'center',
                    }, extraStyle]}>{car.code}
                </Animated.Text>
                {stateText}
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <Text style={[styles.lineCode, (lineStyle || carStyle)]}>
                        {car.lastSession.lineCode}
                    </Text>
                    <Text style={styles.lineName}>
                        {lineName} </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}