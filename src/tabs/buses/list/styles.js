
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Constants.statusBarHeight + 20,
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

    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#fcfcfc',
        paddingVertical: 5,
        fontSize: 16,
        marginBottom: 5,
        paddingHorizontal: 15,
        borderRadius: 10,
    },

});