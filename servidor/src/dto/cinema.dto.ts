import z from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     CinemaCatalogDto:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - sessions
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         title:
 *           type: string
 *           example: "Inception"
 *         sessions:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - date
 *               - start
 *               - end
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2026-05-12"
 *               start:
 *                 type: string
 *                 example: "18:00"
 *               end:
 *                 type: string
 *                 example: "20:30"
 */
export const CinemaCatalogSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  sessions: z.array(z.object({
    date: z.string(),
    start: z.string(),
    end: z.string()
  }))
});

/**
 * @swagger
 * components:
 *   schemas:
 *     CinemaFiltersDto:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         sessionBefore:
 *           type: string
 *           format: date-time
 *           example: "2026-05-20T00:00:00.000Z"
 *         sessionAfter:
 *           type: string
 *           format: date-time
 *           example: "2026-05-01T00:00:00.000Z"
 *         withMovie:
 *           type: integer
 *           example: 4
 *         withCatalog:
 *           type: boolean
 *           example: true
 */
export const CinemaFiltersSchema = z.object({
  id: z.coerce.number().int().optional(),
  sessionBefore: z.coerce.date().optional(),
  sessionAfter: z.coerce.date().optional(),
  withMovie: z.coerce.number().int().optional(),
  withCatalog: z.coerce.boolean().optional()
}).strict(); //strict para no aceptar mas parametros en el body

/**
 * @swagger
 * components:
 *   schemas:
 *     CinemaCreationDto:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - name
 *         - capacity
 *       properties:
 *         name:
 *           type: string
 *           example: "Cines Segovia"
 *         capacity:
 *           type: integer
 *           example: 250
 *         catalog:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CinemaCatalogDto'
 */
export const CinemaCreationSchema = z.object({
  name: z.string(),
  capacity: z.number().int(),
  catalog: z.array(CinemaCatalogSchema).optional() 
}).strict();

/**
 * @swagger
 * components:
 *   schemas:
 *     CinemaEditDto:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: "Cines Centro"
 *         capacity:
 *           type: integer
 *           example: 300
 *         catalog:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CinemaCatalogDto'
 */
export const CinemaEditSchema = z.object({
  id: z.number().int(),
  name: z.string().optional(),
  capacity: z.number().int().optional(),
  catalog: z.array(CinemaCatalogSchema).optional()
}).strict();

/**
 * @swagger
 * components:
 *   schemas:
 *     CinemaDeletionDto:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 */
export const CinemaDeletionSchema = z.object({
  id: z.number().int()
}).strict();

/**
 * @swagger
 * components:
 *   schemas:
 *     CinemaResponseDto:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - capacity
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Cines Segovia"
 *         capacity:
 *           type: integer
 *           example: 220
 *         catalog:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CinemaCatalogDto'
 */
export const CinemaResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  capacity: z.number().int(),
  catalog: z.array(CinemaCatalogSchema).optional()
});

export type CinemaCatalogDto = z.infer<typeof CinemaCatalogSchema>;
export type CinemaFiltersDto = z.infer<typeof CinemaFiltersSchema>;
export type CinemaCreationDto = z.infer<typeof CinemaCreationSchema>;
export type CinemaEditDto = z.infer<typeof CinemaEditSchema>;
export type CinemaDeletionDto = z.infer<typeof CinemaDeletionSchema>;
export type CinemaResponseDto = z.infer<typeof CinemaResponseSchema>;