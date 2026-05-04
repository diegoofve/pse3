import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

export const buyTicket = async (req: Request, res: Response) => {
    try {
        const { movieId, cinemaId, amount } = req.body;

        const paymentResult = await PaymentService.chargePayment({
            amount: amount,
            description: `Compra de entrada - Cine: ${cinemaId}, Película: ${movieId}`
        });

        res.status(200).json({ 
            success: true, 
            message: 'Pago con éxito', 
            data: paymentResult 
        });

    } catch (error) {
        //console.error('Error en la pasarela de pago:', error); -> hacerlo con logging del labo 08
        res.status(400).json({ 
            success: false, 
            message: 'El pago da error' 
        });
    }
};