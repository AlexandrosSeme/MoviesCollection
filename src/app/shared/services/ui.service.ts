import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UiService {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['error-snackbar']
    });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['info-snackbar']
    });
  }

  showWarning(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['warning-snackbar']
    });
  }

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    return new Observable(observer => {
      const result = confirm(`${data.title}\n\n${data.message}`);
      observer.next(result);
      observer.complete();
    });
  }

  formatDate(date: Date | string, format: 'short' | 'long' | 'year' = 'short'): string {
    const dateObj = new Date(date);
    
    switch (format) {
      case 'long':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'year':
        return dateObj.getFullYear().toString();
      default:
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
    }
  }

  truncateText(text: string, limit: number = 100, suffix: string = '...'): string {
    if (!text) return '';
    
    if (text.length <= limit) {
      return text;
    }
    
    return text.substring(0, limit) + suffix;
  }

  getImageUrl(posterPath: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!posterPath) {
      return 'assets/no-poster.jpg';
    }
    
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/no-poster.jpg';
  }
} 