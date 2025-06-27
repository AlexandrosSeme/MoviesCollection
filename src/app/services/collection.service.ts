import { Injectable } from '@angular/core';
import { MovieCollection, LegacyMovie } from '../models/movie.model';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private readonly STORAGE_KEY = 'movie_collections';
  private collectionsSubject = new BehaviorSubject<MovieCollection[]>([]);
  public collections$ = this.collectionsSubject.asObservable();

  constructor() {
    this.loadCollections();
  }

  private loadCollections(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      of(stored).pipe(
        map(storedData => {
          const collections = JSON.parse(storedData);
          return collections.map((collection: Partial<MovieCollection>) => ({
            ...collection,
            createdDate: new Date(collection.createdDate || new Date())
          }));
        }),
        catchError(error => {
          console.error('Error loading collections from localStorage:', error);
          return of([]);
        })
      ).subscribe(collections => {
        this.collectionsSubject.next(collections);
      });
    } else {
      this.collectionsSubject.next([]);
    }
  }

  private saveCollections(collections: MovieCollection[]): Observable<MovieCollection[]> {
    return of(collections).pipe(
      tap(collections => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collections));
        this.collectionsSubject.next(collections);
      }),
      catchError(error => {
        console.error('Error saving collections to localStorage:', error);
        return throwError(() => new Error('Failed to save collections'));
      })
    );
  }

  getCollections(): MovieCollection[] {
    return this.collectionsSubject.value;
  }

  createCollection(title: string, description: string): Observable<MovieCollection> {
    const newCollection: MovieCollection = {
      id: Date.now().toString(),
      title,
      description,
      movies: [],
      createdDate: new Date()
    };
    const collections = [...this.getCollections(), newCollection];    
    return this.saveCollections(collections).pipe(
      map(() => newCollection),
      catchError(error => {
        console.error('Error creating collection:', error);
        return throwError(() => new Error('Failed to create collection'));
      })
    );
  }

  updateCollection(collectionId: string, title: string, description: string): Observable<void> {
    const collections = this.getCollections();
    const collectionIndex = collections.findIndex(c => c.id === collectionId);    
    if (collectionIndex === -1) {
      return throwError(() => new Error('Collection not found'));
    }
    collections[collectionIndex].title = title;
    collections[collectionIndex].description = description;    
    return this.saveCollections(collections).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Error updating collection:', error);
        return throwError(() => new Error('Failed to update collection'));
      })
    );
  }

  addMoviesToCollection(collectionId: string, movies: LegacyMovie[]): Observable<void> {
    const collections = this.getCollections();
    const collectionIndex = collections.findIndex(c => c.id === collectionId);    
    if (collectionIndex === -1) {
      return throwError(() => new Error('Collection not found'));
    }
    const existingMovieIds = collections[collectionIndex].movies.map(m => m.id);
    const newMovies = movies.filter(movie => !existingMovieIds.includes(movie.id));
    collections[collectionIndex].movies = [...collections[collectionIndex].movies, ...newMovies];    
    return this.saveCollections(collections).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Error adding movies to collection:', error);
        return throwError(() => new Error('Failed to add movies to collection'));
      })
    );
  }

  removeMovieFromCollection(collectionId: string, movieId: number): Observable<void> {
    const collections = this.getCollections();
    const collectionIndex = collections.findIndex(c => c.id === collectionId);    
    if (collectionIndex === -1) {
      return throwError(() => new Error('Collection not found'));
    }
    collections[collectionIndex].movies = collections[collectionIndex].movies.filter(m => m.id !== movieId);    
    return this.saveCollections(collections).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Error removing movie from collection:', error);
        return throwError(() => new Error('Failed to remove movie from collection'));
      })
    );
  }

  deleteCollection(collectionId: string): Observable<void> {
    const collections = this.getCollections().filter(c => c.id !== collectionId);    
    return this.saveCollections(collections).pipe(
      map(() => void 0),
      catchError(error => {
        console.error('Error deleting collection:', error);
        return throwError(() => new Error('Failed to delete collection'));
      })
    );
  }

  getCollectionById(collectionId: string): MovieCollection | undefined {
    return this.getCollections().find(c => c.id === collectionId);
  }

  getCollectionById$(collectionId: string): Observable<MovieCollection> {
    return this.collections$.pipe(
      map(collections => collections.find(c => c.id === collectionId)),
      map(collection => {
        if (collection) {
          return collection;
        } else {
          throw new Error('Collection not found');
        }
      }),
      catchError(error => {
        console.error('Error getting collection by ID:', error);
        return throwError(() => new Error('Collection not found'));
      })
    );
  }
} 