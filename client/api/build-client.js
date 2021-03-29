import axios from 'axios';

const buldClient = ({ req }) => {
    if(typeof window === 'undefined'){
        return axios.create({
            baseURL: 'https://157.230.201.202/',
            headers: req.headers
        });
    }else{
        return axios.create({
            baseURL: '/',
        });
    }
};
export default buldClient;