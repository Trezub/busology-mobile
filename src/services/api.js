import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
    baseURL: Constants.appOwnership === 'expo' ? 'http://192.168.0.5:3333' : 'http://ttg.softiba.com.br:3333',
    timeout: 10000,
});
export default api;