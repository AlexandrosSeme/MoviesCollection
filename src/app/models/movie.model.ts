export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MovieDetails extends Movie {
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  genres: Array<{ id: number; name: string }>;
  homepage: string | null;
  imdb_id: string | null;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  revenue: number;
  runtime: number | null;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string | null;
}

export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface PopularMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface LegacyMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  budget: number;
  release_date: string;
  revenue: number;
  vote_average: number;
  vote_count: number;
  spoken_languages: Array<{ name: string; iso_639_1: string }>;
}

export interface LegacyMovieSearchResponse {
  page: number;
  results: LegacyMovie[];
  total_pages: number;
  total_results: number;
}

export interface MovieCollection {
  id: string;
  title: string;
  description: string;
  movies: LegacyMovie[];
  createdDate: Date;
}

export function convertMovieToLegacy(movie: Movie): LegacyMovie {
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path || '',
    budget: 0,
    release_date: movie.release_date,
    revenue: 0,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    spoken_languages: []
  };
}

export interface CreateCollectionDialogData {
  isEditing?: boolean;
  collection?: {
    id: string;
    title: string;
    description: string;
  };
}

export interface MovieRatingResponse {
  status_code: number;
  status_message: string;
}

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const DEFAULT_POSTER_FALLBACK = 'assets/no-poster.jpg';

export const POSTER_SIZES = {
  w92: 'w92',
  w154: 'w154', 
  w185: 'w185',
  w342: 'w342',
  w500: 'w500',
  w780: 'w780',
  original: 'original'
} as const;

export const BACKDROP_SIZES = {
  w300: 'w300',
  w780: 'w780',
  w1280: 'w1280',
  original: 'original'
} as const;

export type PosterSize = typeof POSTER_SIZES[keyof typeof POSTER_SIZES];
export type BackdropSize = typeof BACKDROP_SIZES[keyof typeof BACKDROP_SIZES]; 