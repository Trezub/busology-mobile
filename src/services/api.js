import axios from 'axios';

const api = axios.create({
    baseURL: 'http://api.busology.softiba.com.br',
    timeout: 10000,
});
export default api;