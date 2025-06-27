import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { AddToCollectionDialogComponent } from '../add-to-collection-dialog/add-to-collection-dialog.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { AlertsService } from '../../shared/components/alerts/alerts.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  movies: Movie[] = [];
  selectedMovies: Movie[] = [];
  currentPage = 1;
  totalPages = 0;
  loading = false;
  isSearchValid: boolean = false;
  hasSearched: boolean = false;
  isSearching: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private movieService: MovieService,
    private dialog: MatDialog,
    private alerts: AlertsService
  ) { }

  ngOnInit() {
    this.loadPopularMovies();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPopularMovies() {
    if (this.loading) return;    
    this.loading = true;
    this.movieService.getPopularMovies(1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response && response.results) {
            this.movies = response.results;
            this.currentPage = response.page;
            this.totalPages = Math.min(response.total_pages, 3);
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error loading popular movies:', error);
        }
      });
  }

  onSearch(searchTerm?: string, page?: number) {
    if (this.isSearching) {
      return;
    }
    const termToSearch = searchTerm || this.searchTerm;
    this.hasSearched = true;
    if (!this.isSearchValid) {
      return;
    }
    this.isSearching = true;
    this.loading = true;
    const searchPage = page || 1;
    
    this.movieService.searchMovies(termToSearch, searchPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.isSearching = false;
          if (response && response.results) {
            this.movies = response.results;
            this.currentPage = response.page;
            this.totalPages = Math.min(response.total_pages, 3);
          }
        },
        error: (error) => {
          this.loading = false;
          this.isSearching = false;
          console.error('Search error:', error);
          this.alerts.error('Error searching movies');
        }
      });
  }

  onPageChange(page: number) {
    if (page > 3) return;
    if (this.searchTerm && this.searchTerm.trim().length > 0) {
      this.onSearch(this.searchTerm, page);
    } else {
      this.loadPopularMovies();
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.selectedMovies = [];
    this.hasSearched = false;
    this.isSearching = false;
    this.loadPopularMovies();
  }

  toggleMovieSelection(movie: Movie) {
    const index = this.selectedMovies.findIndex(m => m.id === movie.id);
    if (index > -1) {
      this.selectedMovies.splice(index, 1);
    } else {
      this.selectedMovies.push(movie);
    }
  }

  isMovieSelected(movie: Movie): boolean {
    return this.selectedMovies.some(m => m.id === movie.id);
  }

  openAddToCollectionDialog() {
    if (this.selectedMovies.length === 0) {
      this.alerts.info('Please select movies first');
      return;
    }
    const dialogRef = this.dialog.open(AddToCollectionDialogComponent, {
      width: '500px',
      data: { movies: this.selectedMovies },
      disableClose: true
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.selectedMovies = [];
        }
      });
  }

  openMovieDetails(movie: Movie) {
    const dialogRef = this.dialog.open(MovieDetailsComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { movieId: movie.id },
      disableClose: false
    });
  }
} 