import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovieService } from '../../services/movie.service';
import { ImageService } from '../../services/image.service';
import { AlertsService } from '../../shared/components/alerts/alerts.service';
import { Movie, MovieDetails } from '../../models/movie.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movie: MovieDetails | null = null;
  loading = true;
  rating = 0;
  sessionId: string | null = null;
  ratingSubmitted = false;
  ratingStars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movieId: number },
    private dialogRef: MatDialogRef<MovieDetailsComponent>,
    public movieService: MovieService,
    public imageService: ImageService,
    private alerts: AlertsService
  ) { }

  ngOnInit() {
    this.loadMovieDetails();
    this.getGuestSession();
  }

  private loadMovieDetails() {
    this.movieService.getMovieDetails(this.data.movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movie details:', error);
        this.alerts.error('Error loading movie details');
        this.loading = false;
      }
    });
  }

  private getGuestSession() {
    this.movieService.getGuestSessionId().subscribe({
      next: (response) => {
        this.sessionId = response.guest_session_id;
      },
      error: (error) => {
        console.error('Error getting guest session:', error);
      }
    });
  }

  onRatingChange(rating: number) {
    this.rating = rating;
  }

  submitRating() {
    if (!this.sessionId || !this.movie) {
      this.alerts.error('Unable to submit rating');
      return;
    }

    this.movieService.rateMovie(this.movie.id, this.rating, this.sessionId).subscribe({
      next: () => {
        this.ratingSubmitted = true;
        this.alerts.success('Rating submitted successfully!');
      },
      error: (error) => {
        console.error('Error submitting rating:', error);
        this.alerts.error('Error submitting rating');
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
} 