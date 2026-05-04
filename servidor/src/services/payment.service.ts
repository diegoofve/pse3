import axios from 'axios';


const client = axios.create({
timeout: 5000,
headers: { 'Content-Type': 'application/json' }
baseURL: process.env.WEBSERVICES_BASE_URL || 'https://webservices.samuelencinas.dev/api',
});
// Performs login
async function login(): Promise<string> {
const { data } = await client.post<ExternalLoginResponseDto>('/auth/login', {
username: process.env.WEBSERVICES_USERNAME,
password: process.env.WEBSERVICES_PASSWORD
});
return data.access_token;
}
// Performs payment
export async function chargePayment(payload: PaymentRequestDto): Promise<PaymentResultDto> {
const token = await login();
const { data } = await client.post<ExternalPaymentResponseDto>('/payments/charge'
, payload, {
headers: { Authorization: `Bearer ${token}` }
});
return data;
}