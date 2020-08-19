import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
    container: {
        marginTop: 15,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingTop: 20,
    },

    car: {
        marginBottom: 20,
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
    staticWrapper: {
        backgroundColor: '#fff',
        paddingBottom: 13, 
        paddingTop: Constants.statusBarHeight + 10,
        paddingHorizontal: 20,
    },
    line: {
        flexDirection: 'row',
        textAlignVertical: 'center',
        
        marginTop: 5,
        marginBottom: 10,
    },
    property: {
       textTransform: 'capitalize'
    },

    green: {
        backgroundColor: '#28a745'
    },
    yellow: {
        backgroundColor: '#ffc107',
        color: '#000',
    },
    red: {
        backgroundColor: '#dc3545'
    },
    orange: {
        backgroundColor: '#ed7900'
    },
    blue: {
        backgroundColor: '#007bff'
    },
    gray: {
        backgroundColor: '#6c757d'
    },
    white: {
        backgroundColor: '#eee',
        color: '#000',
    }
});