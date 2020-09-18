import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    lineCode: {
        fontSize: 13,
        backgroundColor: '#ed7900',
        paddingHorizontal: 5,
        paddingVertical: 3,
        minWidth: 35,
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 5
    },
    carCode: {
        position: 'absolute',
        backgroundColor: '#ed7900',
        color: '#fff',
        textAlignVertical: 'center',
        textAlign: 'center',
        padding: 5,
    },
    lineName: {
        fontSize: 12,
        marginLeft: 8,
        maxWidth: 100,
        textAlignVertical: 'center',
    },
    car: {
        flexDirection: 'column',
        marginBottom: 25,
        width: 170,
    },
});