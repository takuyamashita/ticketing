import axios from 'axios';

const buldClient = ({ req }) => {
    if(typeof window === 'undefined'){
        return axios.create({
            baseURL: 'http://ticketing-app-u-prod.xyz',
            headers: req.headers
        });
    }else{
        return axios.create({
            baseURL: '/',
        });
    }
};
export default buldClient;