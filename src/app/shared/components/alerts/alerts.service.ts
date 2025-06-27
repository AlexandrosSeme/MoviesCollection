import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  success(message: string, title: string = 'Success') {
    Swal.fire({
      icon: 'success',
      title,
      text: message,
      customClass: {
        confirmButton: 'swal-confirm-btn'
      }
    });
  }

  error(message: string, title: string = 'Error') {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      customClass: {
        confirmButton: 'swal-confirm-btn'
      }
    });
  }

  info(message: string, title: string = 'Info') {
    Swal.fire({
      icon: 'info',
      title,
      text: message,
      customClass: {
        confirmButton: 'swal-confirm-btn'
      }
    });
  }

  confirm(message: string, title: string = 'Are you sure?'): Promise<boolean> {
    return Swal.fire({
      icon: 'question',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      }
    }).then(result => result.isConfirmed);
  }
} 