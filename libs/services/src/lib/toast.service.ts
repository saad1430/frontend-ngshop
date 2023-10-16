import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  defaultHeading = "NG Shop";

  constructor(private messageService: MessageService) {}

  showSuccess(detail: string, heading = this.defaultHeading, sticky = false) {
    this.messageService.add({
      severity: 'success',
      summary: heading,
      detail: detail,
      sticky: sticky,
    });
  }

  showInfo(detail: string, heading = this.defaultHeading, sticky = false) {
    this.messageService.add({
      severity: 'info',
      summary: heading,
      detail: detail,
      sticky: sticky,
    });
  }

  showWarn(detail: string, heading = this.defaultHeading, sticky = false) {
    this.messageService.add({
      severity: 'warn',
      summary: heading,
      detail: detail,
      sticky: sticky,
    });
  }

  showError(detail: string, heading = this.defaultHeading, sticky = false) {
    this.messageService.add({
      severity: 'error',
      summary: heading,
      detail: detail,
      sticky: sticky,
    });
  }
}
