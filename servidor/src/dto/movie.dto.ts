import { z } from 'zod';

// DTO para los filtros de findMovies
export const MovieFiltersSchema = z.object({
  id: z.number().int().optional(),
  sessionBefore: z.date().optional(),
  sessionAfter: z.date().optional(),
  cast: z.array(z.string()).optional()
}).strict();//strict para no aceptar mas parametros en el body

//DTO para crear nuevas movies
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

export const MovieDeletionSchema = z.object({
  id: z.number().int()
}).strict();

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