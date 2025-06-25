import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Shared Components
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { CollectionCardComponent } from './components/collection-card/collection-card.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

// Shared Pipes
import { DateFormatPipe } from './pipes/date-format.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

// Shared Directives
import { SearchValidationDirective } from './directives/search-validation.directive';

// Shared Services
import { UiService } from './services/ui.service';

// Shared Constants
export * from './constants/app.constants';

const SHARED_COMPONENTS = [
  MovieCardComponent,
  CollectionCardComponent,
  LoadingSpinnerComponent
];

const SHARED_PIPES = [
  DateFormatPipe,
  TruncatePipe
];

const SHARED_DIRECTIVES = [
  SearchValidationDirective
];

const SHARED_SERVICES = [
  UiService
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
    MatTooltipModule
  ],
  providers: [
    ...SHARED_SERVICES
  ]
})
export class SharedModule { } 