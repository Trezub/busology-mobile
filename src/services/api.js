import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
    baseURL: Constants.isDevice ? 'http://api.busology.softiba.com.br' : 'http://192.168.0.5',
    timeout: 10000,
});
export default api;