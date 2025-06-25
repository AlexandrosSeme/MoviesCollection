import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export abstract class BaseService {
  
  protected handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // Log error details for debugging
      if (error.error) {
        console.error('Error details:', error.error);
      }
      
      // Return a user-friendly error message
      return throwError(() => new Error(`Operation failed: ${error.message || 'Unknown error'}`));
    };
  }

  protected retryWithBackoff<T>(retries = 3, delay = 1000) {
    return retry({
      count: retries,
      delay: (error, retryCount) => {
        const backoffDelay = delay * Math.pow(2, retryCount - 1);
        console.log(`Retry attempt ${retryCount} after ${backoffDelay}ms`);
        return new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    });
  }

  protected logOperation(operation: string, data?: any): void {
    console.log(`[${this.constructor.name}] ${operation}`, data || '');
  }

  protected logError(operation: string, error: any): void {
    console.error(`[${this.constructor.name}] ${operation} failed:`, error);
  }
} 