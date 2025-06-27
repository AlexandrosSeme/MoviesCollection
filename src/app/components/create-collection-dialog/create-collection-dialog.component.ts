import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CollectionService } from '../../services/collection.service';
import { AlertsService } from '../../shared/components/alerts/alerts.service';
import { CreateCollectionDialogData } from '../../models/collections.model';

@Component({
  selector: 'app-create-collection-dialog',
  templateUrl: './create-collection-dialog.component.html',
  styleUrls: ['./create-collection-dialog.component.scss']
})
export class CreateCollectionDialogComponent {
  title: string = '';
  description: string = '';
  isEditing: boolean = false;
  collectionId: string = '';

  constructor(
    private dialogRef: MatDialogRef<CreateCollectionDialogComponent>,
    private collectionService: CollectionService,
    @Inject(MAT_DIALOG_DATA) public data: CreateCollectionDialogData,
    private alerts: AlertsService
  ) {
    if (data?.isEditing && data?.collection) {
      this.isEditing = true;
      this.title = data.collection.title;
      this.description = data.collection.description;
      this.collectionId = data.collection.id;
    }
  }


  onSubmit() {
    if (this.isEditing) {
      this.collectionService.updateCollection(this.collectionId, this.title, this.description)
        .subscribe({
          next: () => {
            this.alerts.success('Collection updated successfully!');
            this.dialogRef.close({ title: this.title, description: this.description });
          },
          error: (error) => {
            console.error('Error updating collection:', error);
            this.alerts.error('Failed to update collection');
          }
        });
    } else {
      this.collectionService.createCollection(this.title, this.description)
        .subscribe({
          next: (newCollection) => {
            this.alerts.success('Collection created successfully!');
            this.dialogRef.close(newCollection);
          },
          error: (error) => {
            console.error('Error creating collection:', error);
            this.alerts.error('Failed to create collection');
          }
        });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 