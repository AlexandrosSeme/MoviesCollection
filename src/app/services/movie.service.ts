import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { BaseService } from '../shared/services/base.service';
import { Movie, MovieSearchResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService extends BaseService {
  private readonly API_KEY = '85204a8cc33baf447559fb6d51b18313';
  private readonly BASE_URL = 'https://api.themoviedb.org/3';
  private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  constructor(private http: HttpClient) {
    super();
  }

  private getCacheKey(type: string, query: string, page: number): string {
    return `movie_cache_${type}_${query}_${page}`;
  }

  private getCachedData(key: string): any {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const data = JSON.parse(cached);
        const now = Date.now();
        if (now - data.timestamp < this.CACHE_DURATION) {
          this.logOperation('Cache hit', key);
          return data.data;
        } else {
          localStorage.removeItem(key);
          this.logOperation('Cache expired', key);
        }
      }
    } catch (error) {
      this.logError('Cache read error', error);
      localStorage.removeItem(key);
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    try {
      const cacheData = {
        data: data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
      this.logOperation('Cache set', key);
    } catch (error) {
      this.logError('Cache write error', error);
    }
  }

  searchMovies(query: string | undefined, page: number | undefined): Observable<any> {
    if (!query || !page) {
      return of({ results: [], page: 1, total_pages: 0, total_results: 0 });
    }

    this.logOperation('Search movies', { query, page });

    const cacheKey = this.getCacheKey('search', query, page);
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<any>(`${this.BASE_URL}/search/movie`, {
      params: {
        api_key: this.API_KEY,
        query: query,
        page: page.toString()
      }
    }).pipe(
      tap(response => this.setCachedData(cacheKey, response)),
      catchError(this.handleError('searchMovies'))
    );
  }

  getPopularMovies(page: number = 1): Observable<MovieSearchResponse> {
    this.logOperation('Get popular movies', { page });

    const cacheKey = this.getCacheKey('popular', 'popular', page);
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<MovieSearchResponse>(`${this.BASE_URL}/movie/popular`, {
      params: {
        api_key: this.API_KEY,
        page: page.toString()
      }
    }).pipe(
      tap(response => this.setCachedData(cacheKey, response)),
      catchError(this.handleError<MovieSearchResponse>('getPopularMovies'))
    );
  }

  getMovieDetails(movieId: number): Observable<Movie> {
    this.logOperation('Get movie details', { movieId });

    const cacheKey = this.getCacheKey('details', movieId.toString(), 1);
    const cachedData = this.getCachedData(cacheKey);
    
    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<Movie>(`${this.BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: this.API_KEY
      }
    }).pipe(
      tap(response => this.setCachedData(cacheKey, response)),
      catchError(this.handleError<Movie>('getMovieDetails'))
    );
  }

  getGuestSessionId(): Observable<{ guest_session_id: string }> {
    this.logOperation('Get guest session ID');

    return this.http.get<{ guest_session_id: string }>(`${this.BASE_URL}/authentication/guest_session/new`, {
      params: {
        api_key: this.API_KEY
      }
    }).pipe(
      catchError(this.handleError<{ guest_session_id: string }>('getGuestSessionId'))
    );
  }

  rateMovie(movieId: number, rating: number, sessionId: string): Observable<any> {
    this.logOperation('Rate movie', { movieId, rating });

    return this.http.post(`${this.BASE_URL}/movie/${movieId}/rating`, {
      value: rating
    }, {
      params: {
        api_key: this.API_KEY,
        guest_session_id: sessionId
      }
    }).pipe(
      catchError(this.handleError('rateMovie'))
    );
  }

  getImageUrl(posterPath: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!posterPath) {
      return 'assets/no-poster.jpg';
    }
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  }

  clearCache(): void {
    this.logOperation('Clear cache');
    const keys = Object.keys(localStorage);
    let clearedCount = 0;
    
    keys.forEach(key => {
      if (key.startsWith('movie_cache_')) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });
    
    this.logOperation('Cache cleared', { clearedCount });
  }

  getCacheStats(): { totalItems: number; totalSize: number } {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('movie_cache_'));
    let totalSize = 0;
    
    keys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    });

    const stats = {
      totalItems: keys.length,
      totalSize: totalSize
    };
    
    this.logOperation('Cache stats', stats);
    return stats;
  }
} 