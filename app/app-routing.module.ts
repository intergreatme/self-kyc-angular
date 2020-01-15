import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormComponent } from './form/form.component';
import { ProfileComponent } from './profile/profile.component';
import { AddIdCardComponent } from './profile/add-id-card/add-id-card.component';
import {AddPorComponent} from './profile/add-por/add-por.component';

const routes: Routes = [
  { path: '',
    component: FormComponent,
    canActivate: []
  },

  { path: 'form', component: FormComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'add-id-card', component: AddIdCardComponent },
  { path: 'add-por', component: AddPorComponent },


  {
    path: 'next',
    component: FormComponent
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '/form', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
