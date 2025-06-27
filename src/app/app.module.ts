import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ErrorInterceptor } from './interceptors/error.interceptor';

// Custom Components
import { SearchPageComponent } from './components/search-page/search-page.component';
import { CollectionsPageComponent } from './components/collections-page/collections-page.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { CreateCollectionDialogComponent } from './components/create-collection-dialog/create-collection-dialog.component';
import { AddToCollectionDialogComponent } from './components/add-to-collection-dialog/add-to-collection-dialog.component';
import { CollectionDetailsComponent } from './components/collection-details/collection-details.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    CollectionsPageComponent,
    MovieDetailsComponent,
    CreateCollectionDialogComponent,
    AddToCollectionDialogComponent,
    CollectionDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatToolbarModule,
    MatRadioModule,
    MatGridListModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
