export interface Movie {
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

export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieCollection {
  id: string;
  title: string;
  description: string;
  movies: Movie[];
  createdDate: Date;
} 