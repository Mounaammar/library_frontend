import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksListComponent } from './books-list/books-list.component';

const routes: Routes = [
  { path: '', component: BooksListComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
// const routes: Routes = [
//   {
//     path: 'home',
//     loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
//   },
//   {
//     path: '',
//     redirectTo: 'home',
//     pathMatch: 'full'
//   },
//   {
//     path: 'list-album/:name',
//     loadChildren: () => import('./list-album/list-album.module').then( m => m.ListAlbumPageModule)
//   },
//   {
//     path: 'list-tracks/:id',
//     loadChildren: () => import('./list-track/list-track.module').then( m => m.ListTrackPageModule)
//   },
// ];



export class AppRoutingModule { }
