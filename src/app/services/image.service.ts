import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  TMDB_IMAGE_BASE_URL, 
  DEFAULT_POSTER_FALLBACK,
  PosterSize,
  BackdropSize,
  POSTER_SIZES,
  BACKDROP_SIZES
} from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  getPosterUrl(posterPath: string | null, size: PosterSize = POSTER_SIZES.w500): Observable<string> {
    return of(posterPath).pipe(
      map(path => {
        if (!path) {
          return DEFAULT_POSTER_FALLBACK;
        }
        return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
      }),
      catchError(() => of(DEFAULT_POSTER_FALLBACK))
    );
  }

  getBackdropUrl(backdropPath: string | null, size: BackdropSize = BACKDROP_SIZES.w1280): Observable<string> {
    return of(backdropPath).pipe(
      map(path => {
        if (!path) {
          return DEFAULT_POSTER_FALLBACK;
        }
        return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
      }),
      catchError(() => of(DEFAULT_POSTER_FALLBACK))
    );
  }

  getPosterUrlSync(posterPath: string | null, size: PosterSize = POSTER_SIZES.w500): string {
    if (!posterPath) {
      return DEFAULT_POSTER_FALLBACK;
    }
    return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
  }

  getBackdropUrlSync(backdropPath: string | null, size: BackdropSize = BACKDROP_SIZES.w1280): string {
    if (!backdropPath) {
      return DEFAULT_POSTER_FALLBACK;
    }
    return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
  }
} 