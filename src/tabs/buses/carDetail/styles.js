import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
    container: {
        marginVertical: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 25,
        flex: 1,
    },
    card: {
        marginVertical: 15,
        flex: 1,
    },
    car: {
        marginBottom: 20,
    },

    specsHeader: {
        width: '100%',
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 8,
    },
    specName: {
        color: '#485460',
    },
    specProp: {
        color: '#000',
        fontWeight: 'bold',
    },
    specLink: {
        flexDirection: 'row',
        padding: 8,
        width: '100%',
    },
    sessionProp: {
        flexDirection: 'row',
        padding: 5,
        width: '100%',
        marginLeft: 5,
    },
    specsContent: {
        paddingTop: 5,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        marginBottom: 8,
    },
    sessionHeader: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,

        elevation: 3,
        backgroundColor: '#fff',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        padding: 10,

        width: '100%',
    },

    horizontal: {
        flexDirection: 'row',
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
        width: '100%',
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
    button: {
        backgroundColor: '#eee',
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 8,
    }
});