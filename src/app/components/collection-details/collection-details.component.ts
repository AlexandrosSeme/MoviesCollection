import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../../services/collection.service';
import { MovieCollection, Movie } from '../../models/movie.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.scss']
})
export class CollectionDetailsComponent implements OnInit {
  collection: MovieCollection | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCollection();
  }

  private loadCollection(): void {
    const collectionId = this.route.snapshot.paramMap.get('id');
    if (collectionId) {
      this.collectionService.getCollectionById$(collectionId).subscribe({
        next: (collection: MovieCollection) => {
          this.collection = collection;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading collection:', error);
          this.snackBar.open('Collection not found', 'Close', { duration: 3000 });
          this.router.navigate(['/collections']);
        }
      });
    } else {
      this.router.navigate(['/collections']);
    }
  }

  openMovieDetails(movie: Movie): void {
    const dialogRef = this.dialog.open(MovieDetailsComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { movieId: movie.id }
    });
  }

  removeMovieFromCollection(movie: Movie, event: Event): void {
    event.stopPropagation();
    
    if (this.collection && confirm(`Remove "${movie.title}" from this collection?`)) {
      this.collectionService.removeMovieFromCollection(this.collection.id, movie.id);
      this.snackBar.open('Movie removed from collection', 'Close', { duration: 3000 });
    }
  }

  goBack(): void {
    this.router.navigate(['/collections']);
  }

  getImageUrl(posterPath: string): string {
    if (posterPath) {
      return `https://image.tmdb.org/t/p/w500${posterPath}`;
    }
    return 'assets/no-poster.jpg';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/no-poster.jpg';
  }

  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
} 