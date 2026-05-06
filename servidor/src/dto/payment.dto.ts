import { z } from 'zod';

export const PaymentSchema = z.object({
  cardHolder: z.string(),
  cardNumber: z.string(),
  expiryDate: z.string(),
  cvv: z.string(),
  amount: z.number().positive(),
  currency: z.string()
}).strict();

export const BuyTicketSchema = z.object({
    movieId: z.number().int(),
    cinemaId: z.number().int(),
    cardHolder: z.string().min(1),
    cardNumber: z.string().regex(/^\d{16}$/, 'Debe tener exactamente 16 dígitos'),
    expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Formato MM/YY'),
    cvv: z.string().regex(/^\d{3,4}$/, 'Debe tener 3 o 4 dígitos'),
}).strict();

export type PaymentDto = z.infer<typeof PaymentSchema>;
export type BuyTicketDto = z.infer<typeof BuyTicketSchema>;