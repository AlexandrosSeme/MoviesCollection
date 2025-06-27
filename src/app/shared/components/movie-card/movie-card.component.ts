import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../../../models/movie.model';
import { ImageService } from '../../../services/image.service';

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
  @Input() showRemoveButton: boolean = false;

  @Output() movieClick = new EventEmitter<Movie>();
  @Output() movieSelect = new EventEmitter<Movie>();
  @Output() addToCollection = new EventEmitter<Movie>();
  @Output() removeMovie = new EventEmitter<Movie>();

  constructor(public imageService: ImageService) {}

  onMovieClick(): void {
    if (this.showSelection) {
      this.movieSelect.emit(this.movie);
    } else {
      this.movieClick.emit(this.movie);
    }
  }

  onAddToCollection(event: Event): void {
    event.stopPropagation();
    this.addToCollection.emit(this.movie);
  }

  onRemoveMovie(event: Event): void {
    event.stopPropagation();
    this.removeMovie.emit(this.movie);
  }
} 