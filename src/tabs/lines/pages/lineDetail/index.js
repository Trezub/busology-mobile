import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons, SimpleLineIcons, Fontisto } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import io from "socket.io-client";
import merge from "lodash.merge";
import carTypes from "../../../../services/vehicleTypes";
import moment from "moment";
import styles from "./styles";
import utils from "../../../../utils";
import api from "../../../../services/api";

export default function LineDetail() {
    const navigation = useNavigation();
    const route = useRoute();

    const line = route.params.line;
    let socket;
    let renderTimeout;

    const tempCars = [];

    const [cars, setCars] = useState(route.params.cars || []);
    const [activeTimeTables, setActiveTimeTables] = useState(
        route.params.activeTimeTables || "Carregando..."
    );

    useEffect(() => {
        socket = io(api.defaults.baseURL);
        socket.on("connect", () => {
            //console.log('socket connected');
            socket.emit("sub", line.COD);
        });
        socket.on("newCar", (car) => {
            // // console.log('newCar ' + car.code);
            const oldCar = tempCars.find((c) => c.code === car.code);
            if (oldCar) {
                merge(oldCar, car);
            } else {
                tempCars.push(car);
            }
            clearTimeout(renderTimeout);
            setTimeout(updateCarsState, 500);
        });
        socket.on("carRemoved", (code) => {
            // // console.log('carRemoved ' + code);
            const idx = tempCars.findIndex((c) => c.code === code);
            if (idx !== -1) {
                tempCars.splice(idx, 1);
                clearTimeout(renderTimeout);
                setTimeout(updateCarsState, 500);
            }
        });
        socket.on("carUpdated", ({ code, diff }) => {
            // // console.log('carUpdated ' + code);
            const oldCar = tempCars.find((c) => c.code === code);
            if (oldCar) {
                merge(oldCar, diff);
                clearTimeout(renderTimeout);
                setTimeout(updateCarsState, 500);
            }
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    function updateCarsState() {
        setCars(merge([], tempCars));
    }

    useEffect(() => {
        setActiveTimeTables(`${cars.length} sessões abertas`);
    }, [cars]);

    function navigateToMap(car) {
        navigation.navigate("lineMap", { line, activeTimeTables, car });
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
                        style={[styles.lineCode, utils.getLineColorStyle(line.NOME_COR)]}
                    >
                        {line.COD}
                    </Text>
                    <Text style={styles.lineName}>{line.NOME}</Text>
                    <TouchableOpacity
                        onPress={() => navigateToMap()}
                        style={[styles.button, { marginLeft: "auto" }]}
                    >
                        <SimpleLineIcons name="map" size={15} color="black" />
                    </TouchableOpacity>
                </View>
                <View>
                    {/* <Text>Implantada em: {line.implantedDate}</Text> */}
                    <Text style={styles.property}>Tipo: {line.CATEGORIA_SERVICO}</Text>
                    <Text>Status: {activeTimeTables}</Text>
                </View>
            </View>
            <Text
                style={{
                    fontSize: 20,
                    color: "#888",
                    textAlign: "center",
                    marginTop: 10,
                }}
            >
                Carros na linha:
      </Text>
            <View style={styles.container}>
                <FlatList
                    data={cars}
                    showsVerticalScrollIndicator={true}
                    keyExtractor={(car) => car.code}
                    style={{ flex: 1 }}
                    renderItem={({ item: car }) => (
                        <View style={styles.car}>
                            <View style={[styles.lineCode, { marginBottom: 10 }]}>
                                <Text>{car.code}</Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ marginLeft: 10, flex: 1 }}>
                                    <Text>Tipo: {carTypes[car.type] || "Desconhecido"}</Text>
                                    <Text>Status do carro: {car.operational.status}</Text>
                                    <Text>
                                        Sentido: {car.operational.direction || "Desconhecido"}
                                    </Text>
                                    {/* <Text>Próxima partida: {car.operational.nextDeparture || 'Desconhecido'}</Text> */}
                                    <Text>
                                        Tabela: {car.operational.timeTable} -{" "}
                                        {car.operational.timeTableStatus}
                                    </Text>
                                    <Text>
                                        Visto por último: {moment(car.lastSeen).format("HH:mm")}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => navigateToMap(car)}
                                    style={[
                                        styles.button,
                                        { marginTop: "auto", marginLeft: "auto" },
                                    ]}
                                >
                                    <Fontisto
                                        icons
                                        name="map-marker-alt"
                                        size={15}
                                        color="black"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                ></FlatList>
            </View>
        </View>
    );
}
