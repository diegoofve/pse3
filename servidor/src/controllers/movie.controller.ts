import { Request, Response } from 'express';
import { MovieCreationSchema, MovieDeletionSchema, MovieEditSchema, MovieFiltersSchema } from '../dto/movie.dto';
import { MovieService } from '../services/movie.service';

/**
 * @openapi
 * /movies:
 *   get:
 *     summary: Obtener listado de películas
 *     tags: [Películas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de películas
 *       400:
 *         description: Request incorrecta
 *       500:
 *         description: Error interno del servidor
 */
const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = MovieFiltersSchema.safeParse(req.body);

    if(!validation.success){
      res.status(400).json({error: 'Request incorrecta'});
      return;
    }

    const movies = await MovieService.getMovies(validation.data);
    res.status(200).json(movies);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * @openapi
 * /movies:
 *   post:
 *     summary: Crear una película
 *     tags: [Películas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieCreationDto'
 *     responses:
 *       201:
 *         description: Película creada correctamente
 *       400:
 *         description: Request incorrecta o timeslot no existe
 *       500:
 *         description: Error interno del servidor
 */
const createMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = MovieCreationSchema.safeParse(req.body);

    if(!validation.success){
      res.status(400).json({error: 'Request incorrecta'});
      return;
    }

    await MovieService.createMovie(validation.data);

    res.status(201).json({ result: 'Se ha añadido el cine correctamente.'})
  } catch (error: any) {
    console.error(error);
    if(error.message === 'TIMESLOT_NOT_FOUND'){
      res.status(400).json({ error: 'No existe la hora seleccionada'});
    }else{
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

/**
 * @openapi
 * /movies:
 *   put:
 *     summary: Editar una película
 *     tags: [Películas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieEditDto'
 *     responses:
 *       200:
 *         description: Película editada correctamente
 *       400:
 *         description: Timeslot no existe
 *       404:
 *         description: Película no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const editMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = MovieEditSchema.safeParse(req.body);

    if(!validation.success){
      res.status(400).json({error: 'Request incorrecta'});
      return;
    }

    await MovieService.editMovie(validation.data);

    res.status(200).json({ result: 'Editado correctamente'})
  } catch (error:any) {
    console.error(error);
    if(error.message === 'NOT_FOUND'){
      res.status(404).json({ error: 'No se encuentra la pelicula'});
    }else if(error.message === 'TIMESLOT_NOT_FOUND'){
      res.status(400).json({ error: 'No existe la hora seleccionada'});
    }else{
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

/**
 * @openapi
 * /movies:
 *   delete:
 *     summary: Eliminar una película
 *     tags: [Películas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MovieDeletionDto'
 *     responses:
 *       204:
 *         description: Película eliminada correctamente
 *       404:
 *         description: Película no encontrada
 *       500:
 *         description: Error interno del servidor
 */
const deleteMovie = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = MovieDeletionSchema.safeParse(req.body);

    if(!validation.success){
      res.status(400).json({error: 'Request incorrecta'});
      return;
    }

    await MovieService.deleteMovie(validation.data);
    
    res.status(204).json({ result: 'Borrado correctamente'})
  } catch (error: any) {
    console.error(error);
    if (error.message === 'NOT_FOUND') {
      res.status(404).json({ error: 'Película no encontrada' });
    } else {
    res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

export const MovieController = {
  getMovies,
  createMovie,
  editMovie,
  deleteMovie
}