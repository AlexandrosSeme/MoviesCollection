import { Injectable } from '@angular/core';
import { MovieCollection, Movie } from '../models/movie.model';
import { BehaviorSubject, Observable } from 'rxjs';

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
      try {
        const collections = JSON.parse(stored);
        // Convert date strings back to Date objects
        const collectionsWithDates = collections.map((collection: any) => ({
          ...collection,
          createdDate: new Date(collection.createdDate)
        }));
        this.collectionsSubject.next(collectionsWithDates);
      } catch (error) {
        console.error('Error loading collections from localStorage:', error);
        this.collectionsSubject.next([]);
      }
    } else {
      this.collectionsSubject.next([]);
    }
  }

  private saveCollections(collections: MovieCollection[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collections));
    this.collectionsSubject.next(collections);
  }

  getCollections(): MovieCollection[] {
    return this.collectionsSubject.value;
  }

  createCollection(title: string, description: string): MovieCollection {
    const newCollection: MovieCollection = {
      id: Date.now().toString(),
      title,
      description,
      movies: [],
      createdDate: new Date()
    };

    const collections = [...this.getCollections(), newCollection];
    this.saveCollections(collections);
    return newCollection;
  }

  updateCollection(collectionId: string, title: string, description: string): void {
    const collections = this.getCollections();
    const collectionIndex = collections.findIndex(c => c.id === collectionId);
    
    if (collectionIndex !== -1) {
      collections[collectionIndex].title = title;
      collections[collectionIndex].description = description;
      this.saveCollections(collections);
    }
  }

  addMoviesToCollection(collectionId: string, movies: Movie[]): void {
    const collections = this.getCollections();
    const collectionIndex = collections.findIndex(c => c.id === collectionId);
    
    if (collectionIndex !== -1) {
      const existingMovieIds = collections[collectionIndex].movies.map(m => m.id);
      const newMovies = movies.filter(movie => !existingMovieIds.includes(movie.id));
      collections[collectionIndex].movies = [...collections[collectionIndex].movies, ...newMovies];
      this.saveCollections(collections);
    }
  }

  removeMovieFromCollection(collectionId: string, movieId: number): void {
    const collections = this.getCollections();
    const collectionIndex = collections.findIndex(c => c.id === collectionId);
    
    if (collectionIndex !== -1) {
      collections[collectionIndex].movies = collections[collectionIndex].movies.filter(m => m.id !== movieId);
      this.saveCollections(collections);
    }
  }

  deleteCollection(collectionId: string): void {
    const collections = this.getCollections().filter(c => c.id !== collectionId);
    this.saveCollections(collections);
  }

  getCollectionById(collectionId: string): MovieCollection | undefined {
    return this.getCollections().find(c => c.id === collectionId);
  }

  getCollectionById$(collectionId: string): Observable<MovieCollection> {
    return new Observable(observer => {
      const collection = this.getCollectionById(collectionId);
      if (collection) {
        observer.next(collection);
        observer.complete();
      } else {
        observer.error('Collection not found');
      }
    });
  }
} 