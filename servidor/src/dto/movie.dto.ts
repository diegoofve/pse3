import { z } from 'zod';

/**
 * @swagger
 * components:
 *   schemas:
 *     MovieFiltersDto:
 *       type: object
 *       additionalProperties: false
 *       properties:
 *         id:
 *           type: integer
 *           example: 4
 *         sessionBefore:
 *           type: string
 *           format: date-time
 *           example: "2026-01-01T00:00:00.000Z"
 *         sessionAfter:
 *           type: string
 *           format: date-time
 *           example: "2026-01-01T00:00:00.000Z"
 *         cast:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Leonardo DiCaprio", "Tom Hardy"]
 */
export const MovieFiltersSchema = z.object({
  id: z.number().int().optional(),
  sessionBefore: z.date().optional(),
  sessionAfter: z.date().optional(),
  cast: z.array(z.string()).optional()
}).strict();//strict para no aceptar mas parametros en el body

/**
 * @swagger
 * components:
 *   schemas:
 *     MovieCreationDto:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - title
 *         - cast
 *         - sessions
 *       properties:
 *         title:
 *           type: string
 *           example: "Inception"
 *         cast:
 *           type: string
 *           example: "Leonardo DiCaprio, Tom Hardy"
 *         sessions:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - cinema
 *               - day
 *               - start
 *               - end
 *             properties:
 *               cinema:
 *                 type: string
 *                 example: "Cines Luz"
 *               day:
 *                 type: string
 *                 example: "2026-05-12"
 *               start:
 *                 type: string
 *                 example: "18:00"
 *               end:
 *                 type: string
 *                 example: "20:30"
 */
export const MovieCreationSchema = z.object({
  title: z.string(),
  cast: z.string(),
  sessions: z.array(z.object({
    cinema: z.string(),
    day: z.string(),
    start: z.string(),
    end: z.string()
  }))
}).strict();

/**
 * @swagger
 * components:
 *   schemas:
 *     MovieEditDto:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Interstellar"
 *         cast:
 *           type: string
 *           example: "Matthew McConaughey, Anne Hathaway"
 *         sessions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cinema:
 *                 type: string
 *               day:
 *                 type: string
 *               start:
 *                 type: string
 *               end:
 *                 type: string
 */
export const MovieEditSchema = z.object({
  id: z.number().int(),
  title: z.string().optional(),
  cast: z.string().optional(),
  sessions: z.array(z.object({
    cinema: z.string(),
    day: z.string(),
    start: z.string(),
    end: z.string()
  })).optional()
}).strict();

/**
 * @swagger
 * components:
 *   schemas:
 *     MovieDeletionDto:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 */
export const MovieDeletionSchema = z.object({
  id: z.number().int()
}).strict();

/**
 * @swagger
 * components:
 *   schemas:
 *     MovieResponseDto:
 *       type: object
 *       additionalProperties: false
 *       required:
 *         - id
 *         - title
 *         - cast
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Inception"
 *         cast:
 *           type: string
 *           example: "Leonardo DiCaprio, Tom Hardy"
 *         sessions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               cinema:
 *                 type: string
 *               day:
 *                 type: string
 *               start:
 *                 type: string
 *               end:
 *                 type: string
 */
export const MovieResponseSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  cast: z.string(),
  sessions: z.array(z.object({
    cinema: z.string(),
    day: z.string(),
    start: z.string(),
    end: z.string()
  })).optional()
}).strict();

export type MovieFiltersDto = z.infer<typeof MovieFiltersSchema>;
export type MovieCreationDto = z.infer<typeof MovieCreationSchema>;
export type MovieEditDto = z.infer<typeof MovieEditSchema>;
export type MovieDeletionDto = z.infer<typeof MovieDeletionSchema>;
export type MovieResponseDto = z.infer<typeof MovieResponseSchema>;