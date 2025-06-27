import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MovieCollection } from '../../../models/movie.model';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.scss']
})
export class CollectionCardComponent {
  @Input() collection!: MovieCollection;
  @Input() showActions: boolean = true;
  
  @Output() collectionClick = new EventEmitter<MovieCollection>();
  @Output() editCollection = new EventEmitter<MovieCollection>();
  @Output() deleteCollection = new EventEmitter<MovieCollection>();

  constructor(public imageService: ImageService) {}

  onCollectionClick(): void {
    this.collectionClick.emit(this.collection);
  }

  onEditCollection(event: Event): void {
    event.stopPropagation();
    this.editCollection.emit(this.collection);
  }

  onDeleteCollection(event: Event): void {
    event.stopPropagation();
    this.deleteCollection.emit(this.collection);
  }

  getTotalMovies(): number {
    return this.collection.movies.length;
  }

  getMoviePreviews(): MovieCollection['movies'] {
    return this.collection.movies.slice(0, 3);
  }

  getMoreMoviesCount(): number {
    return Math.max(0, this.collection.movies.length - 3);
  }
} 