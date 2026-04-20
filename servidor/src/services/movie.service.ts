import { prisma } from '../lib/db';
import type { MovieCreationDto, MovieDeletionDto, MovieEditDto, MovieFiltersDto, MovieResponseDto } from '../dto/movie.dto';
import moment from 'moment';

/**
 * Lógica de negocio de películas
 */

// Obtención de películas
const getMovies = async(filters: MovieFiltersDto): Promise<MovieResponseDto[]> => {
  const { id, sessionBefore, sessionAfter, cast } = filters;

  // No se especifica el tipo de "movies" para que se produzca la inferencia automática
  const movies = await prisma.movie.findMany({
    where: {
      id: id,
      // Filtramos por las fechas dentro de la tabla intermedia
      showTimings: (sessionBefore || sessionAfter) ? {
        some: {
          day: {
            gte: sessionAfter,
            lte: sessionBefore,
          }
        }
      } : undefined
    },
    include: {
      showTimings: {
        include: {
          theater: true, // Para sacar el nombre del cine
          timing: true   // Para sacar las horas
        }
      }
    }
  });

  // Mapeamos el resultado para que coincida con nuestro DTO de respuesta
  let results: MovieResponseDto[] = movies.map((movie:any) => ({
    id: movie.id,
    title: movie.name,
    cast: movie.actors,
    sessions: movie.showTimings && movie.showTimings.length > 0 ? movie.showTimings.map((st:any) => ({
      cinema: st.theater.name,
      day: moment(st.day).format('DD/MM/YYYY'),
      start: st.timing.start_time,
      end: st.timing.end_time
    })) : undefined
  }));

  // Filtrado a posteriori por el reparto
  if (cast && cast.length > 0) {
    results = results.filter(movie => {
      const movieActors = movie.cast.split(',').map(a => a.trim());
      return cast.every((a: string) => movieActors.includes(a));
    });
  }

  // Devolución de resultados mapeados
  return results;
}

const createMovie = async (data: MovieCreationDto): Promise<MovieResponseDto> => {
  //validar timeslots lo primero (si no la peli se crearia con timeslots vacios)
  const timeslots = [];
  for (const session of data.sessions) {
    const timeslot = await prisma.timeslot.findFirst({
      where: {
        start_time: session.start,
        end_time:   session.end
      }
    });
    
    if (!timeslot){
      throw new Error('TIMESLOT_NOT_FOUND');
    }

    timeslots.push({ session, timeslot });
  }
  
  const movie = await prisma.movie.create({
    data: {
      name: data.title,
      actors: data.cast
    }
  });

  for (const { session, timeslot } of timeslots) {
    await prisma.showTiming.create({
      data: {
        day: new Date(session.day),
        movie_id: movie.id,
        theater_id: Number(session.cinema),
        timing_id: timeslot.id
      }
    });
  }

  const created = await prisma.movie.findUnique({
    where: { id: movie.id },
    include: {
      showTimings: {
        include: {
          theater: true,
          timing: true
        }
      }
    }
  });

  return {
    id: created!.id,
    title: created!.name,
    cast: created!.actors,
    sessions: created!.showTimings.map((st: any) => ({
      cinema: st.theater.name,
      day: moment(st.day).format('YYYY-MM-DD'),
      start: st.timing.start_time,
      end: st.timing.end_time
    }))
  };
}

const editMovie = async (data: MovieEditDto): Promise<MovieResponseDto> => {
  const exists = await prisma.movie.findUnique({ where: { id: data.id } });
  if (!exists){
    throw new Error('NOT_FOUND');
  }

  const updateData: any = {};
  if (data.title) updateData.name = data.title;
  if (data.cast) updateData.actors = data.cast;

  await prisma.movie.update({
    where: { id: data.id },
    data: updateData
  });

  //si no se manda campo de sesiones no se tocan. Si esta vacio se borran todas
  if (data.sessions !== undefined) {
    //borrar las sesiones previas
    await prisma.showTiming.deleteMany({ where: { movie_id: data.id } });

    for (const session of data.sessions) {
      let timeslot = await prisma.timeslot.findFirst({
        where: {
          start_time: session.start,
          end_time: session.end
        }
      });

      if (!timeslot) throw new Error('TIMESLOT_NOT_FOUND');

      await prisma.showTiming.create({
        data: {
          day: new Date(session.day),
          movie_id: data.id,
          theater_id: Number(session.cinema),
          timing_id: timeslot.id
        }
      });
    }
  }

  const updated = await prisma.movie.findUnique({
    where: { id: data.id },
    include: {
      showTimings: {
        include: {
          theater: true,
          timing: true
        }
      }
    }
  });

  return {
    id: updated!.id,
    title: updated!.name,
    cast: updated!.actors,
    sessions: updated!.showTimings.map((st: any) => ({
      cinema: st.theater.name,
      day: moment(st.day).format('YYYY-MM-DD'),
      start: st.timing.start_time,
      end: st.timing.end_time
    }))
  };
}

const deleteMovie = async (data: MovieDeletionDto): Promise<void> => {
  const exists = await prisma.movie.findUnique({ where: { id: data.id } });
  if (!exists){
    throw new Error('NOT_FOUND');
  }

  //borrar primero las sesiones asociadas por la fk
  await prisma.showTiming.deleteMany({ where: { movie_id: data.id } });
  await prisma.movie.delete({ where: { id: data.id } });
}


export const MovieService = {
  getMovies,
  createMovie,
  editMovie,
  deleteMovie
}