import { prisma } from '../lib/db';
import type { CinemaCreationDto, CinemaDeletionDto, CinemaEditDto, CinemaFiltersDto, CinemaResponseDto } from '../dto/cinema.dto';
import moment from 'moment';


const getCinemas = async (filters: CinemaFiltersDto): Promise<CinemaResponseDto[]> => {
  const { id, sessionBefore, sessionAfter, withMovie, withCatalog } = filters;

  const dateGte: Date | undefined = sessionAfter ? new Date(sessionAfter) : undefined;
  const dateLte = sessionBefore ? new Date(sessionBefore) : undefined;

  const theaters = await prisma.theater.findMany({
    where: {
      id: filters.id,
      ...( (dateGte || dateLte || withMovie) && {
        showTimings: {
          some: {
            ...(dateGte || dateLte ? { day: { gte: dateGte, lte: dateLte } } : {}),
            ...(withMovie ? { movie_id: withMovie } : {})
          }
        }
      })
    },
    include: {
      showTimings: withCatalog ? {
        where: {
          ...(dateGte || dateLte ? { day: { gte: dateGte, lte: dateLte } } : {}),
          ...(withMovie ? { movie_id: withMovie } : {})
        },
        include: {
          movie: true,
          timing: true
        }
      } : undefined
    }
  });

  return theaters.map((theater:any) => {
    const response: CinemaResponseDto = {
      id: theater.id,
      name: theater.name,
      capacity: theater.capacity
    };

    if (withCatalog && theater.showTimings) {
      const movieMap: Map<number, any> = new Map<number, any>();

      theater.showTimings.forEach((st: any) => {
        if (!movieMap.has(st.movie_id)) {
          movieMap.set(st.movie_id, {
            id: st.movie.id,
            title: st.movie.name,
            sessions: []
          });
        }
        
        movieMap.get(st.movie_id).sessions.push({
          date: moment(st.day).format('DD/MM/YYYY'),
          start: st.timing.start_time,
          end: st.timing.end_time
        });
      });

      response.catalog = Array.from(movieMap.values());
    }

    return response;
  });
};

const createCinema = async (data: CinemaCreationDto): Promise<CinemaResponseDto> => {
  const cinema = await prisma.theater.create({
    data: {
      name: data.name,
      capacity: data.capacity
    }
  });

  return {
    id: cinema.id,
    name: cinema.name,
    capacity: cinema.capacity
  };
}

const editCinema = async (data: CinemaEditDto): Promise<CinemaResponseDto> => {
  const exists = await prisma.theater.findUnique({ where: {id: data.id}});
  if(!exists){
    throw new Error('NOT_FOUND');
  }

  const updateData: any = {}
  if(data.name) updateData.name = data.name;
  if(data.capacity) updateData.capacity = data.capacity;
  if(data.catalog) updateData.catalog = data.catalog;

  const cinema = await prisma.theater.update({
    where: {id: data.id},
    data: updateData
  });

  return {
    id: cinema.id,
    name: cinema.name,
    capacity: cinema.capacity
  }
}

const deleteCinema = async (data: CinemaDeletionDto): Promise<void> => {
  const exists = await prisma.theater.findUnique({ where: {id: data.id}});
  if(!exists){
    throw new Error('NOT_FOUND');
  }

  await prisma.theater.delete({ where: {id: data.id}});
}

export const CinemaService = {
  getCinemas,
  createCinema,
  editCinema,
  deleteCinema
};