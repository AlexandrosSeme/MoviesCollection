import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() isSelected: boolean = false;
  @Input() showSelection: boolean = false;
  @Input() showActions: boolean = true;
  @Input() compact: boolean = false;
  
  @Output() movieClick = new EventEmitter<Movie>();
  @Output() movieSelect = new EventEmitter<Movie>();
  @Output() addToCollection = new EventEmitter<Movie>();

  onMovieClick(): void {
    if (this.showSelection) {
      // If in selection mode, toggle selection
      this.movieSelect.emit(this.movie);
    } else {
      // Otherwise, open movie details
      this.movieClick.emit(this.movie);
    }
  }

  onAddToCollection(event: Event): void {
    event.stopPropagation();
    this.addToCollection.emit(this.movie);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/no-poster.jpg';
  }

  getImageUrl(posterPath: string): string {
    return posterPath 
      ? `https://image.tmdb.org/t/p/w500${posterPath}`
      : 'assets/no-poster.jpg';
  }

  getRatingColor(rating: number): string {
    if (rating >= 8) return 'green';
    if (rating >= 6) return 'orange';
    return 'red';
  }
} 