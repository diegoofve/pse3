import { Request, Response } from 'express';
import { CinemaCreationSchema, CinemaDeletionSchema, CinemaEditSchema, CinemaFiltersSchema } from '../dto/cinema.dto';
import { CinemaService } from '../services/cinema.service';

/**
 * @openapi
 * /cinemas:
 *   get:
 *     summary: Obtener listado de cines
 *     tags: [Cines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cines
 *       400:
 *         description: Request incorrecta
 *       500:
 *         description: Error interno del servidor
 */
const getCinemas = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = CinemaFiltersSchema.safeParse(req.query);

    if(!validation.success){
      res.status(400).json({error: 'Request incorrecta'})
      return;
    }

    const cinemas = await CinemaService.getCinemas(validation.data);
    res.status(200).json(cinemas);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * @openapi
 * /cinemas:
 *   post:
 *     summary: Crear un cine
 *     tags: [Cines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CinemaCreationDto'
 *     responses:
 *       201:
 *         description: Cine creado correctamente
 *       400:
 *         description: Request incorrecta
 *       500:
 *         description: Error interno del servidor
 */
const createCinema = async (req: Request, res: Response): Promise<void> => {
  try{
    const validation = CinemaCreationSchema.safeParse(req.body);

    if(!validation.success){
      res.status(400).json({error: 'Request incorrecta'})
      return;
    }
    const DBresponse = await CinemaService.createCinema(validation.data);
    
//devuelvo el cine, si se llega aqui no ha habido errores al crearlo
    res.status(201).json(DBresponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * @openapi
 * /cinemas:
 *   put:
 *     summary: Editar un cine
 *     tags: [Cines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CinemaEditDto'
 *     responses:
 *       200:
 *         description: Cine editado correctamente
 *       400:
 *         description: Request incorrecta
 *       404:
 *         description: Cine no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const editCinema = async (req: Request, res: Response): Promise<void> => {
  try{
    const validation = CinemaEditSchema.safeParse(req.body);

    if(!validation.success){
      res.status(400).json({error: 'Request incorrecta'})
      return;
    }

    const DBresponse = await CinemaService.editCinema(validation.data);

    //devuelvo el cine, si se llega aqui no ha habido errores al editarlo
    res.status(200).json(DBresponse);
  }catch (error: any) {
    console.log(error);

    if(error.message === 'NOT_FOUND'){
      res.status(404).json({ error: 'Cine no encontrado'});
    }else{
      res.status(500).json({ error: 'Error interno del servidor '});
    }
  }
};

/**
 * @openapi
 * /cinemas:
 *   delete:
 *     summary: Eliminar un cine
 *     tags: [Cines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CinemaDeletionDto'
 *     responses:
 *       204:
 *         description: Cine eliminado correctamente
 *       404:
 *         description: Cine no encontrado
 *       500:
 *         description: Error interno del servidor
 */
const deleteCinema = async (req: Request, res: Response): Promise<void> => {
  try{
    const validation = CinemaDeletionSchema.safeParse(req.body);

    if(!validation.success){
      res.status(400).json({error: 'Request incorrecta'})
      return;
    }

    await CinemaService.deleteCinema(validation.data);

    //Si algo saliera mal, lo coge el catch
    res.status(204).send();
  }catch (error: any) {
    console.log(error);

    if(error.message === 'NOT_FOUND'){
      res.status(404).json({ error: 'Cine no encontrado'});
    }else{
      res.status(500).json({ error: 'Error interno del servidor '});
    }
  }
};

export const CinemaController = {
  getCinemas,
  createCinema,
  editCinema,
  deleteCinema
}