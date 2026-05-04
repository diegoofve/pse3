import { Router } from 'express';
import { MovieController } from '../controllers/movie.controller'; 
import passport from 'passport';
import { CinemaController } from '../controllers/cinema.controller';
import { Role } from "@prisma/client";
import { authorize } from './auth';
import { buyTicket } from '../controllers/payment.controller';

/**
 * Middleware: Protected Router
 * 
 * Implementación de un Express Router personalizado para rutas protegidas
 * 
 */

const protectedRouter = Router();
protectedRouter.get('/', passport.authenticate('jwt', { session: false }), authorize([Role.CLIENT, Role.CINEMA, Role.ADMIN]), 
MovieController.getMovies);


// POST /movies (ruta, middleware de autenticación, controller)
protectedRouter.get('/movies', passport.authenticate('jwt', { session: false }), authorize([Role.CLIENT, Role.CINEMA, Role.ADMIN]), 
MovieController.getMovies);

protectedRouter.post('/movies', passport.authenticate('jwt', { session: false }), authorize([Role.CINEMA, Role.ADMIN]), 
MovieController.createMovie
);

protectedRouter.put('/movies', passport.authenticate('jwt', { session: false }), authorize([Role.CINEMA, Role.ADMIN]), 
MovieController.editMovie
);

protectedRouter.delete('/movies', passport.authenticate('jwt', { session: false }), authorize([Role.ADMIN]), 
MovieController.deleteMovie
);

// POST /cinemas (ruta, middleware de autenticación, controller)
protectedRouter.get('/cinemas', passport.authenticate('jwt', { session: false }), authorize([Role.CLIENT, Role.CINEMA, Role.ADMIN]),
CinemaController.getCinemas);

protectedRouter.post('/cinemas', passport.authenticate('jwt', { session: false }), authorize([Role.CINEMA, Role.ADMIN]),
CinemaController.createCinema
);

protectedRouter.put('/cinemas', passport.authenticate('jwt', { session: false }), authorize([Role.CINEMA, Role.ADMIN]),
CinemaController.editCinema
);

protectedRouter.delete('/cinemas', passport.authenticate('jwt', { session: false }), authorize([Role.ADMIN]),
CinemaController.deleteCinema
);

protectedRouter.post('/tickets/buy', passport.authenticate('jwt', { session: false }), authorize([Role.CLIENT, Role.CINEMA, Role.ADMIN]),buyTicket);

export default protectedRouter;