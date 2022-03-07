import axios from 'axios';
import { getSession } from 'next-auth/react';

const baseURL = process.env.API_URL || '/api';

const ApiClient = () => {
    const defaultOptions = {
        baseURL,
    };

    const instance = axios.create(defaultOptions);

    instance.interceptors.request.use(async (request) => {
        console.log(baseURL, request.url)
        const session = await getSession();
        if (session && request.headers) {
            request.headers.Authorization = `Bearer ${session.jwt}`;
        }
        return request;
    });

    return instance;
};

export default ApiClient();