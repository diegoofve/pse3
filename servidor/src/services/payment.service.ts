import axios from 'axios';

const client = axios.create({
    baseURL: process.env.WEBSERVICES_BASE_URL || 'https://webservices.samuelencinas.dev/api',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json'}
});

export const PaymentService = {
    login: async (): Promise<string> => {
        const { data } = await client.post('/auth/login', {
            username: process.env.WEBSERVICES_USERNAME,
            password: process.env.WEBSERVICES_PASSWORD
        });
        return data.access_token;
    },

    chargePayment: async (payload: any): Promise<any> => {
        const token = await PaymentService.login();
        const { data } = await client.post('/payments/charge', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }
}