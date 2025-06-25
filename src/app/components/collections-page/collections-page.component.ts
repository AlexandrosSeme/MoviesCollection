import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CollectionService } from '../../services/collection.service';
import { UiService } from '../../shared/services/ui.service';
import { MovieCollection } from '../../models/movie.model';
import { CreateCollectionDialogComponent } from '../create-collection-dialog/create-collection-dialog.component';

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
    private uiService: UiService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCollections();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.collectionsSubscription) {
      this.collectionsSubscription.unsubscribe();
    }
  }

  private loadCollections(): void {
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
          this.uiService.showError('Failed to load collections');
          this.loading = false;
        }
      });
  }

  createCollection(): void {
    const dialogRef = this.dialog.open(CreateCollectionDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.uiService.showSuccess('Collection created successfully!');
        }
      });
  }

  openCollection(collection: MovieCollection): void {
    this.router.navigate(['/collections', collection.id]);
  }

  editCollection(collection: MovieCollection): void {
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

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.uiService.showSuccess('Collection updated successfully!');
        }
      });
  }

  deleteCollection(collection: MovieCollection): void {
    const confirmationData = {
      title: 'Delete Collection',
      message: `Are you sure you want to delete "${collection.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    };

    this.uiService.confirm(confirmationData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(confirmed => {
        if (confirmed) {
          this.collectionService.deleteCollection(collection.id);
          this.uiService.showSuccess('Collection deleted successfully');
        }
      });
  }
} 