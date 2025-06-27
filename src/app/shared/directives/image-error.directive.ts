import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: 'img[appImageError]'
})
export class ImageErrorDirective {
    
  @Input() fallbackSrc: string = 'assets/no-poster.jpg';

  constructor(private el: ElementRef) {}

  @HostListener('error')
  onError(): void {
    const img = this.el.nativeElement as HTMLImageElement;
    img.src = this.fallbackSrc;
  }
} 