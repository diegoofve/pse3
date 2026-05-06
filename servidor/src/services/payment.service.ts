import axios from 'axios';
import { PaymentDto } from '../dto/payment.dto';

const client = axios.create({
    baseURL: process.env.API_BASE_URL || "api_falsa_para_que_typescript_no_de_error.com",
    timeout: 5000,
    headers: { 'Content-Type': 'application/json'}
});

export const PaymentService = {
    login: async (): Promise<string> => {
        const { data } = await client.post('/auth/login', {
            username: process.env.API_AUTH_USER,
            password: process.env.API_AUTH_PASSWORD
        });
        return data.access_token;
    },

    chargePayment: async (payload: PaymentDto): Promise<any> => {
        const token = await PaymentService.login();
        const { data } = await client.post('/payments/charge', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    }
}