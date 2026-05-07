import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { BuyTicketSchema } from '../dto/payment.dto';
import axios from 'axios';
import { logger } from '../lib/logger';

/**
 * @openapi
 * /tickets/buy:
 *   post:
 *     summary: Comprar una entrada
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BuyTicketDto'
 *     responses:
 *       200:
 *         description: Pago con éxito
 *       400:
 *         description: Datos de pago no válidos
 *       402:
 *         description: Pasarela de pago no disponible
 *       500:
 *         description: Error interno del servidor
 */
export const buyTicket = async (req: Request, res: Response) => {
    try {
        const validation = BuyTicketSchema.safeParse(req.body);
        
        if(!validation.success){
            res.status(400).json({success:false, error:"datos inválidos"});
            return;
        }

        const { movieId, cinemaId, cardHolder, cardNumber, expiryDate, cvv } = validation.data;
        
        const paymentResult = await PaymentService.chargePayment({
            cardHolder: cardHolder,
            cardNumber: cardNumber,
            expiryDate: expiryDate,
            cvv: cvv,
            amount: 8, //hardcodeamos el precio a 8 EUR por entrada y una entrada por peticion
            currency: "EUR"
        });

        // TODO: descontar entradas disponibles con movieId y cinemaId

        res.status(200).json({ 
            success: true, 
            message: 'Pago con éxito', 
        });
        logger.info({ movieId, cinemaId }, 'Pago realizado correctamente')


    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 400) {
                res.status(400).json({ success: false, message: 'Datos de pago no válidos' });
                logger.warn({ error: error.message }, 'Datos de pago no válidos');
            } else if (status === 401) {
                res.status(500).json({ success: false, message: 'Error interno del servidor' }); //Si no tenemos autorizacion a la pasarela de pago es error nuestro (del server)
                logger.error({ error: error.message }, 'Error interno del servidor');
            } else if (status === 422 || status === 503 || status === 504 || status === 429) {
                res.status(402).json({ success: false, message: 'Pasarela de pago no disponible, inténtalo de nuevo' });
                logger.warn({ error: error.message }, 'Pasarela de pago no disponible');
            } else {
                res.status(500).json({ success: false, message: 'Error inesperado en la pasarela de pago' });
                logger.error({ error: error.message }, 'Error inesperado en la pasarela de pago');
            }
        } else {
            res.status(500).json({ success: false, message: 'Error interno del servidor' });
            console.error('Error inesperado:', error);
        }
    }
};