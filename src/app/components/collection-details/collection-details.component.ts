import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../../services/collection.service';
import { MovieCollection, Movie } from '../../models/movie.model';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { AlertsService } from '../../shared/components/alerts/alerts.service';

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.scss']
})
export class CollectionDetailsComponent implements OnInit {
  collection: MovieCollection | null = null;
  loading = true;

  get moviesAsMovieType(): Movie[] {
    return (this.collection?.movies ?? []) as unknown as Movie[];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private dialog: MatDialog,
    private alerts: AlertsService
  ) { }

  ngOnInit() {
    this.loadCollection();
  }

  private loadCollection() {
    const collectionId = this.route.snapshot.paramMap.get('id');
    if (collectionId) {
      this.collectionService.getCollectionById$(collectionId).subscribe({
        next: (collection: MovieCollection) => {
          this.collection = collection;
          this.loading = false;
        },
        error: (error: Error) => {
          console.error('Error loading collection:', error);
          this.alerts.error('Failed to load collection');
          this.loading = false;
          this.router.navigate(['/collections']);
        }
      });
    } else {
      this.router.navigate(['/collections']);
    }
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

  removeMovieFromCollection(movie: Movie) {
    this.alerts.confirm(`Are you sure you want to remove "${movie.title}" from this collection?`, 'Remove Movie')
      .then(confirmed => {
        if (confirmed && this.collection) {
          this.collectionService.removeMovieFromCollection(this.collection.id, movie.id)
            .subscribe({
              next: () => {
                this.alerts.success('Movie removed from collection');
              },
              error: (error) => {
                console.error('Error removing movie from collection:', error);
                this.alerts.error('Failed to remove movie from collection');
              }
            });
        }
      });
  }

  goBack() {
    this.router.navigate(['/collections']);
  }
} 