import { Directive, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appSearchValidation]'
})
export class SearchValidationDirective {
  @Input() minLength: number = 3;
  @Output() validationChange = new EventEmitter<boolean>();

  constructor(private el: ElementRef) { }

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;
    this.validationChange.emit(this.isValid(value));
  }

  private isValid(value: string): boolean {
    if (!value) return false;
    if (value.length < this.minLength) return false;
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
    return alphanumericRegex.test(value);
  }
} 