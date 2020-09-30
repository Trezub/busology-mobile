import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
    fill: {
        ...StyleSheet.absoluteFillObject,
    },
    staticWrapper: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        marginTop: Constants.statusBarHeight + 10,
        marginHorizontal: 15,
        borderRadius: 20,
        paddingHorizontal: 20,
    },
    line: {
        flexDirection: 'row',
        textAlignVertical: 'center',

        marginTop: 5,
        marginBottom: 10,
    },
    car: {
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#fff',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    carousel: {
        position: 'absolute',
        bottom: 0,
        height: 140,
    },
    lineCode: {
        fontSize: 13,
        backgroundColor: '#eee',
        paddingVertical: 5,
        paddingHorizontal: 8,
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 5
    },
    lineName: {
        fontSize: 15,
        marginLeft: 10,
        textAlignVertical: 'center',
    },
    property: {
        textTransform: 'capitalize'
    },

    detailButton: {
        backgroundColor: '#fafafa',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 10,
        marginLeft: 'auto'
    },
});