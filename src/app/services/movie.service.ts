import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import {
  LegacyMovie,
  Movie,
  MovieDetails,
  MovieSearchResponse,
  PopularMoviesResponse,
  MovieRatingResponse
} from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})

export class MovieService {
  private readonly API_KEY = environment.tmdbApiKey;
  private readonly BASE_URL = environment.tmdbBaseUrl;

  constructor(private http: HttpClient) { }

  searchMovies(query: string, page: number = 1): Observable<MovieSearchResponse> {
    if (!query || query.trim().length === 0) {
      return of({
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0
      });
    }

    const url = `${this.BASE_URL}/search/movie`;
    let params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('query', query.trim())
      .set('page', page.toString())
      .set('include_adult', 'false')
      .set('language', 'en-US');

    return this.http.get<MovieSearchResponse>(url, { params }).pipe(
      catchError(error => {
        console.error('Search failed:', error);
        if (error.name === 'TimeoutError') {
          return throwError(() => new Error('Search request timed out'));
        }
        return throwError(() => new Error('Search failed'));
      })
    );
  }

  getPopularMovies(page: number = 1): Observable<PopularMoviesResponse> {
    const url = `${this.BASE_URL}/movie/popular`;
    let params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('page', page.toString())
      .set('language', 'en-US');

    return this.http.get<PopularMoviesResponse>(url, { params }).pipe(
      catchError(error => {
        console.error('Failed to get popular movies:', error);
        if (error.name === 'TimeoutError') {
          return throwError(() => new Error('Request timed out'));
        }
        return throwError(() => new Error('Failed to get popular movies'));
      })
    );
  }

  getMovieDetails(movieId: number): Observable<MovieDetails> {
    const url = `${this.BASE_URL}/movie/${movieId}`;
    let params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('language', 'en-US')
      .set('append_to_response', 'credits,videos,images');

    return this.http.get<MovieDetails>(url, { params }).pipe(
      catchError(error => {
        console.error('Failed to get movie details:', error);
        if (error.name === 'TimeoutError') {
          return throwError(() => new Error('Request timed out'));
        }
        return throwError(() => new Error('Failed to get movie details'));
      })
    );
  }

  getGuestSessionId(): Observable<{ guest_session_id: string }> {
    const url = `${this.BASE_URL}/authentication/guest_session/new`;
    let params = new HttpParams()
      .set('api_key', this.API_KEY);

    return this.http.get<{ guest_session_id: string }>(url, { params }).pipe(
      catchError(error => {
        console.error('Failed to get guest session:', error);
        if (error.name === 'TimeoutError') {
          return throwError(() => new Error('Request timed out'));
        }
        return throwError(() => new Error('Failed to get guest session'));
      })
    );
  }

  rateMovie(movieId: number, rating: number, sessionId: string): Observable<MovieRatingResponse> {
    const url = `${this.BASE_URL}/movie/${movieId}/rating`;
    let params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('guest_session_id', sessionId);

    return this.http.post<MovieRatingResponse>(url, { value: rating }, { params }).pipe(
      catchError(error => {
        console.error('Failed to rate movie:', error);
        if (error.name === 'TimeoutError') {
          return throwError(() => new Error('Request timed out'));
        }
        return throwError(() => new Error('Failed to rate movie'));
      })
    );
  }
} 