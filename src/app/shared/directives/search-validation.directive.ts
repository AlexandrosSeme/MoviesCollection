import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appSearchValidation]'
})
export class SearchValidationDirective {
  @Input() minLength: number = 3;

  constructor(
    private el: ElementRef,
    private control: NgControl
  ) { }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove non-alphanumeric characters
    value = value.replace(/[^a-zA-Z0-9\s]/g, '');

    // Update the input value
    if (value !== input.value) {
      input.value = value;
      if (this.control.control) {
        this.control.control.setValue(value, { emitEvent: false });
      }
    }
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    // Allow only alphanumeric characters and space
    const pattern = /[a-zA-Z0-9\s]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    const cleanText = pastedText.replace(/[^a-zA-Z0-9\s]/g, '');
    
    const input = this.el.nativeElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentValue = input.value;
    
    const newValue = currentValue.substring(0, start) + cleanText + currentValue.substring(end);
    input.value = newValue;
    
    if (this.control.control) {
      this.control.control.setValue(newValue, { emitEvent: false });
    }
    
    // Set cursor position
    const newCursorPosition = start + cleanText.length;
    input.setSelectionRange(newCursorPosition, newCursorPosition);
  }
} 