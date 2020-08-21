import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
    fill: {
        ...StyleSheet.absoluteFillObject,
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
});