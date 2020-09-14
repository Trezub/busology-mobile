
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
        width: 50,
        paddingVertical: 5,
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
    header: {
        flex: 1,
        width: null,
        textAlign: 'center',
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 'auto',
        padding: 5,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    line: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        textAlignVertical: 'center',
        paddingVertical: 13,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
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