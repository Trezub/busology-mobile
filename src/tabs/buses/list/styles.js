
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Constants.statusBarHeight + 20,
    },
    lineCode: {
        fontSize: 13,
        backgroundColor: '#eb7434',
        paddingHorizontal: 5,
        paddingVertical: 3,
        minWidth: 35,
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 5
    },
    lineName: {
        fontSize: 12,
        marginLeft: 8,
        maxWidth: 100,
        textAlignVertical: 'center',
    },
    carCode: {
        width: 100,
        height: 100,
        borderRadius: 360,
        backgroundColor: '#ed7900',
        color: '#fff',
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 14,
    },
    header: {
        textAlign: 'center',
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 100,
        padding: 5,
        backgroundColor: '#fff',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    car: {
        flexDirection: 'column',
        marginBottom: 25,
        width: 170,
    },

    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#fcfcfc',
        paddingVertical: 5,
        fontSize: 16,
        marginBottom: 5,
        paddingHorizontal: 15,
        borderRadius: 10,
    },

    detailButton: {
        backgroundColor: '#fafafa',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 10,
        marginLeft: 'auto'
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