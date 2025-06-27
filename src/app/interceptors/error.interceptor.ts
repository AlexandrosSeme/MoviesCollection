import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertsService } from '../shared/components/alerts/alerts.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private alerts: AlertsService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else {
          errorMessage = error.status === 0 ? 'Network error' :
            error.status === 404 ? 'Resource not found' :
              error.status === 500 ? 'Server error' :
                `Error ${error.status}: ${error.message}`;
        }

        if (error.status !== 401) {
          this.alerts.error(errorMessage);
        }

        return throwError(() => error);
      })
    );
  }
} 