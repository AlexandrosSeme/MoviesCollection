import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CollectionService } from '../../services/collection.service';
import { MovieCollection } from '../../models/movie.model';
import { CreateCollectionDialogComponent } from '../create-collection-dialog/create-collection-dialog.component';
import { AlertsService } from '../../shared/components/alerts/alerts.service';

@Component({
  selector: 'app-collections-page',
  templateUrl: './collections-page.component.html',
  styleUrls: ['./collections-page.component.scss']
})
export class CollectionsPageComponent implements OnInit, OnDestroy {
  collections: MovieCollection[] = [];
  loading = false;

  private destroy$ = new Subject<void>();
  private collectionsSubscription: Subscription | null = null;

  constructor(
    private collectionService: CollectionService,
    private dialog: MatDialog,
    private router: Router,
    private alerts: AlertsService
  ) { }

  ngOnInit() {
    this.loadCollections();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.collectionsSubscription) {
      this.collectionsSubscription.unsubscribe();
    }
  }

  private loadCollections() {
    this.loading = true;
    this.collectionsSubscription = this.collectionService.collections$
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

  createCollection() {
    const dialogRef = this.dialog.open(CreateCollectionDialogComponent, {
      width: '500px',
      data: {},
      disableClose: true
    });
  }

  openCollection(collection: MovieCollection) {
    this.router.navigate(['/collections', collection.id]);
  }

  editCollection(collection: MovieCollection) {
    const dialogRef = this.dialog.open(CreateCollectionDialogComponent, {
      width: '500px',
      data: {
        isEditing: true,
        collection: {
          id: collection.id,
          title: collection.title,
          description: collection.description
        }
      },
      disableClose: true
    });
  }

  deleteCollection(collection: MovieCollection) {
    this.alerts.confirm(`Are you sure you want to delete "${collection.title}"? This action cannot be undone.`, 'Delete Collection')
      .then(confirmed => {
        if (confirmed) {
          this.collectionService.deleteCollection(collection.id)
            .subscribe({
              next: () => {
                this.alerts.success('Collection deleted successfully');
              },
              error: (error) => {
                console.error('Error deleting collection:', error);
                this.alerts.error('Failed to delete collection');
              }
            });
        }
      });
  }
} 