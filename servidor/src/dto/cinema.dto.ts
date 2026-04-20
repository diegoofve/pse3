import z from 'zod';

export const CinemaCatalogSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  sessions: z.array(z.object({
    date: z.string(),
    start: z.string(),
    end: z.string()
  }))
});

export const CinemaFiltersSchema = z.object({
  id: z.coerce.number().int().optional(),
  sessionBefore: z.coerce.date().optional(),
  sessionAfter: z.coerce.date().optional(),
  withMovie: z.coerce.number().int().optional(),
  withCatalog: z.coerce.boolean().optional()
}).strict(); //strict para no aceptar mas parametros en el body

//DTO para crear nuevos cinemas
export const CinemaCreationSchema = z.object({
  name: z.string(),
  capacity: z.number().int(),
  catalog: z.array(CinemaCatalogSchema).optional() 
}).strict();

//DTO para editar cinemas existentes
export const CinemaEditSchema = z.object({
  id: z.number().int(),
  name: z.string().optional(),
  capacity: z.number().int().optional(),
  catalog: z.array(CinemaCatalogSchema).optional()
}).strict();

export const CinemaDeletionSchema = z.object({
  id: z.number().int()
}).strict();

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