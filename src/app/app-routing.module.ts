import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { CollectionsPageComponent } from './components/collections-page/collections-page.component';
import { CollectionDetailsComponent } from './components/collection-details/collection-details.component';

const routes: Routes = [
  { path: '', component: SearchPageComponent },
  { path: 'collections', component: CollectionsPageComponent },
  { path: 'collections/:id', component: CollectionDetailsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
