import axios from 'axios';

const instance = axios.create({
    baseURL: "https://alfonso-whatsapp-backend.herokuapp.com/"
});

export default instance;

// (process.env.LOCAL_MODE === "true") ?

