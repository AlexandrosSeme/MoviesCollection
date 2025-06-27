import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CollectionService } from '../../services/collection.service';
import { Movie, MovieCollection, LegacyMovie, convertMovieToLegacy } from '../../models/movie.model';
import { AlertsService } from '../../shared/components/alerts/alerts.service';

@Component({
  selector: 'app-add-to-collection-dialog',
  templateUrl: './add-to-collection-dialog.component.html',
  styleUrls: ['./add-to-collection-dialog.component.scss']
})
export class AddToCollectionDialogComponent implements OnInit, OnDestroy {
  collections: MovieCollection[] = [];
  selectedCollectionId: string | null = null;
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movies: Movie[] },
    private dialogRef: MatDialogRef<AddToCollectionDialogComponent>,
    private collectionService: CollectionService,
    private alerts: AlertsService
  ) { }

  ngOnInit() {
    this.loadCollections();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCollections() {
    this.loading = true;
    this.collectionService.collections$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (collections) => {
          this.collections = collections;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading collections:', error);
          this.alerts.error('Failed to load collections');
          this.loading = false;
        }
      });
  }

  onCollectionSelect(collectionId: string) {
    this.selectedCollectionId = collectionId;
  }

  onAddToCollection() {
    if (!this.selectedCollectionId) {
      this.alerts.error('Please select a collection to add the movie(s) to.');
      return;
    }
    const movies: LegacyMovie[] = this.data.movies.map(convertMovieToLegacy);
    this.collectionService.addMoviesToCollection(this.selectedCollectionId, movies)
      .subscribe({
        next: () => {
          this.alerts.success('Movie(s) added to collection!');
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error adding movies to collection:', error);
          this.alerts.error('Failed to add movies to collection');
        }
      });
  }

  onCancel() {
    this.dialogRef.close();
  }
} 