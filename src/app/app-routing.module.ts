import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaceComponent } from './base/comps/face/face.component';

const routes: Routes = [
  { path: './home', component: FaceComponent },

  { path: '**', component: FaceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
