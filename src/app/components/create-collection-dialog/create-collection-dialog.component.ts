import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CollectionService } from '../../services/collection.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.isEditing && data.collection) {
      this.isEditing = true;
      this.title = data.collection.title;
      this.description = data.collection.description;
      this.collectionId = data.collection.id;
    }
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      if (this.isEditing) {
        this.collectionService.updateCollection(this.collectionId, this.title, this.description);
        this.snackBar.open('Collection updated successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close({ title: this.title, description: this.description });
      } else {
        const newCollection = this.collectionService.createCollection(this.title, this.description);
        this.snackBar.open('Collection created successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(newCollection);
      }
    } else {
      this.snackBar.open('Please fill all fields correctly', 'Close', { duration: 3000 });
    }
  }

  isFormValid(): boolean {
    return this.title.length >= 3 && this.description.length >= 10;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 