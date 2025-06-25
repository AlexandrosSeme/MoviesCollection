import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  loading = true;
  rating = 0;
  sessionId: string | null = null;
  ratingSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movieId: number },
    private dialogRef: MatDialogRef<MovieDetailsComponent>,
    private movieService: MovieService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadMovieDetails();
    this.getGuestSession();
  }

  private loadMovieDetails(): void {
    this.movieService.getMovieDetails(this.data.movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movie details:', error);
        this.snackBar.open('Error loading movie details', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  private getGuestSession(): void {
    this.movieService.getGuestSessionId().subscribe({
      next: (response) => {
        this.sessionId = response.guest_session_id;
      },
      error: (error) => {
        console.error('Error getting guest session:', error);
      }
    });
  }

  onRatingChange(rating: number): void {
    this.rating = rating;
  }

  submitRating(): void {
    if (!this.sessionId || !this.movie) {
      this.snackBar.open('Unable to submit rating', 'Close', { duration: 3000 });
      return;
    }

    this.movieService.rateMovie(this.movie.id, this.rating, this.sessionId).subscribe({
      next: () => {
        this.ratingSubmitted = true;
        this.snackBar.open('Rating submitted successfully!', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error submitting rating:', error);
        this.snackBar.open('Error submitting rating', 'Close', { duration: 3000 });
      }
    });
  }

  formatCurrency(amount: number): string {
    if (amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getImageUrl(posterPath: string): string {
    return this.movieService.getImageUrl(posterPath);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/no-poster.jpg';
  }

  getSpokenLanguages(): string {
    if (!this.movie?.spoken_languages || this.movie.spoken_languages.length === 0) {
      return 'N/A';
    }
    return this.movie.spoken_languages.map(lang => lang.name).join(', ');
  }

  close(): void {
    this.dialogRef.close();
  }
} 