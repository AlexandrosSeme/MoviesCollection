import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MovieService } from '../../services/movie.service';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { UiService } from '../../shared/services/ui.service';
import { Movie } from '../../models/movie.model';
import { AddToCollectionDialogComponent } from '../add-to-collection-dialog/add-to-collection-dialog.component';

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
  searchHistory: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private movieService: MovieService,
    private userPreferencesService: UserPreferencesService,
    private uiService: UiService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadPopularMovies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPopularMovies(): void {
    this.loading = true;
    this.movieService.getPopularMovies(1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response && response.results) {
            this.movies = response.results;
            this.currentPage = 1;
            this.totalPages = 3;
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error loading popular movies:', error);
          this.uiService.showError('Error loading movies');
        }
      });
  }

  onSearch(searchTerm?: string, page?: number): void {
    this.loading = true;
    const searchPage = page || 1;
    const termToSearch = searchTerm || this.searchTerm;
    this.userPreferencesService.setLastSearchTerm(termToSearch);
    this.movieService.searchMovies(termToSearch, searchPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          if (response && response.results) {
            this.movies = response.results;
            this.currentPage = response.page;
            this.totalPages = 3;

            this.userPreferencesService.addToSearchHistory(termToSearch, response.total_results);
            this.searchHistory = this.userPreferencesService.getPreferences().searchHistory;
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Search error:', error);
          this.uiService.showError('Error searching movies');
        }
      });
  }

  onPageChange(page: number): void {
    if (page > 3) return;

    if (this.searchTerm) {
      this.onSearch(this.searchTerm, page);
    } else {
      this.loading = true;
      this.movieService.getPopularMovies(page)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.loading = false;
            this.movies = response.results;
            this.currentPage = response.page;
            this.totalPages = 3;
          },
          error: (error) => {
            this.loading = false;
            console.error('Page change error:', error);
            this.uiService.showError('Error loading page');
          }
        });
    }
  }

  onSearchFromHistory(term: string): void {
    this.searchTerm = term;
    this.onSearch(term, 1);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedMovies = [];
    this.loadPopularMovies();
    this.userPreferencesService.setLastSearchTerm('');
  }

  clearSearchHistory(): void {
    this.userPreferencesService.clearSearchHistory();
    this.searchHistory = [];
    this.uiService.showInfo('Search history cleared');
  }

  removeFromSearchHistory(term: string): void {
    this.userPreferencesService.removeFromSearchHistory(term);
    this.searchHistory = this.userPreferencesService.getPreferences().searchHistory;
    this.uiService.showInfo('Removed from search history');
  }

  toggleMovieSelection(movie: Movie): void {
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

  openAddToCollectionDialog(): void {
    if (this.selectedMovies.length === 0) {
      this.uiService.showWarning('Please select movies first');
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

  openMovieDetails(movie: Movie): void {
    console.log('Opening movie details for:', movie.title);
  }
} 