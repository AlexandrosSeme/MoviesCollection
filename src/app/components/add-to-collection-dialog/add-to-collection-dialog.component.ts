import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CollectionService } from '../../services/collection.service';
import { UiService } from '../../shared/services/ui.service';
import { Movie, MovieCollection } from '../../models/movie.model';

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
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    this.loadCollections();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCollections(): void {
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
          this.uiService.showError('Failed to load collections');
          this.loading = false;
        }
      });
  }

  onCollectionSelect(collectionId: string): void {
    this.selectedCollectionId = collectionId;
  }

  onAddToCollection(): void {
    if (!this.selectedCollectionId) {
      this.uiService.showWarning('Please select a collection');
      return;
    }

    this.collectionService.addMoviesToCollection(this.selectedCollectionId, this.data.movies);
    this.uiService.showSuccess('Movies added to collection successfully!');
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getMovieTitles(): string {
    return this.data.movies.map(movie => movie.title).join(', ');
  }

  getMovieCount(): number {
    return this.data.movies.length;
  }
} 