import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { CollectionCardComponent } from './components/collection-card/collection-card.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

import { DateFormatPipe } from './pipes/date-format.pipe';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { JoinByPropertyPipe, ArrayLengthPipe } from './pipes/array-to-string.pipe';
import { SearchValidationDirective } from './directives/search-validation.directive';
import { ImageErrorDirective } from './directives/image-error.directive';

const SHARED_COMPONENTS = [
  MovieCardComponent,
  CollectionCardComponent,
  LoadingSpinnerComponent
];

const SHARED_PIPES = [
  DateFormatPipe,
  CurrencyFormatPipe,
  JoinByPropertyPipe,
  ArrayLengthPipe
];

const SHARED_DIRECTIVES = [
  SearchValidationDirective,
  ImageErrorDirective
];

@NgModule({
  declarations: [
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES,
    ...SHARED_DIRECTIVES
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  exports: [
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES,
    ...SHARED_DIRECTIVES,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    JoinByPropertyPipe,
    ArrayLengthPipe
  ]
})
export class SharedModule { } 